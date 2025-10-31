'use client'

import { useEffect, useState, Suspense, useMemo, ElementType } from 'react'
import { useSearchParams } from 'next/navigation'
import {
  Box,
  Flex,
  Text,
  Stack,
  Badge,
  Icon,
  Button,
  Spinner,
} from '@chakra-ui/react'
import { LuCalendarDays, LuFileArchive, LuDownload, LuUser } from 'react-icons/lu'
import { Tooltip } from '@/components/ui/tooltip'
import { toaster } from '@/components/ui/toaster'
import Breadcrumb from '@/components/Breadcrumb'
import { useBreadcrumb } from '@/components/BreadcrumbContext'
import { getClientePorId } from '@/services/cliente-service'
import { downloadArquivoProcesso } from '@/services/processo-service'
import { Processo } from '../../../types/processos'
import formatDate from '../../../utils/formatDate'
import { Cliente } from '../../../types/cliente'

/* ------------------------- Helper: Status visual config ------------------------ */
const getStatusColors = (status?: string, arquivado?: boolean) => {
  if (arquivado)
    return { bg: 'gray.100', color: 'gray.700' }

  switch (status) {
    case 'AUDIENCIA':
      return { bg: 'orange.100', color: 'orange.800' }
    case 'PERÍCIA':
      return { bg: 'blue.100', color: 'blue.800' }
    default:
      return { bg: 'green.100', color: 'green.800' }
  }
}

/* ----------------------------- Subcomponentes ----------------------------- */

const InfoItem = ({ icon, label, value }: { icon: ElementType, label: string, value: string | number | undefined }) => (
  <Flex align="center" gap={3}>
    <Icon as={icon} color="gray.500" />
    <Box>
      <Text fontSize="xs" color="gray.500">{label}</Text>
      <Text fontWeight="medium">{value || '-'}</Text>
    </Box>
  </Flex>
)

const ProcessoCard = ({ proc }: { proc: Cliente['processos'][0] }) => {
  const { bg, color } = useMemo(() => getStatusColors(proc.status?.nome, proc.arquivado), [proc.status?.nome, proc.arquivado])

  const handleDownload = async () => {
    try {
      await downloadArquivoProcesso(proc.arquivo_documentos.id, proc.arquivo_documentos.nome_original)
      toaster.create({
        title: 'Download feito com sucesso',
        description: `O arquivo "${proc.arquivo_documentos.nome_original}" foi baixado com sucesso.`,
        type: 'success',
      })
    } catch {
      toaster.create({
        title: 'Erro ao baixar arquivo',
        description: `Não foi possível baixar "${proc.arquivo_documentos.nome_original}".`,
        type: 'error',
      })
    }
  }

  return (
    <Box
      key={proc.id}
      mb={6}
      p={8}
      borderWidth={1}
      borderRadius="lg"
      bg="white"
      boxShadow="md"
      _hover={{ boxShadow: 'lg' }}
      transition="0.2s"
    >
      {/* Cabeçalho */}
      <Flex
        justify="space-between"
        align={{ base: 'flex-start', md: 'center' }}
        direction={{ base: 'column', md: 'row' }}
        gap={3}
      >
        <Text fontSize={{ base: 'lg', md: 'xl' }} fontWeight="bold" color="var(--primary)">
          Processo #{proc.id}
        </Text>

        <Badge
          bg={bg}
          color={color}
          px={3}
          py={1}
          borderRadius="sm"
          fontWeight="bold"
          textTransform="capitalize"
        >
          {proc.status?.nome || 'SEM STATUS'}
        </Badge>
      </Flex>

      <Box my={4} bgColor="gray.100" h="1px" />

      {/* Dados principais */}
      <Stack direction={{ base: 'column', md: 'row' }} gap={8} flexWrap="wrap">
        <InfoItem icon={LuCalendarDays} label="Atendimento" value={formatDate(proc.data_atendimento)} />
        <InfoItem icon={LuCalendarDays} label="Última atualização" value={formatDate(proc.data_ultima_atualizacao)} />
        <InfoItem icon={LuUser} label="Responsável" value={`${proc.colaborador?.nome || '-'} (${proc.colaborador?.cargo || '-'})`} />
        <InfoItem icon={LuFileArchive} label="Benefício" value={proc.beneficio?.nome} />
      </Stack>

      <Box my={4} bgColor="gray.100" h="1px" />

      {/* Informações adicionais */}
      <Stack direction={{ base: 'column', md: 'row' }} gap={6} wrap="wrap">
        {[
          { label: 'Olhar INSS', value: proc.olhar_inss ? 'Sim' : 'Não' },
          { label: 'PJE/CRETA', value: proc.olhar_pje_creta ? 'Sim' : 'Não' },
          { label: 'Status', value: proc.arquivado ? 'Arquivado' : 'Ativo' },
        ].map(({ label, value }) => (
          <Box key={label}>
            <Text fontSize="sm" fontWeight="bold" color="gray.600">{label}:</Text>
            <Text>{value}</Text>
          </Box>
        ))}
      </Stack>

      {/* Observações */}
      {proc.observacoes && (
        <Box mt={4}>
          <Text fontSize="sm" fontWeight="bold" color="gray.600" mb={1}>Observações</Text>
          <Box bg="gray.50" p={3} borderRadius="sm">
            <Text fontSize="sm">{proc.observacoes}</Text>
          </Box>
        </Box>
      )}

      {/* Documentos */}
      {proc.arquivo_documentos && (
        <Box mt={4}>
          <Text fontSize="sm" fontWeight="bold" color="gray.600" mb={2}>Documentos</Text>
          <Flex
            align={{ base: 'flex-start', md: 'center' }}
            direction={{ base: 'column', md: 'row' }}
            justify="space-between"
            bg="gray.50"
            p={3}
            borderRadius="sm"
            gap={3}
          >
            <Box>
              <Text fontWeight="medium">{proc.arquivo_documentos.nome_original}</Text>
              <Text fontSize="xs" color="gray.500">
                {(proc.arquivo_documentos.tamanho / 1024 / 1024).toFixed(2)} MB
              </Text>
            </Box>
            <Tooltip content="Baixar documento">
              <Button
                onClick={handleDownload}
                variant="ghost"
                size="sm"
                w={{ base: 'full', md: 'auto' }}
              >
                <LuDownload /> Baixar
              </Button>
            </Tooltip>
          </Flex>
        </Box>
      )}
    </Box>
  )
}

