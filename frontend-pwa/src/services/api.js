const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000'

export const apiClient = {
  async analyzeImage(file) {
    const formData = new FormData()
    formData.append('file', file)
    
    const response = await fetch(`${API_BASE_URL}/api/v1/analyze-image`, {
      method: 'POST',
      body: formData,
    })
    
    if (!response.ok) throw new Error('Failed to analyze image')
    return response.json()
  },

  async diagnose(imageTags, question, cropType, region, farmerId) {
    const response = await fetch(`${API_BASE_URL}/api/v1/diagnose`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        image_tags: imageTags,
        user_question: question,
        crop_type: cropType,
        region: region,
        farmer_id: farmerId,
      }),
    })
    
    if (!response.ok) throw new Error('Failed to diagnose crop')
    return response.json()
  },

  async getTreatmentPlan(diagnosis) {
    const response = await fetch(`${API_BASE_URL}/api/v1/treatment-plan`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(diagnosis),
    })
    
    if (!response.ok) throw new Error('Failed to generate treatment plan')
    return response.json()
  },

  async speechToText(audioBlob) {
    const formData = new FormData()
    formData.append('file', audioBlob, 'audio.wav')
    
    const response = await fetch(`${API_BASE_URL}/api/v1/speech-to-text`, {
      method: 'POST',
      body: formData,
    })
    
    if (!response.ok) throw new Error('Failed to convert speech to text')
    return response.json()
  },

  async textToSpeech(text) {
    const response = await fetch(`${API_BASE_URL}/api/v1/text-to-speech?text=${encodeURIComponent(text)}&save_file=true`, {
      method: 'POST',
    })
    
    if (!response.ok) throw new Error('Failed to convert text to speech')
    return response.json()
  },
}
