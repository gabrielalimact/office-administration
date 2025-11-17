'use client'
import {
  Box,
  Text,
  IconButton,
  Flex,
  Button,
  ButtonGroup,
  Pagination,
  Grid,
  Spinner
} from '@chakra-ui/react'
import { IoEyeOutline, IoTrash } from 'react-icons/io5'
import { Suspense, useEffect, useState } from 'react'
import { useLoading } from '@/components/LoadingContext'
import { getClientes, deletarCliente } from '@/services/cliente-service'
import { Cliente } from '../../../types/cliente'
import { LuChevronLeft, LuChevronRight } from 'react-icons/lu'
import { useBreadcrumb } from '@/components/BreadcrumbContext'
import Breadcrumb from '@/components/Breadcrumb'
import GridTable from '@/components/GridTable'
import { maskCPF } from '../../../utils/maskCPF'
import { maskTelefone } from '../../../utils/maskTelefone'
import CustomInput from '@/components/CustomInput'
import CustomCheckbox from '@/components/CustomCheckbox'
import { useRouter, useSearchParams } from 'next/navigation'
import { toaster } from '@/components/ui/toaster'

function ClientesPageContent() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const { setLoading } = useLoading()
  const { setBreadcrumbs } = useBreadcrumb()

  const [busca, setBusca] = useState('')
  const [ativos, setAtivos] = useState(false)
  const [clientes, setClientes] = useState<Cliente[]>([])
  const [clientesAtivos, setClientesAtivos] = useState<Cliente[]>([])
  const [showAll, setShowAll] = useState(false)
  const [clienteParaExcluir, setClienteParaExcluir] = useState<Cliente | null>(null)
  const [modalAberto, setModalAberto] = useState(false)
  const [currentPage, setCurrentPage] = useState(1)
  const [pageSize] = useState(10)

  useEffect(() => {
    setBreadcrumbs([
      { label: 'Início', path: '/home' },
      { label: 'Clientes', path: '/clientes' }
    ])
  }, [setBreadcrumbs])

  const updateURLParams = (
    newParams: Partial<{ busca: string; ativos: boolean; all: boolean }>
  ) => {
    const params = new URLSearchParams()

    if (newParams.busca) params.set('busca', newParams.busca)
    if (newParams.ativos) params.set('ativos', 'true')
    if (newParams.all) params.set('all', 'true')

    const queryString = params.toString()
    router.push(`/clientes${queryString ? '?' + queryString : ''}`, { scroll: false })
  }

  const handleBuscaChange = (value: string) => {
    setBusca(value)
    updateURLParams({ busca: value, ativos, all: showAll })
  }

  const handleAtivosToggle = () => {
    const novoValor = !ativos
    setAtivos(novoValor)
    updateURLParams({ busca, ativos: novoValor, all: showAll })
  }

  useEffect(() => {
    const buscaParam = searchParams.get('busca') || ''
    const ativosParam = searchParams.get('ativos') === 'true'
    const allParam = searchParams.get('all') === 'true'

    setBusca(buscaParam)
    setAtivos(ativosParam)
    setShowAll(allParam)
  }, [searchParams])

  const clientesFiltrados = clientes.filter((c) => {
    const buscaLower = busca.toLowerCase()
    const buscaNumerica = busca.replace(/\D/g, '')

    const matchNome = c.nome.toLowerCase().includes(buscaLower)
    const matchCPF = buscaNumerica.length > 0 && c.cpf.replace(/\D/g, '').includes(buscaNumerica)

    if (busca && !matchNome && !matchCPF) return false

    return true
  })

  const totalItems = clientesFiltrados.length
  const totalPages = Math.ceil(totalItems / pageSize)
  const startIndex = (currentPage - 1) * pageSize
  const endIndex = startIndex + pageSize
  const clientesPaginados = clientesFiltrados.slice(startIndex, endIndex)

  useEffect(() => {
    setCurrentPage(1)
  }, [busca, ativos, showAll])

  const handleClienteClick = (clienteID: number) => {
    setLoading(true)
    setTimeout(() => {
      router.push(`/visualizar-cliente?cliente=${clienteID}`)
      setLoading(false)
    }, 400)
  }

  const handleExcluirClick = (e: React.MouseEvent, cliente: Cliente) => {
    e.stopPropagation()
    setClienteParaExcluir(cliente)
    setModalAberto(true)
  }

  const confirmarExclusao = async () => {
    if (!clienteParaExcluir) return
    setLoading(true)
    try {
      await deletarCliente(clienteParaExcluir.id)
      setClientes((prev) => prev.filter((c) => c.id !== clienteParaExcluir.id))
      setModalAberto(false)
      setClienteParaExcluir(null)
      toaster.create({ description: 'Cliente excluído com sucesso!', type: 'success' })
    } catch (error) {
      toaster.create({ description: 'Erro ao excluir cliente. Tente novamente.', type: 'error' })
    } finally {
      setLoading(false)
    }
  }

  const cancelarExclusao = () => {
    setModalAberto(false)
    setClienteParaExcluir(null)
  }

  const fetchClientes = async () => {
    setLoading(true)
    const data = await getClientes()
    setClientes(data)

    const ativosData = data.filter((cliente) =>
      cliente.processos.some((processo) => !processo.arquivado)
    )
    setClientesAtivos(ativosData)

    setLoading(false)
  }

  useEffect(() => {
    fetchClientes()
  }, [])

  return (
    <Box p={6} bg="#f4f8fb" minH="100vh" margin="0 auto">
      <Breadcrumb />
      <Text fontSize="2xl" fontWeight="bold" mb={4}>
        Clientes
      </Text>

      <Grid gridTemplateColumns={'1fr 250px'} gap={4} alignItems="center">
        <CustomInput
          placeholder="Buscar por nome ou CPF..."
          isSearch
          value={busca}
          onChange={(e) => handleBuscaChange(e.target.value)}
        />
        <CustomCheckbox
          label="Clientes com processos ativos"
          onChange={handleAtivosToggle}
          isChecked={ativos}
        />
      </Grid>

      <Box my={4}>
        <GridTable<Cliente>
          columns={[
            { key: 'nome', label: 'Nome', width: '2fr' },
            { key: 'cpf', label: 'CPF', width: '1fr' },
            { key: 'telefone', label: 'Telefone', width: '1fr' },
            { key: 'email', label: 'Email', width: '1fr' },
            { key: 'processosCount', label: 'Processos', width: '1fr' },
            { key: 'actions', label: '', width: '120px', align: 'right' }
          ]}
          data={clientesPaginados}
          onRowClick={(cliente) => handleClienteClick(cliente.id)}
          renderCell={(cliente, column) => {
            if (column.key === 'cpf') return <Text>{maskCPF(cliente.cpf)}</Text>
            if (column.key === 'telefone') return <Text>{cliente.telefone ? maskTelefone(cliente.telefone) : 'Não informado'}</Text>
            if (column.key === 'email') return <Text>{cliente.email ?? 'Não informado'}</Text>
            if (column.key === 'processosCount') return <Text>{cliente.processos.length ?? 0}</Text>
            if (column.key === 'actions')
              return (
                <Flex gap={1}>
                  <IconButton
                    variant="ghost"
                    aria-label="Visualizar cliente"
                    size="sm"
                    onClick={(e) => {
                      e.stopPropagation()
                      handleClienteClick(cliente.id)
                    }}
                  >
                    <IoEyeOutline />
                  </IconButton>
                  <IconButton
                    variant="ghost"
                    aria-label="Excluir cliente"
                    size="sm"
                    onClick={(e) => handleExcluirClick(e, cliente)}
                    _hover={{ color: 'red.500' }}
                  >
                    <IoTrash />
                  </IconButton>
                </Flex>
              )
            return <Text>{String(cliente[column.key as keyof Cliente] || '')}</Text>
          }}
          emptyMessage="Nenhum cliente encontrado"
        />
      </Box>
      <Flex justifyContent="space-between" alignItems="center" my={3} ml={2}>
        <Text fontSize="sm" color="gray.600">
          Mostrando {startIndex + 1} - {Math.min(endIndex, totalItems)} de {totalItems} clientes
        </Text>
        <Pagination.Root
          count={totalItems}
          pageSize={pageSize}
          page={currentPage}
          onPageChange={(details) => setCurrentPage(details.page)}
          display="flex"
          justifyContent="flex-end"
        >
          <ButtonGroup variant="ghost" size="sm" wrap="wrap">
            <Pagination.PrevTrigger asChild>
              <IconButton disabled={currentPage === 1}>
                <LuChevronLeft />
              </IconButton>
            </Pagination.PrevTrigger>

            <Pagination.Items
              render={(page) => (
                <IconButton
                  key={page.value}
                  variant={page.value === currentPage ? 'outline' : 'ghost'}
                  onClick={() => setCurrentPage(page.value)}
                >
                  {page.value}
                </IconButton>
              )}
            />

            <Pagination.NextTrigger asChild>
              <IconButton disabled={currentPage === totalPages}>
                <LuChevronRight />
              </IconButton>
            </Pagination.NextTrigger>
          </ButtonGroup>
        </Pagination.Root>
      </Flex>

      {modalAberto && (
        <Box
          position="fixed"
          top="0"
          left="0"
          right="0"
          bottom="0"
          bg="rgba(0, 0, 0, 0.6)"
          display="flex"
          alignItems="center"
          justifyContent="center"
          zIndex="modal"
        >
          <Box bg="white" p={6} borderRadius="md" boxShadow="xl" minW="400px">
            <Text fontSize="lg" fontWeight="bold" mb={4}>
              Confirmar Exclusão
            </Text>
            <Text mb={6} color="gray.600">
              Tem certeza que deseja excluir o cliente{' '}
              <Text as="span" fontWeight="bold">
                {clienteParaExcluir?.nome}
              </Text>
              ? Esta ação não pode ser desfeita.
            </Text>
            <Flex gap={3} justifyContent="flex-end">
              <Button variant="ghost" onClick={cancelarExclusao} p={4}>
                Cancelar
              </Button>
              <Button
                bg="red.500"
                color="white"
                _hover={{ bg: 'red.600' }}
                onClick={confirmarExclusao}
                p={4}
              >
                Excluir
              </Button>
            </Flex>
          </Box>
        </Box>
      )}
    </Box>
  )
}

export default function ClientesPage() {
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
      <ClientesPageContent />
    </Suspense>
  )
}
