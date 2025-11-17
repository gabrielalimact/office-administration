import { Endereco } from '../../types/endereco'

export interface Cliente {
  id: number
  nome: string
  telefone?: string
  data_nascimento: string
  cpf: string
  rg: string
  filiacao: string
  naturalidade: string
  endereco: Endereco
}

export interface ProcessoData {
  cliente: Cliente
  senha_inss?: string
  funcionarioId: number
  colaborador_responsavel?: string
  beneficio: { id: number }
  olhar_inss: boolean
  olhar_pje_creta: boolean
  data_cadastro: string
  data_protocolo?: string
  data_ultima_atualizacao?: string
  status: { id: number }
  observacoes?: string
  files?: File[]
}

export interface StepProps {
  data: ProcessoData
  isClientExisting?: boolean
  onDataChange: (data: Partial<ProcessoData>) => void
  onNext?: () => void
}

export interface ClienteStepData {
  nome: string
  data_nascimento: string
  cpf: string
  rg: string
  filiacao: string
  naturalidade: string
  endereco: Endereco
}

export interface ProcessoStepData {
  beneficio: { id: number }
  status: { id: number }
  olhar_inss: boolean
  olhar_pje_creta: boolean
  senha_inss?: string
  data_cadastro: string
  observacoes?: string
}

export interface DocumentosStepData {
  files: File[]
  compressedFile?: File | null
}
