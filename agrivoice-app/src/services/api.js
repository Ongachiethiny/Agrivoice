const API_URL = import.meta.env.VITE_API_URL || 'https://agrivoice-backend-aefdd2d38be7.herokuapp.com'

export const apiClient = {
  // Diagnosis endpoint
  diagnose: async (imageFile, query, language = 'en') => {
    try {
      const formData = new FormData()
      formData.append('file', imageFile)
      formData.append('query', query)
      formData.append('language', language)

      const response = await fetch(`${API_URL}/api/diagnose`, {
        method: 'POST',
        body: formData,
      })

      if (!response.ok) {
        throw new Error(`API error: ${response.statusText}`)
      }

      return await response.json()
    } catch (error) {
      console.error('Diagnosis error:', error)
      throw error
    }
  },

  // Analytics endpoints
  getAnalyticsSummary: async () => {
    try {
      const response = await fetch(`${API_URL}/api/analytics/summary`)
      if (!response.ok) throw new Error('Failed to fetch summary')
      return await response.json()
    } catch (error) {
      console.error('Analytics summary error:', error)
      throw error
    }
  },

  getDiseases: async () => {
    try {
      const response = await fetch(`${API_URL}/api/analytics/diseases`)
      if (!response.ok) throw new Error('Failed to fetch diseases')
      return await response.json()
    } catch (error) {
      console.error('Diseases error:', error)
      throw error
    }
  },

  getImpact: async () => {
    try {
      const response = await fetch(`${API_URL}/api/analytics/impact`)
      if (!response.ok) throw new Error('Failed to fetch impact')
      return await response.json()
    } catch (error) {
      console.error('Impact error:', error)
      throw error
    }
  },

  getRawData: async () => {
    try {
      const response = await fetch(`${API_URL}/api/analytics/raw`)
      if (!response.ok) throw new Error('Failed to fetch raw data')
      return await response.json()
    } catch (error) {
      console.error('Raw data error:', error)
      throw error
    }
  },

  // Health check
  healthCheck: async () => {
    try {
      const response = await fetch(`${API_URL}/health`)
      return response.ok
    } catch {
      return false
    }
  },
}
