import { api } from './api-service';
export async function getStatus() {
  const response = await api.get('/processo/status');
  return response.data;
}
