'use client'

import { Box } from '@chakra-ui/react'
import { Cliente } from '../../../types/cliente'
import { Processo } from '../../../types/processos'
import { ProcessoCard } from '../ProcessoCard'

interface ListaProcessosProps {
  cliente: Cliente
  onClienteUpdate: (cliente: Cliente) => void
}

export const ListaProcessos = ({ cliente, onClienteUpdate }: ListaProcessosProps) => {
  const handleProcessoUpdate = (processoAtualizado: Cliente['processos'][0]) => {
    const clienteAtualizado = {
      ...cliente,
      processos: cliente.processos.map((proc) =>
        proc.id === processoAtualizado.id ? processoAtualizado : proc
      )
    }
    onClienteUpdate(clienteAtualizado)
  }

  return (
    <Box w={'100%'}>
      {cliente.processos.map((proc: Processo) => (
        <ProcessoCard key={proc.id} proc={proc} onUpdate={handleProcessoUpdate} />
      ))}
    </Box>
  )
}

export default ListaProcessos
