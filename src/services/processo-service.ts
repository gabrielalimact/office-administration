import { CriarProcessoRequest, Processo } from '../../types/processos'
import { NovoCliente } from '../../types/cliente'
import { api } from './api-service'
import { toaster } from '@/components/ui/toaster'

export interface CriarProcessoComNovoClienteRequest {
  cliente: NovoCliente
  funcionarioId: number
  beneficio: {
    id?: number
    nome?: string
  }
  colaborador_responsavel?: string
  olhar_inss: boolean
  olhar_pje_creta: boolean
  senha_inss?: string
  data_cadastro: string
  data_protocolo?: string
  data_agendamento?: string
  tipo_agendamento?: {
    id?: number
    nome?: string
  }
  data_ultima_atualizacao: string
  status: {
    id?: number
    nome?: string
  }
  observacoes?: string
  arquivo?: File
}

export interface CriarProcessoClienteExistenteRequest {
  statusId: number
  tipoAgendamentoId: number | null
  beneficioId: number
  funcionarioId: number
  olhar_inss: boolean
  olhar_pje_creta: boolean
  senha_inss?: string
  data_cadastro: string
  data_agendamento?: string
  data_ultima_atualizacao?: string
  observacoes?: string
  arquivo?: File
  colaborador_responsavel?: string
  data_protocolo?: string
}

export async function getStatus() {
  const response = await api.get('/status-processo')
  return response.data
}
export async function getTipoAgendamento() {
  const response = await api.get('/tipo-agendamento')
  return response.data
}

export async function getBeneficios() {
  const response = await api.get('/beneficios')
  return response.data
}

export async function getProcessos(): Promise<Processo[]> {
  const response = await api.get('/processos')
  return response.data
}

export async function getProcessoPorId(id: number): Promise<Processo> {
  const response = await api.get(`/processos/${id}`)
  return response.data
}

export async function criarProcesso(
  processo: CriarProcessoRequest,
  clienteID?: number
): Promise<Processo> {
  if (clienteID) {
    const response = await api.post(`/processos/cliente/${clienteID}/processos`, processo)
    return response.data
  }
  const response = await api.post('/processos', processo)
  return response.data
}

export async function criarProcessoComNovoCliente(
  dados: CriarProcessoComNovoClienteRequest
): Promise<Processo> {
  const formData = new FormData()
  formData.append('cliente', JSON.stringify(dados.cliente))
  formData.append('funcionarioId', dados.funcionarioId.toString())
  formData.append('beneficio', JSON.stringify(dados.beneficio))
  formData.append('olhar_inss', dados.olhar_inss.toString())
  formData.append('olhar_pje_creta', dados.olhar_pje_creta.toString())
  formData.append('data_cadastro', dados.data_cadastro)
  formData.append('data_ultima_atualizacao', dados.data_ultima_atualizacao)
  formData.append('status', JSON.stringify(dados.status))
  formData.append('data_protocolo', dados.data_protocolo || '')
  if (dados.data_agendamento) {
    formData.append('data_agendamento', dados.data_agendamento)
  }
  if (dados.tipo_agendamento) {
    formData.append('tipo_agendamento', JSON.stringify(dados.tipo_agendamento))
  }
  if (dados.colaborador_responsavel) {
    formData.append('colaborador_responsavel', dados.colaborador_responsavel)
  }

  if (dados.senha_inss) {
    formData.append('senha_inss', dados.senha_inss)
  }

  if (dados.observacoes) {
    formData.append('observacoes', dados.observacoes)
  }

  if (dados.arquivo) {
    formData.append('arquivo', dados.arquivo)
  }

  const response = await api.post('/processos', formData, {
    headers: {
      'Content-Type': 'multipart/form-data'
    }
  })
  return response.data
}

export async function criarProcessoParaClienteExistente(
  clienteId: number,
  dados: CriarProcessoClienteExistenteRequest
): Promise<Processo> {
  const formData = new FormData()
  formData.append('statusId', dados.statusId.toString())
  formData.append('beneficioId', dados.beneficioId.toString())
  formData.append('funcionarioId', dados.funcionarioId.toString())
  formData.append('olhar_inss', dados.olhar_inss.toString())
  formData.append('olhar_pje_creta', dados.olhar_pje_creta.toString())
  formData.append('data_cadastro', dados.data_cadastro)
  formData.append('data_agendamento', dados.data_agendamento || '')
  formData.append('tipoAgendamentoId', dados.tipoAgendamentoId?.toString() || '')
  formData.append('data_ultima_atualizacao', dados.data_ultima_atualizacao || '')
  formData.append('data_protocolo', dados.data_protocolo || '')

  if (dados.colaborador_responsavel) {
    formData.append('colaborador_responsavel', dados.colaborador_responsavel)
  }

  if (dados.senha_inss) {
    formData.append('senha_inss', dados.senha_inss)
  }

  if (dados.observacoes) {
    formData.append('observacoes', dados.observacoes)
  }

  if (dados.arquivo) {
    formData.append('arquivo', dados.arquivo)
  }

  const response = await api.post(`/processos/cliente/${clienteId}`, formData, {
    headers: {
      'Content-Type': 'multipart/form-data'
    }
  })
  return response.data
}

export async function uploadDocumentosProcesso(
  processoId: number,
  arquivo: File
): Promise<{ message: string; documentos?: string[] }> {
  const formData = new FormData()
  formData.append('arquivo', arquivo)

  const response = await api.post(`/processos/${processoId}/documentos`, formData, {
    headers: {
      'Content-Type': 'multipart/form-data'
    }
  })
  return response.data
}

export async function downloadArquivoProcesso(arquivoId: number, nomeOriginal?: string) {
  try {
    const response = await fetch(
      `${process.env.NEXT_PUBLIC_API_URL}/arquivo/download/${arquivoId}`,
      {
        method: 'GET',
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`
        }
      }
    )

    if (!response.ok) throw new Error('Erro ao baixar arquivo')

    const blob = await response.blob()
    const url = window.URL.createObjectURL(blob)

    const link = document.createElement('a')
    link.href = url
    link.download = nomeOriginal || 'arquivo'
    document.body.appendChild(link)
    link.click()

    link.remove()
    window.URL.revokeObjectURL(url)
    toaster.create({ description: 'Download iniciado com sucesso!', type: 'success' })
  } catch (error) {
    console.error('Erro no download:', error)
    toaster.create({ description: 'Falha ao baixar o arquivo.', type: 'error' })
  }
}

export async function updateProcesso(
  processoId: number,
  dados: Partial<CriarProcessoComNovoClienteRequest>
): Promise<Processo> {
  const formData = new FormData()

  Object.entries(dados).forEach(([key, value]) => {
    if (value === undefined || value === null) return
    const camposJSON = ['cliente', 'beneficio', 'status', 'tipo_agendamento']

    if (camposJSON.includes(key)) {
      formData.append(key, JSON.stringify(value))
      return
    }
    if (typeof value === 'boolean') {
      formData.append(key, value.toString())
      return
    }
    if (typeof value === 'number') {
      formData.append(key, value.toString())
      return
    }
    if (key === 'arquivo' && value instanceof File) {
      formData.append(key, value)
      return
    }
    formData.append(key, value as string)
  })

  const response = await api.patch(`/processos/${processoId}`, formData, {
    headers: { 'Content-Type': 'multipart/form-data' }
  })

  return response.data
}
