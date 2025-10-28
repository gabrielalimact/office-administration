import { CriarProcessoRequest, Processo } from '../../types/processos';
import { api } from './api-service';

export async function getStatus() {
  const response = await api.get('/processos/status');
  return response.data;
}

export async function getProcessos(): Promise<Processo[]> {
  const response = await api.get('/processos');
  return response.data;
}

export async function getProcessoPorId(id: number): Promise<Processo> {
  const response = await api.get(`/processos/${id}`);
  return response.data;
}

export async function criarProcesso(
  processo: CriarProcessoRequest,
  clienteID?: number,
): Promise<Processo> {
  if (clienteID) {
    const response = await api.post(`/processos/cliente/${clienteID}/processos`, processo);
    return response.data;
  }
  const response = await api.post('/processos', processo);
  return response.data;
}
