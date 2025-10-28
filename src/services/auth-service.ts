import { api } from './api-service';
import Cookies from 'js-cookie';
export async function login(cpf: string, senha: string) {
  const params = new URLSearchParams();
  params.append('cpf', cpf);
  params.append('senha', senha);

  const response = await api.post('/auth/login', params);
  Cookies.set('access_token', response.data.access_token);
  Cookies.set('refresh_token', response.data.refresh_token);
  return response.data;
}
