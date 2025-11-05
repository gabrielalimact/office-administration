'use client'

import { useEffect, useState, Suspense } from 'react'
import { useSearchParams, useRouter } from 'next/navigation'
import { Box, Flex, Text, Button, Spinner } from '@chakra-ui/react'
import { LuFilePlus2, LuPencil } from 'react-icons/lu'
import Breadcrumb from '@/components/Breadcrumb'
import { useBreadcrumb } from '@/components/BreadcrumbContext'
import { getClientePorId } from '@/services/cliente-service'
import { formatDate } from '../../../utils/formatDate'
import { AtualizarCliente, Cliente } from '../../../types/cliente'
import ListaProcessos from '@/components/ListaProcessos'
import ModalEditarCliente from '@/components/ModalEditarCliente'
import maskCPF from '../../../utils/maskCPF'

/* -------------------------- Visualização de Cliente -------------------------- */

function VisualizarClienteContent() {
  const searchParams = useSearchParams()
  const router = useRouter()
  const clienteID = searchParams.get('cliente')
  const [cliente, setCliente] = useState<Cliente | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const { setBreadcrumbs } = useBreadcrumb()
  const [modalEditarCliente, setModalEditarCliente] = useState(false)

  useEffect(() => {
    if (!clienteID) {
      setError('ID do cliente não fornecido')
      setLoading(false)
      return
    }

    const fetchData = async () => {
      try {
        setLoading(true)
        const data = await getClientePorId(Number(clienteID))
        setCliente(data)
      } catch {
        setError('Erro ao carregar dados do cliente.')
      } finally {
        setLoading(false)
      }
    }

    fetchData()
  }, [clienteID])

  useEffect(() => {
    if (cliente) {
      setBreadcrumbs([
        { label: 'Início', path: '/home' },
        { label: 'Clientes', path: '/clientes' },
        { label: cliente.nome, path: `/visualizar-cliente?cliente=${cliente.id}` }
      ])
    }
  }, [cliente, setBreadcrumbs])

  const handleClienteUpdate = (clienteAtualizado: Cliente) => {
    setCliente(clienteAtualizado)
  }

  const handleAdicionarProcesso = () => {
    if (!cliente) return
    const params = new URLSearchParams({
      clienteId: cliente.id.toString(),
      clienteNome: cliente.nome,
      clienteCpf: cliente.cpf || '',
      clienteEmail: cliente.email || '',
      clienteRg: cliente.rg || '',
      clienteDataNascimento: cliente.data_nascimento || '',
      clienteFiliacao: cliente.filiacao || '',
      clienteNaturalidade: cliente.naturalidade || '',
      // Endereço
      endereco_logradouro: cliente.endereco?.logradouro || '',
      endereco_numero: cliente.endereco?.numero || '',
      endereco_complemento: cliente.endereco?.complemento || '',
      endereco_bairro: cliente.endereco?.bairro || '',
      endereco_cidade: cliente.endereco?.cidade || '',
      endereco_estado: cliente.endereco?.estado || '',
      endereco_cep: cliente.endereco?.cep || ''
    })

    router.push(`/cadastrar-processos?${params.toString()}`)
  }

  if (loading)
    return (
      <Flex h="100vh" align="center" justify="center" direction="column" gap={3}>
        <Spinner size="xl" color="blue.500" />
        <Text fontSize="lg" color="gray.600">
          Carregando cliente...
        </Text>
      </Flex>
    )

  if (error)
    return (
      <Text color="red.500" textAlign="center" mt={10}>
        {error}
      </Text>
    )

  if (!cliente) return null

  return (
    <Box p={{ base: 4, md: 6 }} bg="#f4f8fb" minH="100vh">
      <Breadcrumb />
      <Flex direction={{ base: 'column', md: 'row' }} gap={{ base: 6, md: 12 }} mb={8}>
        <Box>
          <Box
            minW={{ base: '100%', md: 320 }}
            h={'fit-content'}
            bg="var(--primary)"
            color="white"
            borderRadius="md"
            p={{ base: 4, md: 6 }}
            boxShadow="md"
          >
            <Text fontSize={{ base: 'xl', md: '2xl' }} fontWeight="bold" mb={2}>
              {cliente.nome}
            </Text>
            {[
              ['CPF', maskCPF(cliente.cpf)],
              ['RG', cliente.rg],
              ['Data de Nascimento', formatDate(cliente.data_nascimento)],
              ['Email', cliente.email],
              ['Filiação', cliente.filiacao],
              ['Naturalidade', cliente.naturalidade]
            ].map(([label, value]) => {
              return (
                value && (
                  <Text mb={1} key={label}>
                    <strong>{label}:</strong> {value}
                  </Text>
                )
              )
            })}
            <Box mt={4}>
              <Text fontWeight="bold" mb={1}>
                Endereço
              </Text>
              {cliente.endereco && cliente.endereco.logradouro ? (
                <Text fontSize="sm">
                  {[
                    cliente.endereco.logradouro,
                    cliente.endereco.numero && `nº ${cliente.endereco.numero}`,
                    cliente.endereco.complemento,
                    cliente.endereco.bairro,
                    cliente.endereco.cidade && cliente.endereco.estado
                      ? `${cliente.endereco.cidade}/${cliente.endereco.estado}`
                      : cliente.endereco.cidade || cliente.endereco.estado,
                    cliente.endereco.cep && `CEP: ${cliente.endereco.cep}`
                  ]
                    .filter(Boolean)
                    .join(', ')}
                </Text>
              ) : (
                <Text fontSize="sm" color="gray.300">
                  Não informado
                </Text>
              )}
            </Box>
          </Box>
          <Flex
            gap={2}
            mt={4}
            justifyContent={'center'}
            flexDirection={{ base: 'column', md: 'row' }}
            px={2}
          >
            <Button
              variant="surface"
              size="sm"
              p="20px 10px"
              borderRadius="4px"
              backgroundColor="var(--primary)"
              color="white"
              fontWeight="bold"
              style={{ display: 'flex', alignItems: 'center', gap: 8 }}
              onClick={() => setModalEditarCliente(true)}
            >
              <LuPencil /> Editar Cliente
            </Button>
            <Button
              variant="surface"
              size="sm"
              p="20px 10px"
              borderRadius="4px"
              backgroundColor="var(--primary)"
              color="white"
              fontWeight="bold"
              style={{ display: 'flex', alignItems: 'center', gap: 8 }}
              onClick={handleAdicionarProcesso}
            >
              <LuFilePlus2 /> Adicionar Processo
            </Button>
          </Flex>
        </Box>
        <ListaProcessos cliente={cliente} onClienteUpdate={handleClienteUpdate} />
        {modalEditarCliente && (
          <ModalEditarCliente
            onClose={() => setModalEditarCliente(false)}
            cliente={cliente as AtualizarCliente}
          />
        )}
      </Flex>
    </Box>
  )
}

/* ----------------------------- Página Principal ----------------------------- */

export default function VisualizarClientePage() {
  return (
    <Suspense
      fallback={
        <Flex h="100vh" align="center" justify="center" direction="column" gap={3}>
          <Spinner size="xl" color="blue.500" />
          <Text fontSize="lg" color="gray.600">
            Carregando cliente...
          </Text>
        </Flex>
      }
    >
      <VisualizarClienteContent />
    </Suspense>
  )
}
