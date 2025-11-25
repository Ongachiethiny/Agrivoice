import { authService } from '../services/auth'

// Mock localStorage
const localStorageMock = (() => {
  let store = {}
  return {
    getItem: (key) => store[key] || null,
    setItem: (key, value) => {
      store[key] = value.toString()
    },
    removeItem: (key) => {
      delete store[key]
    },
    clear: () => {
      store = {}
    }
  }
})()

Object.defineProperty(window, 'localStorage', {
  value: localStorageMock
})

describe('Auth Service', () => {
  beforeEach(() => {
    localStorage.clear()
    jest.clearAllMocks()
  })

  describe('Token Management', () => {
    test('should save tokens', () => {
      const tokens = {
        access_token: 'access-123',
        refresh_token: 'refresh-456'
      }
      authService.setTokens(tokens)
      
      expect(localStorage.setItem).toHaveBeenCalled()
      expect(authService.getAccessToken()).toBe('access-123')
    })

    test('should retrieve access token', () => {
      const tokens = {
        access_token: 'test-access-token',
        refresh_token: 'test-refresh-token'
      }
      authService.setTokens(tokens)
      
      expect(authService.getAccessToken()).toBe('test-access-token')
    })

    test('should clear tokens on logout', () => {
      const tokens = {
        access_token: 'access-123',
        refresh_token: 'refresh-456'
      }
      authService.setTokens(tokens)
      authService.logout()
      
      expect(authService.isAuthenticated()).toBe(false)
    })

    test('should check authentication status', () => {
      expect(authService.isAuthenticated()).toBe(false)
      
      authService.setTokens({
        access_token: 'token',
        refresh_token: 'refresh'
      })
      
      expect(authService.isAuthenticated()).toBe(true)
    })
  })

  describe('User Data', () => {
    test('should save user data', () => {
      const userData = {
        id: '123',
        email: 'test@example.com',
        username: 'testuser'
      }
      authService.setUserData(userData)
      
      expect(authService.getUserData()).toEqual(userData)
    })

    test('should clear user data on logout', () => {
      const userData = {
        id: '123',
        email: 'test@example.com',
        username: 'testuser'
      }
      authService.setUserData(userData)
      authService.logout()
      
      expect(authService.getUserData()).toBeNull()
    })
  })
})
