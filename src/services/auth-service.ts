import { api } from './api-service';
export async function login(cpf: string, senha: string) {
  const params = new URLSearchParams();
  params.append('cpf', cpf);
  params.append('senha', senha);

  const response = await api.post('/auth/login', params);
  return response.data;
}
