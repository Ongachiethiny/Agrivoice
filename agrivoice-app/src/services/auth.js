const API_URL = import.meta.env.VITE_API_URL || 'https://agrivoice-backend-aefdd2d38be7.herokuapp.com'

// Local storage keys
const STORAGE_KEYS = {
  ACCESS_TOKEN: 'agrivoice_access_token',
  REFRESH_TOKEN: 'agrivoice_refresh_token',
  USER: 'agrivoice_user'
}

export const authService = {
  // Store tokens
  setTokens: (accessToken, refreshToken) => {
    localStorage.setItem(STORAGE_KEYS.ACCESS_TOKEN, accessToken)
    localStorage.setItem(STORAGE_KEYS.REFRESH_TOKEN, refreshToken)
  },

  // Get access token
  getAccessToken: () => {
    return localStorage.getItem(STORAGE_KEYS.ACCESS_TOKEN)
  },

  // Get refresh token
  getRefreshToken: () => {
    return localStorage.getItem(STORAGE_KEYS.REFRESH_TOKEN)
  },

  // Store user info
  setUser: (user) => {
    localStorage.setItem(STORAGE_KEYS.USER, JSON.stringify(user))
  },

  // Get user info
  getUser: () => {
    const user = localStorage.getItem(STORAGE_KEYS.USER)
    return user ? JSON.parse(user) : null
  },

  // Check if user is logged in
  isAuthenticated: () => {
    return !!localStorage.getItem(STORAGE_KEYS.ACCESS_TOKEN)
  },

  // Register new user
  register: async (email, password, fullName, farmLocation = null) => {
    try {
      const response = await fetch(`${API_URL}/api/auth/register`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          email,
          password,
          full_name: fullName,
          farm_location: farmLocation
        })
      })

      if (!response.ok) {
        const error = await response.json()
        throw new Error(error.detail || 'Registration failed')
      }

      const data = await response.json()
      authService.setTokens(data.access_token, data.refresh_token)
      authService.setUser(data.user)
      return data
    } catch (error) {
      console.error('Registration error:', error)
      throw error
    }
  },

  // Login user
  login: async (email, password) => {
    try {
      const response = await fetch(`${API_URL}/api/auth/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          email,
          password
        })
      })

      if (!response.ok) {
        const error = await response.json()
        throw new Error(error.detail || 'Login failed')
      }

      const data = await response.json()
      authService.setTokens(data.access_token, data.refresh_token)
      authService.setUser(data.user)
      return data
    } catch (error) {
      console.error('Login error:', error)
      throw error
    }
  },

  // Refresh access token
  refreshAccessToken: async () => {
    try {
      const refreshToken = authService.getRefreshToken()
      if (!refreshToken) {
        throw new Error('No refresh token available')
      }

      const response = await fetch(`${API_URL}/api/auth/refresh`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          refresh_token: refreshToken
        })
      })

      if (!response.ok) {
        // Refresh failed, user needs to login again
        authService.logout()
        throw new Error('Session expired. Please login again.')
      }

      const data = await response.json()
      authService.setTokens(data.access_token, data.refresh_token)
      return data.access_token
    } catch (error) {
      console.error('Token refresh error:', error)
      throw error
    }
  },

  // Get user profile
  getUserProfile: async () => {
    try {
      const accessToken = authService.getAccessToken()
      if (!accessToken) {
        throw new Error('Not authenticated')
      }

      const response = await fetch(`${API_URL}/api/auth/me`, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${accessToken}`,
          'Content-Type': 'application/json'
        }
      })

      if (response.status === 401) {
        // Token expired, try to refresh
        const newToken = await authService.refreshAccessToken()
        return authService.getUserProfile() // Retry with new token
      }

      if (!response.ok) {
        throw new Error('Failed to fetch profile')
      }

      const data = await response.json()
      authService.setUser(data)
      return data
    } catch (error) {
      console.error('Profile fetch error:', error)
      throw error
    }
  },

  // Logout user
  logout: () => {
    localStorage.removeItem(STORAGE_KEYS.ACCESS_TOKEN)
    localStorage.removeItem(STORAGE_KEYS.REFRESH_TOKEN)
    localStorage.removeItem(STORAGE_KEYS.USER)
  },

  // Get authorization header
  getAuthHeader: () => {
    const token = authService.getAccessToken()
    return token ? { 'Authorization': `Bearer ${token}` } : {}
  }
}
