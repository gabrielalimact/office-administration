import { Cliente } from './cliente';

export interface Beneficio {
  id: number;
  nome: string;
}

export interface Status {
  id: number;
  nome: string;
}
export interface CriarProcessoRequest {
  cliente: Cliente;
  colaborador: string;
  beneficio: string;
  olhar_inss: boolean;
  olhar_pje_creta: boolean;
  senha_inss: string;
  data_atendimento: string;
  data_ultima_atualizacao: string;
  status: string;
  observacoes: string;
  links_documentos: string[];
}

export interface Processo {
  id: number;
  colaborador: string;
  olhar_inss: boolean;
  olhar_pje_creta: boolean;
  senha_inss: string;
  data_atendimento: string;
  data_ultima_atualizacao: string;
  observacoes: string;
  links_documentos: string[];
  arquivado: boolean;
  cliente: {
    id: number;
    nome: string;
    data_nascimento: string;
    cpf: string;
    rg: string;
    filiacao: string;
    naturalidade: string;
  };
  status: Status;
  beneficio: Beneficio;
}

export interface ProcessosPorFuncionario {
  id: number;
  nome: string;
  cpf: string;
  email: string;
  cargo: string;
  processos: Processo[];
  totalProcessos: number;
}

