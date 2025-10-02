import { api } from './api-service';

export interface IRelatorioPost {
  idFuncionario: number;
  conteudo: string;
}

export interface IRelatorioResponse {
  id: number;
  funcionario: {
    id: number;
    nome: string;
    cargo: string;
  };
  conteudo: string;
  created_at: string;
}
export async function enviarNovoRelatorio(data: IRelatorioPost) {
  const response = await api.post('/relatorios', data);
  return response.data;
}

export async function getRelatoriosByFuncionarioID(id: number) {
  const response = await api.get<IRelatorioResponse[]>(`/relatorios/funcionario/${id}`);
  return response.data;
}
