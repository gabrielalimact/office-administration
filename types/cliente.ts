import { Endereco } from './endereco'
import { Processo } from './processos'

export interface Cliente {
  id: number;
  nome: string;
  email: string | null;
  data_nascimento: string;
  cpf: string;
  rg: string;
  filiacao: string;
  naturalidade: string;
  endereco: Endereco;
  processos: Processo[];
}

export interface NovoCliente {
  nome: string;
  data_nascimento: string;
  cpf: string;
  rg: string;
  filiacao: string;
  naturalidade: string;
  endereco: Endereco;
}