/* ---------------------------- Lista de Processos ---------------------------- */

const ListaProcessos = ({ cliente }: { cliente: Cliente }) => (
  <Box w={'100%'}>
    {cliente.processos.map((proc : Processo) => (
      <ProcessoCard key={proc.id} proc={proc} />
    ))}
  </Box>
)

/* -------------------------- Visualização de Cliente -------------------------- */

function VisualizarClienteContent() {
  const searchParams = useSearchParams()
  const clienteID = searchParams.get('cliente')
  const [cliente, setCliente] = useState<Cliente | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const { setBreadcrumbs } = useBreadcrumb()

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
        { label: cliente.nome, path: `/visualizar-cliente?cliente=${cliente.id}` },
      ])
    }
  }, [cliente])

  if (loading)
    return (
      <Flex h="100vh" align="center" justify="center" direction="column" gap={3}>
        <Spinner size="xl" color="blue.500" />
        <Text fontSize="lg" color="gray.600">Carregando cliente...</Text>
      </Flex>
    )

  if (error)
    return <Text color="red.500" textAlign="center" mt={10}>{error}</Text>

  if (!cliente) return null

  return (
    <Box p={{ base: 4, md: 6 }} bg="#f4f8fb" minH="100vh">
      <Breadcrumb />
      <Flex direction={{ base: 'column', md: 'row' }} gap={{ base: 6, md: 12 }} mb={8}>
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
            ['CPF', cliente.cpf],
            ['RG', cliente.rg],
            ['Data de Nascimento', formatDate(cliente.data_nascimento)],
            ['Email', cliente.email],
            ['Filiação', cliente.filiacao],
            ['Naturalidade', cliente.naturalidade],
          ].map(([label, value]) => {
            return (
              value && <Text mb={1} key={label}><strong>{label}:</strong> {value}</Text>
            )
          })}


        {cliente.endereco ? (
          <Text fontSize="sm">
            {[
              cliente.endereco.logradouro,
              cliente.endereco.numero && `nº ${cliente.endereco.numero}`,
              cliente.endereco.complemento,
              cliente.endereco.bairro,
              cliente.endereco.cidade && cliente.endereco.estado
                ? `${cliente.endereco.cidade}/${cliente.endereco.estado}`
                : cliente.endereco.cidade || cliente.endereco.estado,
              cliente.endereco.cep && `CEP: ${cliente.endereco.cep}`,
            ]
              .filter(Boolean)
              .join(', ')}
          </Text>
        ) : (
          <Text fontSize="sm" color="gray.500">Não informado</Text>
        )}
      </Box>

      <ListaProcessos cliente={cliente} />
    </Flex>
    </Box>
  )
}

/* ----------------------------- Página Principal ----------------------------- */

export default function VisualizarClientePage() {
  return (
    <Suspense fallback={
      <Flex h="100vh" align="center" justify="center" direction="column" gap={3}>
        <Spinner size="xl" color="blue.500" />
        <Text fontSize="lg" color="gray.600">Carregando cliente...</Text>
      </Flex>
    }>
      <VisualizarClienteContent />
    </Suspense>
  )
}
