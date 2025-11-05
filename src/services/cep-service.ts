import { apiCep } from './api-service'

export interface CepInfo {
  cep?: string
  logradouro?: string
  complemento?: string
  bairro?: string
  localidade?: string
  uf?: string
  estado?: string
  regiao?: string
  erro?: string | boolean
}

export function getCepInfo(cep: string) {
  return apiCep.get<CepInfo>(`/${cep}/json`)
}
