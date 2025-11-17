import axios from "axios"

// ==============================
// FIX: Base URL LANGSUNG KE BACKEND
// ==============================
const api = axios.create({
  baseURL: "http://localhost:8000/api", // ✔ LANGSUNG PAKAI BACKEND
  headers: {
    Accept: "application/json",
    "Content-Type": "application/json",
  },
})

// ==============================
// TOKEN OTOMATIS
// ==============================
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("token")
    if (token) {
      config.headers.Authorization = `Bearer ${token}`
    }
    return config
  },
  (error) => Promise.reject(error)
)

// ==============================
// AUTO LOGOUT jika TOKEN EXPIRED
// ==============================
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response && error.response.status === 401) {
      localStorage.clear()
      window.location.href = "/login"
    }
    return Promise.reject(error)
  }
)

export default api
