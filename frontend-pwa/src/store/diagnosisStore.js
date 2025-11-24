import { create } from 'zustand'

export const useDiagnosisStore = create((set) => ({
  // State
  image: null,
  imageTags: [],
  diagnosis: null,
  treatmentPlan: null,
  loading: false,
  error: null,
  farmerId: localStorage.getItem('farmerId') || null,
  region: localStorage.getItem('region') || null,
  cropType: localStorage.getItem('cropType') || null,

  // Actions
  setImage: (image) => set({ image }),
  setImageTags: (tags) => set({ imageTags: tags }),
  setDiagnosis: (diagnosis) => set({ diagnosis }),
  setTreatmentPlan: (plan) => set({ treatmentPlan: plan }),
  setLoading: (loading) => set({ loading }),
  setError: (error) => set({ error }),
  setFarmerId: (id) => {
    localStorage.setItem('farmerId', id)
    set({ farmerId: id })
  },
  setRegion: (region) => {
    localStorage.setItem('region', region)
    set({ region })
  },
  setCropType: (type) => {
    localStorage.setItem('cropType', type)
    set({ cropType: type })
  },
  reset: () => set({
    image: null,
    imageTags: [],
    diagnosis: null,
    treatmentPlan: null,
    loading: false,
    error: null,
  }),
}))
