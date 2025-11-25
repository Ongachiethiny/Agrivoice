const API_BASE_URL = import.meta.env.VITE_API_URL || 'https://agrivoice-backend-aefdd2d38be7.herokuapp.com'

export const apiClient = {
  // Health check
  async healthCheck() {
    const response = await fetch(`${API_BASE_URL}/health`)
    if (!response.ok) throw new Error('Backend is down')
    return response.json()
  },

  // Main diagnosis endpoint - handles everything
  async diagnose(imageFile, query, language = 'en') {
    const formData = new FormData()
    formData.append('file', imageFile)
    formData.append('query', query)
    formData.append('language', language)
    
    const response = await fetch(`${API_BASE_URL}/api/diagnose`, {
      method: 'POST',
      body: formData,
    })
    
    if (!response.ok) {
      const error = await response.json()
      throw new Error(error.error || 'Failed to diagnose crop')
    }
    return response.json()
  },

  // Get analytics summary
  async getAnalyticsSummary() {
    const response = await fetch(`${API_BASE_URL}/api/analytics/summary`)
    if (!response.ok) throw new Error('Failed to fetch analytics')
    return response.json()
  },

  // Get diseases breakdown
  async getDiseases() {
    const response = await fetch(`${API_BASE_URL}/api/analytics/diseases`)
    if (!response.ok) throw new Error('Failed to fetch diseases')
    return response.json()
  },

  // Get impact metrics
  async getImpact() {
    const response = await fetch(`${API_BASE_URL}/api/analytics/impact`)
    if (!response.ok) throw new Error('Failed to fetch impact')
    return response.json()
  },

  // Get raw data
  async getRawData() {
    const response = await fetch(`${API_BASE_URL}/api/analytics/raw`)
    if (!response.ok) throw new Error('Failed to fetch data')
    return response.json()
  },
}
