/**
 * Error Handling Utilities
 * Provides retry logic, error recovery, and fallback responses
 */

// Retry configuration
const RETRY_CONFIG = {
  maxRetries: 3,
  initialDelayMs: 1000,
  maxDelayMs: 10000,
  backoffMultiplier: 2
}

// Error codes that should be retried
const RETRYABLE_ERRORS = [
  408, // Request Timeout
  429, // Too Many Requests
  500, // Internal Server Error
  502, // Bad Gateway
  503, // Service Unavailable
  504  // Gateway Timeout
]

export const errorHandler = {
  /**
   * Make an API request with automatic retry logic
   */
  fetchWithRetry: async (url, options = {}, config = RETRY_CONFIG) => {
    let lastError
    let delay = config.initialDelayMs

    for (let attempt = 0; attempt <= config.maxRetries; attempt++) {
      try {
        const response = await fetch(url, options)

        // If successful, return response
        if (response.ok) {
          return response
        }

        // Check if this error should be retried
        if (RETRYABLE_ERRORS.includes(response.status) && attempt < config.maxRetries) {
          lastError = new Error(`HTTP ${response.status}: ${response.statusText}`)
          
          // Wait before retrying
          console.warn(`Attempt ${attempt + 1} failed with ${response.status}. Retrying in ${delay}ms...`)
          await errorHandler.delay(delay)
          
          // Increase delay for next retry
          delay = Math.min(delay * config.backoffMultiplier, config.maxDelayMs)
          continue
        }

        // Non-retryable error, return response
        return response

      } catch (err) {
        lastError = err
        
        // Network errors can be retried if we haven't exceeded max retries
        if (attempt < config.maxRetries) {
          console.warn(`Attempt ${attempt + 1} failed with error: ${err.message}. Retrying in ${delay}ms...`)
          await errorHandler.delay(delay)
          
          delay = Math.min(delay * config.backoffMultiplier, config.maxDelayMs)
          continue
        }
      }
    }

    throw lastError || new Error('Request failed after maximum retries')
  },

  /**
   * Delay execution (for retry backoff)
   */
  delay: (ms) => {
    return new Promise(resolve => setTimeout(resolve, ms))
  },

  /**
   * Get user-friendly error message from error
   */
  getMessage: (error) => {
    if (typeof error === 'string') {
      return error
    }

    if (error.message) {
      return error.message
    }

    if (error.detail) {
      return error.detail
    }

    return 'An unexpected error occurred. Please try again.'
  },

  /**
   * Check if error is network-related
   */
  isNetworkError: (error) => {
    if (!error) return false
    
    const networkErrors = [
      'Network request failed',
      'Failed to fetch',
      'NetworkError',
      'TypeError'
    ]

    return networkErrors.some(type => 
      error.message?.includes(type) || error.toString?.().includes(type)
    )
  },

  /**
   * Check if error is authentication-related
   */
  isAuthError: (error) => {
    return error?.status === 401 || 
           error?.message?.includes('Unauthorized') ||
           error?.message?.includes('Not authenticated')
  },

  /**
   * Check if error is server-related
   */
  isServerError: (error) => {
    return error?.status >= 500 || 
           error?.message?.includes('Internal Server Error')
  },

  /**
   * Get retry recommendation
   */
  shouldRetry: (error) => {
    if (!error) return false
    
    // Retry on network errors
    if (errorHandler.isNetworkError(error)) {
      return true
    }

    // Retry on server errors
    if (errorHandler.isServerError(error)) {
      return true
    }

    // Don't retry on auth errors, client errors
    return false
  },

  /**
   * Format error for logging
   */
  formatForLogging: (error, context = '') => {
    return {
      timestamp: new Date().toISOString(),
      context,
      message: errorHandler.getMessage(error),
      status: error?.status,
      type: errorHandler.isNetworkError(error) ? 'NETWORK' :
            errorHandler.isAuthError(error) ? 'AUTH' :
            errorHandler.isServerError(error) ? 'SERVER' : 'CLIENT',
      canRetry: errorHandler.shouldRetry(error),
      fullError: error.toString()
    }
  }
}

/**
 * Enhanced fetch wrapper for API calls
 */
export const apiCall = async (url, options = {}) => {
  const defaultOptions = {
    headers: {
      'Content-Type': 'application/json',
      ...options.headers
    },
    ...options
  }

  try {
    const response = await errorHandler.fetchWithRetry(url, defaultOptions)

    if (!response.ok) {
      let errorData
      try {
        errorData = await response.json()
      } catch {
        errorData = { detail: response.statusText }
      }

      const error = new Error(errorData.detail || 'API request failed')
      error.status = response.status
      throw error
    }

    return await response.json()

  } catch (error) {
    console.error('API call error:', errorHandler.formatForLogging(error, url))
    throw error
  }
}
