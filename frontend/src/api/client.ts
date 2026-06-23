import axios from 'axios'

const client = axios.create({
  baseURL: '/api',
  withCredentials: true,
})

let accessToken = ''

export const setAccessToken = (token: string) => { accessToken = token }
export const getAccessToken = () => accessToken

client.interceptors.request.use((config) => {
  if (accessToken) config.headers.Authorization = `Bearer ${accessToken}`
  return config
})

client.interceptors.response.use(
  (res) => res,
  async (error) => {
    const original = error.config
    if (error.response?.status === 401 && !original._retry) {
      original._retry = true
      try {
        const { data } = await axios.post('/api/auth/refresh-token', {}, { withCredentials: true })
        accessToken = data.data.accessToken
        original.headers.Authorization = `Bearer ${accessToken}`
        return client(original)
      } catch {
        // Refresh failed — clear token and signal React to update auth state.
        // Never use window.location.href here: it causes a hard reload (the blink).
        accessToken = ''
        window.dispatchEvent(new Event('auth:expired'))
      }
    }
    return Promise.reject(error)
  }
)

export default client
