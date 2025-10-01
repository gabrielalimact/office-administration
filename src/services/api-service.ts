import axios, { AxiosError, AxiosResponse, InternalAxiosRequestConfig } from 'axios';
import Cookies from 'js-cookie';

const baseURL = process.env.NEXT_PUBLIC_API_URL;

export const api = axios.create({
  baseURL: `${baseURL}`,
});

export const apiCep = axios.create({
  baseURL: `https://viacep.com.br/ws`,
});

function setAuthorizationHeader(config: InternalAxiosRequestConfig) {
  const token = Cookies.get('access_token');
  if (token) {
    config.headers['Authorization'] = `Bearer ${token}`;
  }
  return config;
}

const setErrorRequest = (error: AxiosError) => Promise.reject(error);

export async function refreshToken() {
  const refresh_token = Cookies.get('refresh_token');

  const formData = new URLSearchParams();
  formData.append('refreshToken', refresh_token || '');

  const { data } = await axios.post(`${baseURL}/auth/refreshToken`, formData, {
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded',
    },
  });

  const accessToken = data.accessToken;
  const refreshToken = data.refreshToken;
  Cookies.set('access_token', accessToken);
  Cookies.set('refresh_token', refreshToken);

  return data;
}

export function logout() {
  Cookies.remove('access_token');
  Cookies.remove('refresh_token');
  const currentPath = window.location.pathname;
  const loginPath = '/';

  if (currentPath !== loginPath) {
    window.location.href = loginPath;
  }
}

function setAxiosResponseInterceptor(response: AxiosResponse) {
  return response;
}

async function setErrorResponseInteceptor(error: AxiosError) {
  if (
    error.response &&
    (error.response.status === 403 ||
      (error.response.status === 401 && error.response.data === 'JWT token is expired'))
  ) {
    logout();
  }

  return Promise.reject(error);
}

api.interceptors.request.use(setAuthorizationHeader, setErrorRequest);
api.interceptors.response.use(setAxiosResponseInterceptor, setErrorResponseInteceptor);
