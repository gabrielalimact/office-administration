import { api } from './api-service';

export interface IUsuario {
  cpf: string;
  cargo: string;
  nome: string;
  senha: string;
  email: string;
}

export interface IUsuarioResponse {
  id: number;
  cpf: string;
  cargo: string;
  nome: string;
  senha: string;
  email: string;
}
export async function cadastrarNovoUsuario(usuario: IUsuario) {
  const params = new URLSearchParams();
  params.append('cpf', usuario.cpf);
  params.append('senha', usuario.senha);
  params.append('email', usuario.email);
  params.append('cargo', usuario.cargo);
  params.append('nome', usuario.nome);

  const response = await api.post('/usuario', params);
  return response.data;
}

export async function getFuncionarios() {
  const response = await api.get<IUsuarioResponse[]>('/usuario');
  return response.data;
}