import { Endereco } from '../../types/endereco';

export interface Cliente {
  id: number;
  nome: string;
  data_nascimento: string;
  cpf: string;
  rg: string;
  filiacao: string;
  naturalidade: string;
  endereco: Endereco;
}

export interface ProcessoData {
  cliente: Cliente;
  senha_inss?: string;
  colaboradorId: number;
  beneficio: { id: number };
  olhar_inss: boolean;
  olhar_pje_creta: boolean;
  data_atendimento: string;
  data_ultima_atualizacao?: string;
  status: { id: number };
  observacoes?: string;
  files?: File[];
}

export interface StepProps {
  data: ProcessoData;
  onDataChange: (data: Partial<ProcessoData>) => void;
  onNext?: () => void;
}

export interface ClienteStepData {
  nome: string;
  data_nascimento: string;
  cpf: string;
  rg: string;
  filiacao: string;
  naturalidade: string;
  endereco: Endereco;
}

export interface ProcessoStepData {
  beneficio: { id: number };
  status: { id: number };
  olhar_inss: boolean;
  olhar_pje_creta: boolean;
  senha_inss?: string;
  data_atendimento: string;
  observacoes?: string;
}

export interface DocumentosStepData {
  files: File[];
  compressedFile?: File | null;
}
