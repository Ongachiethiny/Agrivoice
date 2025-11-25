import { authService } from './auth'

const API_URL = import.meta.env.VITE_API_URL || 'https://agrivoice-backend-aefdd2d38be7.herokuapp.com'

export const exportService = {
  /**
   * Export single diagnosis as PDF download
   */
  downloadDiagnosisPDF: async (diagnosisId) => {
    try {
      const accessToken = authService.getAccessToken()
      
      const response = await fetch(`${API_URL}/api/export/diagnosis/${diagnosisId}/pdf`, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${accessToken}`
        }
      })

      if (!response.ok) {
        throw new Error('Failed to download PDF')
      }

      // Get filename from response headers if available
      const filename = response.headers
        .get('content-disposition')
        ?.split('filename=')[1]
        ?.replace(/"/g, '') || `diagnosis_${diagnosisId}.pdf`

      const blob = await response.blob()
      const url = window.URL.createObjectURL(blob)
      const link = document.createElement('a')
      link.href = url
      link.download = filename
      document.body.appendChild(link)
      link.click()
      document.body.removeChild(link)
      window.URL.revokeObjectURL(url)

      return true
    } catch (error) {
      console.error('PDF download error:', error)
      throw error
    }
  },

  /**
   * Export entire history as PDF download
   */
  downloadHistoryPDF: async () => {
    try {
      const accessToken = authService.getAccessToken()
      
      const response = await fetch(`${API_URL}/api/export/history/pdf`, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${accessToken}`
        }
      })

      if (!response.ok) {
        throw new Error('Failed to download history PDF')
      }

      const blob = await response.blob()
      const url = window.URL.createObjectURL(blob)
      const link = document.createElement('a')
      link.href = url
      link.download = 'diagnosis_history.pdf'
      document.body.appendChild(link)
      link.click()
      document.body.removeChild(link)
      window.URL.revokeObjectURL(url)

      return true
    } catch (error) {
      console.error('History PDF download error:', error)
      throw error
    }
  },

  /**
   * Get PDF preview as base64
   */
  getPreviewPDF: async (diagnosisId) => {
    try {
      const accessToken = authService.getAccessToken()
      
      const response = await fetch(`${API_URL}/api/export/diagnosis/${diagnosisId}/pdf/preview`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${accessToken}`,
          'Content-Type': 'application/json'
        }
      })

      if (!response.ok) {
        throw new Error('Failed to get PDF preview')
      }

      const data = await response.json()
      return data.data
    } catch (error) {
      console.error('PDF preview error:', error)
      throw error
    }
  },

  /**
   * Get history preview as base64
   */
  getHistoryPreviewPDF: async () => {
    try {
      const accessToken = authService.getAccessToken()
      
      const response = await fetch(`${API_URL}/api/export/history/pdf/preview`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${accessToken}`,
          'Content-Type': 'application/json'
        }
      })

      if (!response.ok) {
        throw new Error('Failed to get history preview')
      }

      const data = await response.json()
      return data.data
    } catch (error) {
      console.error('History preview error:', error)
      throw error
    }
  }
}
