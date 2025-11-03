import axios, { AxiosError, AxiosResponse, InternalAxiosRequestConfig } from 'axios'
import Cookies from 'js-cookie'

interface ExtendedAxiosRequestConfig extends InternalAxiosRequestConfig {
  _retry?: boolean
}

const baseURL = process.env.NEXT_PUBLIC_API_URL

export const api = axios.create({
  baseURL: `${baseURL}`
})

export const apiCep = axios.create({
  baseURL: 'https://viacep.com.br/ws'
})

async function setAuthorizationHeader(config: InternalAxiosRequestConfig) {
  if (
    isTokenExpiringSoon() &&
    !config.url?.includes('/auth/refresh') &&
    !config.url?.includes('/auth/login')
  ) {
    try {
      await refreshToken()
    } catch (error) {
      console.error('Erro ao renovar token proativamente:', error)
    }
  }

  const token = Cookies.get('access_token')
  if (token) {
    config.headers['Authorization'] = `Bearer ${token}`
  }
  return config
}

const setErrorRequest = (error: AxiosError) => Promise.reject(error)

export async function refreshToken() {
  const refresh_token = Cookies.get('refresh_token')

  if (!refresh_token) {
    logout()
    throw new Error('No refresh token available')
  }

  try {
    const { data } = await axios.post(
      `${baseURL}/auth/refresh`,
      {
        refresh_token: refresh_token
      },
      {
        headers: {
          'Content-Type': 'application/json'
        }
      }
    )

    const accessToken = data.access_token

    Cookies.set('access_token', accessToken, {
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      expires: 1 / 96
    })

    return data
  } catch (error) {
    logout()
    throw error
  }
}
export function isTokenExpiringSoon(): boolean {
  const token = Cookies.get('access_token')

  if (!token) return true

  try {
    const payload = JSON.parse(atob(token.split('.')[1]))
    const currentTime = Math.floor(Date.now() / 1000)
    const timeUntilExpiry = payload.exp - currentTime

    return timeUntilExpiry < 300
  } catch {
    return true
  }
}
export async function refreshTokenIfNeeded(): Promise<void> {
  if (isTokenExpiringSoon()) {
    try {
      await refreshToken()
    } catch (error) {
      console.error('Erro ao renovar token proativamente:', error)
    }
  }
}

export function logout() {
  localStorage.removeItem('user')
  Cookies.remove('access_token')
  Cookies.remove('refresh_token')
  const currentPath = window.location.pathname
  const loginPath = '/'

  if (currentPath !== loginPath) {
    window.location.href = loginPath
  }
}

function setAxiosResponseInterceptor(response: AxiosResponse) {
  return response
}

async function setErrorResponseInteceptor(error: AxiosError) {
  const originalRequest = error.config as ExtendedAxiosRequestConfig

  if (
    error.response?.status === 401 &&
    originalRequest &&
    !originalRequest.url?.includes('/auth/refresh') &&
    !originalRequest._retry
  ) {
    originalRequest._retry = true

    try {
      await refreshToken()

      const newToken = Cookies.get('access_token')
      if (newToken && originalRequest.headers) {
        originalRequest.headers['Authorization'] = `Bearer ${newToken}`
      }

      return api(originalRequest)
    } catch (refreshError) {
      logout()
      return Promise.reject(refreshError)
    }
  }

  if (
    error.response &&
    (error.response.status === 403 ||
      (error.response.status === 401 && error.response.data === 'JWT token is expired'))
  ) {
    logout()
  }

  return Promise.reject(error)
}

api.interceptors.request.use(setAuthorizationHeader, setErrorRequest)
api.interceptors.response.use(setAxiosResponseInterceptor, setErrorResponseInteceptor)
