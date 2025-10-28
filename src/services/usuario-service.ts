import { ProcessosPorFuncionario } from '../../types/processos';
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

export async function getFuncionariosByID(id: number) {
  const response = await api.get<IUsuarioResponse>(`/usuario/${id}`);
  return response.data;
}

export async function getFuncionariosEProcessos() {
  const response = await api.get<ProcessosPorFuncionario[]>(`/usuario/funcionarios/processos`);
  return response.data;
}

export async function updateAvatar(params: { id: number; avatar: File }) {
  const formData = new FormData();
  formData.append('avatar', params.avatar);

  const response = await api.post(`/usuario/${params.id}/avatar`, formData);
  return response.data;
}

export async function updateUsuario(params: {
  id: number;
  nome?: string;
  email?: string;
  cargo?: string;
  cpf?: string;
  avatar?: File;
}) {
  const formData = new FormData();
  if (params.avatar) formData.append('imagem', params.avatar);
  if (params.nome) formData.append('nome', params.nome);
  if (params.email) formData.append('email', params.email);
  if (params.cargo) formData.append('cargo', params.cargo);
  if (params.cpf) formData.append('cpf', params.cpf);

  const response = await api.patch(`/usuario/${params.id}`, formData);
  return response.data;
}
