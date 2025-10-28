import { Cliente } from '../../types/cliente';
import { api } from './api-service';

export async function getClientes() {
  const response = await api.get<Cliente[]>('/cliente');
  return response.data;
}

export async function deletarCliente(id: number) {
  const response = await api.delete(`/cliente/${id}`);
  return response.data;
}

export async function getClientePorId(id: number): Promise<Cliente> {
  const response = await api.get(`/cliente/${id}`);
  return response.data;
}
