import { Cliente } from './cliente'

export interface Beneficio {
  id: number
  nome: string
}

export interface Agendamento {
  id: number
  nome: string
}

export interface AgendamentoProcesso {
  id: number
  data_agendamento: string
  observacoes: string | null
  concluido: boolean
  created_at: string
  updated_at: string
  tipo_agendamento: {
    id: number
    nome: string
  }
}

export interface Status {
  id: number
  nome: string
}
export interface CriarProcessoRequest {
  cliente: Cliente
  colaborador: string
  beneficio: string
  olhar_inss: boolean
  olhar_pje_creta: boolean
  senha_inss: string
  data_cadastro: string
  data_ultima_atualizacao: string
  status: string
  observacoes: string
  links_documentos: string[]
}

export interface Processo {
  id: number
  arquivado: boolean
  olhar_inss: boolean
  olhar_pje_creta: boolean
  senha_inss: string | null
  data_cadastro: string
  colaborador_responsavel: string
  data_ultima_atualizacao: string
  data_protocolo: string | null
  observacoes: string | null
  cliente: {
    id: number
    nome: string
    email: string | null
    data_nascimento: string | null
    cpf: string
    rg: string | null
    filiacao: string | null
    naturalidade: string | null
    telefone: string | null
  }
  status: Status
  beneficio: Beneficio
  documentos: ArquivosDocumentos[]
  funcionario: {
    id: number
    nome: string
    cargo: string
  }
  agendamentos: AgendamentoProcesso[]
}

export interface ProcessosPorFuncionario {
  id: number
  nome: string
  cpf: string
  email: string
  cargo: string
  processos: Processo[]
  totalProcessos: number
}

export interface ArquivosDocumentos {
  id: number
  caminho: string
  data_upload: string
  nome_arquivo: string
  nome_original: string
  tamanho: number
  tipo_mime: string
}
