
import api from './api'

const analysisService = {
  async analyzeResume(resumeText) {
    const response = await api.post('/analyses', {
      resume_text: resumeText,
    })
    return response.data
  },

  async getHistory() {
    const response = await api.get('/analyses')
    return response.data
  },

  async getAnalysisById(id) {
    const response = await api.get(`/analyses/${id}`)
    return response.data
  },
}

export default analysisService
