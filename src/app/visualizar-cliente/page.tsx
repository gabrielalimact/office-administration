'use client'
import { getClientePorId } from '@/services/cliente-service'
import { Box, Flex, Text, Table, Button, Spinner } from '@chakra-ui/react'
import { useRouter, useSearchParams } from 'next/navigation'
import { Suspense, useEffect, useState } from 'react'
import { Cliente } from '../../../types/cliente'
import { useBreadcrumb } from '@/components/BreadcrumbContext'
import Breadcrumb from '@/components/Breadcrumb'

function VisualizarClienteContent() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const clienteID = searchParams.get('cliente') || ''
  const [cliente, setCliente] = useState<Cliente | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const { setBreadcrumbs } = useBreadcrumb()

  const fetchCliente = async () => {
    if (!clienteID) {
      setError('ID do cliente não fornecido')
      setLoading(false)
      return
    }

    try {
      setLoading(true)
      setError(null)
      const clienteData = await getClientePorId(Number(clienteID))
      setCliente(clienteData)
    } catch (err) {
      console.error('Erro ao buscar cliente:', err)
      setError('Erro ao carregar dados do cliente. Tente novamente.')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchCliente()
  }, [clienteID])

  // Configurar breadcrumb quando o cliente for carregado
  useEffect(() => {
    if (cliente) {
      setBreadcrumbs([
        { label: 'Início', path: '/home' },
        { label: 'Clientes', path: '/clientes' },
        { label: cliente.nome, path: `/visualizar-cliente?cliente=${cliente.id}` },
      ])
    }
  }, [cliente, setBreadcrumbs])

  if (!clienteID) {
    return (
      <Box
        p={6}
        bg="#f4f8fb"
        minH="100vh"
        display="flex"
        alignItems="center"
        justifyContent="center"
      >
        <Box textAlign="center">
          <Text fontSize="xl" color="red.500" mb={4}>
            Cliente não encontrado
          </Text>
          <Button onClick={() => router.back()} bg="var(--primary)" color="white">
            Voltar
          </Button>
        </Box>
      </Box>
    )
  }

  if (loading) {
    return (
      <Box
        p={6}
        bg="#f4f8fb"
        minH="100vh"
        display="flex"
        alignItems="center"
        justifyContent="center"
      >
        <Box textAlign="center">
          <Spinner size="xl" color="blue.500" />
          <Text fontSize="lg" color="gray.600">
            Carregando dados do cliente...
          </Text>
        </Box>
      </Box>
    )
  }

  if (error) {
    return (
      <Box
        p={6}
        bg="#f4f8fb"
        minH="100vh"
        display="flex"
        alignItems="center"
        justifyContent="center"
      >
        <Box textAlign="center">
          <Text fontSize="xl" color="red.500" mb={4}>
            {error}
          </Text>
          <Flex gap={3} justifyContent="center">
            <Button onClick={fetchCliente} bg="var(--primary)" color="white">
              Tentar Novamente
            </Button>
            <Button onClick={() => router.back()} variant="ghost">
              Voltar
            </Button>
          </Flex>
        </Box>
      </Box>
    )
  }

  if (!cliente) {
    return (
      <Box
        p={6}
        bg="#f4f8fb"
        minH="100vh"
        display="flex"
        alignItems="center"
        justifyContent="center"
      >
        <Box textAlign="center">
          <Text fontSize="xl" color="gray.500" mb={4}>
            Nenhum dado encontrado para este cliente
          </Text>
          <Button onClick={() => router.back()} bg="var(--primary)" color="white">
            Voltar
          </Button>
        </Box>
      </Box>
    )
  }

  return (
    <Box p={6} bg="#f4f8fb" minH="100vh">
      <Breadcrumb />

      <Flex gap={12} mb={8}>
        <Box minW={320} bg="var(--primary)" color="white" borderRadius={12} p={6} boxShadow="md">
          <Text fontSize="2xl" fontWeight="bold" mb={2}>
            {cliente.nome}
          </Text>
          <Text mb={1}>
            <strong>CPF:</strong> {cliente.cpf}
          </Text>
          <Text mb={1}>
            <strong>RG:</strong> {cliente.rg}
          </Text>
          <Text mb={1}>
            <strong>Data de Nascimento:</strong> {cliente.data_nascimento}
          </Text>
          <Text mb={1}>
            <strong>Email:</strong> {cliente.email || 'Não informado'}
          </Text>
          <Text mb={1}>
            <strong>Filiação:</strong> {cliente.filiacao}
          </Text>
          <Text mb={1}>
            <strong>Naturalidade:</strong> {cliente.naturalidade}
          </Text>
          <Text mb={2}>
            <strong>Endereço:</strong>
          </Text>
          <Text fontSize="sm" mb={1}>
            {cliente.endereco.logradouro}, {cliente.endereco.numero}
          </Text>
          {cliente.endereco.complemento && (
            <Text fontSize="sm" mb={1}>
              {cliente.endereco.complemento}
            </Text>
          )}
          <Text fontSize="sm" mb={1}>
            {cliente.endereco.bairro}
          </Text>
          <Text fontSize="sm">
            {cliente.endereco.cidade}/{cliente.endereco.estado} - {cliente.endereco.cep}
          </Text>
        </Box>

        <Box flex={1}>
          <Text fontSize="xl" fontWeight="bold" mb={2} color="var(--primary)">
            Processos do cliente ({cliente.processos.length})
          </Text>
          {cliente.processos.length === 0 ? (
            <Box p={6} textAlign="center" bg="white" borderRadius={8} boxShadow="sm">
              <Text color="gray.500">Nenhum processo encontrado para este cliente</Text>
            </Box>
          ) : (
            <Table.Root size="sm" variant="outline" borderRadius="8px" boxShadow="sm">
              <Table.Header bg="var(--primary)">
                <Table.Row>
                  <Table.ColumnHeader color="white" p={2}>
                    ID
                  </Table.ColumnHeader>
                  <Table.ColumnHeader color="white" p={2}>
                    Data Atendimento
                  </Table.ColumnHeader>
                  <Table.ColumnHeader color="white" p={2}>
                    Última Atualização
                  </Table.ColumnHeader>
                  <Table.ColumnHeader color="white" p={2}>
                    Responsável
                  </Table.ColumnHeader>
                  <Table.ColumnHeader color="white" p={2}>
                    Status
                  </Table.ColumnHeader>
                  <Table.ColumnHeader color="white" p={2}>
                    Arquivado
                  </Table.ColumnHeader>
                </Table.Row>
              </Table.Header>
              <Table.Body>
                {cliente.processos.map((proc) => (
                  <Table.Row key={proc.id} _hover={{ bg: '#e3eafd' }}>
                    <Table.Cell p={2}>#{proc.id}</Table.Cell>
                    <Table.Cell p={2}>{proc.data_atendimento}</Table.Cell>
                    <Table.Cell p={2}>{proc.data_ultima_atualizacao}</Table.Cell>
                    <Table.Cell p={2}>{proc.colaborador}</Table.Cell>
                    <Table.Cell p={2}>
                      {proc.status ? proc.status.nome : 'Não informado'}
                    </Table.Cell>
                    <Table.Cell p={2}>
                      <Box
                        as="span"
                        px={2}
                        py={1}
                        borderRadius="md"
                        fontSize="xs"
                        fontWeight="bold"
                        bg={proc.arquivado ? 'gray.200' : 'green.100'}
                        color={proc.arquivado ? 'gray.600' : 'green.800'}
                      >
                        {proc.arquivado ? 'ARQUIVADO' : 'ATIVO'}
                      </Box>
                    </Table.Cell>
                  </Table.Row>
                ))}
              </Table.Body>
            </Table.Root>
          )}
        </Box>
      </Flex>

      {cliente.processos.length > 0 && (
        <Box>
          <Text fontSize="xl" fontWeight="bold" mb={4} color="var(--primary)">
            Detalhes dos Processos
          </Text>
          {cliente.processos.map((proc) => (
            <Box
              key={proc.id}
              id={`detalhe-proc-${proc.id}`}
              mb={6}
              p={6}
              borderWidth={1}
              borderRadius={12}
              bg="white"
              boxShadow="sm"
            >
              <Flex justify="space-between" align="center" mb={4}>
                <Text fontSize="lg" fontWeight="bold" color="var(--primary)">
                  Processo #{proc.id}
                </Text>
                <Box
                  px={3}
                  py={1}
                  borderRadius="md"
                  fontSize="sm"
                  fontWeight="bold"
                  bg={proc.arquivado ? 'gray.200' : 'green.100'}
                  color={proc.arquivado ? 'gray.600' : 'green.800'}
                >
                  {proc.arquivado ? 'ARQUIVADO' : 'ATIVO'}
                </Box>
              </Flex>

              <Flex wrap="wrap" gap={8} mb={4}>
                <Box>
                  <Text fontSize="sm" fontWeight="bold" color="gray.600">
                    Data do Atendimento
                  </Text>
                  <Text>{proc.data_atendimento}</Text>
                </Box>
                <Box>
                  <Text fontSize="sm" fontWeight="bold" color="gray.600">
                    Última Atualização
                  </Text>
                  <Text>{proc.data_ultima_atualizacao}</Text>
                </Box>
                <Box>
                  <Text fontSize="sm" fontWeight="bold" color="gray.600">
                    Responsável
                  </Text>
                  <Text>{proc.colaborador}</Text>
                </Box>
                <Box>
                  <Text fontSize="sm" fontWeight="bold" color="gray.600">
                    INSS
                  </Text>
                  <Text>{proc.olhar_inss ? 'Sim' : 'Não'}</Text>
                </Box>
                <Box>
                  <Text fontSize="sm" fontWeight="bold" color="gray.600">
                    PJE/CRETA
                  </Text>
                  <Text>{proc.olhar_pje_creta ? 'Sim' : 'Não'}</Text>
                </Box>
              </Flex>

              {proc.observacoes && (
                <Box mb={4}>
                  <Text fontSize="sm" fontWeight="bold" color="gray.600" mb={1}>
                    Observações
                  </Text>
                  <Text bg="gray.50" p={3} borderRadius="md">
                    {proc.observacoes}
                  </Text>
                </Box>
              )}

              {proc.links_documentos && (
                <Box>
                  <Text fontSize="sm" fontWeight="bold" color="gray.600" mb={2}>
                    Documentos
                  </Text>
                  <Text fontSize="sm" color="gray.500">
                    {proc.links_documentos}
                  </Text>
                </Box>
              )}
            </Box>
          ))}
        </Box>
      )}
    </Box>
  )
}

export default function VisualizarClientePage() {
  return (
    <Suspense
      fallback={
        <Box
          p={6}
          bg="#f4f8fb"
          minH="100vh"
          display="flex"
          alignItems="center"
          justifyContent="center"
        >
          <Box textAlign="center">
            <Spinner size="xl" color="blue.500" />
            <Text fontSize="lg" color="gray.600">
              Carregando cliente...
            </Text>
          </Box>
        </Box>
      }
    >
      <VisualizarClienteContent />
    </Suspense>
  )
}
