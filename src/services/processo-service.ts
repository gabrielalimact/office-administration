import { CriarProcessoRequest, Processo } from '../../types/processos';
import { NovoCliente } from '../../types/cliente';
import { api } from './api-service';

export interface CriarProcessoComNovoClienteRequest {
  cliente: NovoCliente;
  colaboradorId: number;
  beneficio: {
    id?: number;
    nome?: string;
  };
  olhar_inss: boolean;
  olhar_pje_creta: boolean;
  senha_inss?: string;
  data_atendimento: string;
  data_ultima_atualizacao: string;
  status: {
    id?: number;
    nome?: string;
  };
  observacoes?: string;
  arquivo?: File;
}

export interface CriarProcessoClienteExistenteRequest {
  statusId: number;
  beneficioId: number;
  colaboradorId: number;
  olhar_inss: boolean;
  olhar_pje_creta: boolean;
  senha_inss?: string;
  data_atendimento: string;
  data_ultima_atualizacao?: string;
  observacoes?: string;
  arquivo?: File;
}

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

export async function criarProcessoComNovoCliente(
  dados: CriarProcessoComNovoClienteRequest,
): Promise<Processo> {
  const formData = new FormData();

  formData.append('cliente', JSON.stringify(dados.cliente));
  formData.append('colaboradorId', dados.colaboradorId.toString());
  formData.append('beneficio', JSON.stringify(dados.beneficio));
  formData.append('olhar_inss', dados.olhar_inss.toString());
  formData.append('olhar_pje_creta', dados.olhar_pje_creta.toString());
  formData.append('data_atendimento', dados.data_atendimento);
  formData.append('data_ultima_atualizacao', dados.data_ultima_atualizacao);
  formData.append('status', JSON.stringify(dados.status));

  if (dados.senha_inss) {
    formData.append('senha_inss', dados.senha_inss);
  }

  if (dados.observacoes) {
    formData.append('observacoes', dados.observacoes);
  }

  if (dados.arquivo) {
    formData.append('arquivo', dados.arquivo);
  }

  const response = await api.post('/processos', formData, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  });
  return response.data;
}

// 2. POST /processos/cliente/:clienteId - Criar processo para cliente existente
export async function criarProcessoParaClienteExistente(
  clienteId: number,
  dados: CriarProcessoClienteExistenteRequest,
): Promise<Processo> {
  const formData = new FormData();

  formData.append('statusId', dados.statusId.toString());
  formData.append('beneficioId', dados.beneficioId.toString());
  formData.append('colaboradorId', dados.colaboradorId.toString());
  formData.append('olhar_inss', dados.olhar_inss.toString());
  formData.append('olhar_pje_creta', dados.olhar_pje_creta.toString());
  formData.append('data_atendimento', dados.data_atendimento);

  if (dados.senha_inss) {
    formData.append('senha_inss', dados.senha_inss);
  }

  if (dados.data_ultima_atualizacao) {
    formData.append('data_ultima_atualizacao', dados.data_ultima_atualizacao);
  }

  if (dados.observacoes) {
    formData.append('observacoes', dados.observacoes);
  }

  if (dados.arquivo) {
    formData.append('arquivo', dados.arquivo);
  }

  const response = await api.post(`/processos/cliente/${clienteId}`, formData, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  });
  return response.data;
}

// 3. POST /processos/:id/documentos - Upload de documentos para processo existente
export async function uploadDocumentosProcesso(
  processoId: number,
  arquivo: File,
): Promise<{ message: string; documentos?: string[] }> {
  const formData = new FormData();
  formData.append('arquivo', arquivo);

  const response = await api.post(`/processos/${processoId}/documentos`, formData, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  });
  return response.data;
}
