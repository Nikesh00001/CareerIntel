
import api from './api'

const roadmapService = {
  async getRoadmap() {
    const response = await api.get('/roadmaps')
    return response.data
  },

  async saveRoadmap(roadmapData) {
    const response = await api.post('/roadmaps', roadmapData)
    return response.data
  },

  async updateStep(stepId, status) {
    const response = await api.patch(`/roadmaps/${stepId}`, {
      status,
    })
    return response.data
  },
}

export default roadmapService
