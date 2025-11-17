import { Endereco } from './endereco'
import { Processo } from './processos'

export interface Cliente {
  id: number
  nome: string
  email: string | null
  telefone?: string
  data_nascimento: string
  cpf: string
  rg: string
  filiacao: string
  naturalidade: string
  endereco: Endereco
  processos: Processo[]
}

export interface NovoCliente {
  nome: string
  email?: string
  telefone?: string
  data_nascimento: string
  cpf: string
  rg: string
  filiacao: string
  naturalidade: string
  endereco: Endereco
}

export interface AtualizarCliente {
  id: number
  nome: string
  email?: string
  telefone?: string
  data_nascimento: string
  cpf: string
  rg: string
  filiacao: string
  naturalidade: string
  endereco: Endereco
}
