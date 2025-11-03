import { api } from './api-service'

export interface DashboardData {
  totalProcessos: number
  processosArquivados: number
  processosAtivos: number
  processosPorBeneficio: {
    beneficio: string
    quantidade: number
  }[]
  processosPorTipoAgendamento: {
    tipo_agendamento: string
    quantidade: number
  }[]
  processosPorStatus: {
    status: string
    quantidade: number
  }[]
  clientesComProcessosAtivos: number
}
export async function getDashboardData() {
  const response = await api.get<DashboardData>('/dashboard')
  return response.data
}
