'use client'
import {
  Box,
  ButtonGroup,
  IconButton,
  Input,
  InputGroup,
  Pagination,
  Flex,
  Text,
  Field,
  Skeleton,
} from '@chakra-ui/react'
import { IoEyeOutline, IoSearchOutline } from 'react-icons/io5'
import { LuChevronLeft, LuChevronRight } from 'react-icons/lu'
import Link from 'next/link'
import { useEffect, useState } from 'react'
import { useLoading } from '@/components/LoadingContext'
import { useRouter } from 'next/navigation'
import { getProcessos } from '@/services/processo-service'
import { Processo } from '../../../types/processos'
import { useBreadcrumb } from '@/components/BreadcrumbContext'
import Breadcrumb from '@/components/Breadcrumb'
import { CustomSelect, SelectOption } from '@/components/CustomSelect'
import GridTable from '@/components/GridTable'

const ProcessosPage = () => {
  const [isLoading, setIsLoading] = useState(true)
  const [processos, setProcessos] = useState<Processo[]>([])
  const [responsaveisList, setResponsaveisList] = useState<SelectOption[]>([])
  const [tiposProcessosList, setTiposProcessosList] = useState<SelectOption[]>([])
  const [statusOptions, setStatusOptions] = useState<SelectOption[]>([])
  const router = useRouter()
  const { setLoading } = useLoading()

  const handlePush = (path: string) => {
    setLoading(true)
    setTimeout(() => {
      router.push(path)
      setLoading(false)
    }, 400)
  }
  const [busca, setBusca] = useState('')
  const [formData, setFormData] = useState({ situacao: '', tipoProcesso: '', responsavel: '' })
  const [selectedResponsavel, setSelectedResponsavel] = useState<string[]>([])
  const [selectedTipoProcesso, setSelectedTipoProcesso] = useState<string[]>([])
  const [selectedSituacao, setSelectedSituacao] = useState<string[]>([])
  const [currentPage, setCurrentPage] = useState(1)
  const [pageSize] = useState(10)
  const { setBreadcrumbs } = useBreadcrumb()

  useEffect(() => {
    setBreadcrumbs([
      { label: 'Início', path: '/home' },
      { label: 'Processos', path: '/processos' },
    ])
  }, [setBreadcrumbs])

  const handleSituacao = (value: string[]) => {
    setSelectedSituacao(value)
    if (!value.length) {
      setFormData((prev) => ({ ...prev, situacao: '' }))
      return
    }
    setFormData((prev) => ({ ...prev, situacao: value[0] }))
  }

  const handleResponsavel = (value: string[]) => {
    setSelectedResponsavel(value)
    if (!value.length) {
      setFormData((prev) => ({ ...prev, responsavel: '' }))
      return
    }
    setFormData((prev) => ({ ...prev, responsavel: value[0] }))
  }

  const handleTiposProcesso = (value: string[]) => {
    setSelectedTipoProcesso(value)
    if (!value.length) {
      setFormData((prev) => ({ ...prev, tipoProcesso: '' }))
      return
    }
    setFormData((prev) => ({ ...prev, tipoProcesso: value[0] }))
  }

  const fetchProcessos = async () => {
    const processosList = await getProcessos()
    setProcessos(processosList)

    const responsaveis = processosList
      .map((p) => {
        if (typeof p.colaborador === 'object' && p.colaborador !== null) {
          const colaboradorObj = p.colaborador as { nome?: string; id?: number }
          return colaboradorObj.nome || ''
        }
        return typeof p.colaborador === 'string' ? p.colaborador : ''
      })
      .filter((value, index, self) => !!value && self.indexOf(value) === index)
      .map((responsavel) => ({ label: responsavel, value: responsavel }))
    setResponsaveisList(responsaveis)

    const tiposProcessos = processosList
      .map((p) => p.beneficio?.nome)
      .filter((value, index, self) => !!value && self.indexOf(value) === index)
      .map((tipo) => ({ label: tipo!, value: tipo! }))
    setTiposProcessosList(tiposProcessos)

    const status = processosList
      .map((p) => p.status?.nome)
      .filter((value, index, self) => !!value && self.indexOf(value) === index)
      .map((tipo) => ({ label: tipo!, value: tipo! }))
    setStatusOptions(status)

    setIsLoading(false)
  }

  useEffect(() => {
    fetchProcessos()
  }, [])

  const processosFiltrados = processos.filter((proc) => {
    const nomeCliente = proc.cliente?.nome || ''
    const nomeBeneficio = proc.beneficio?.nome || ''
    const nomeStatus = proc.status?.nome || ''

    // Tratar colaborador que pode ser string ou objeto
    let colaborador = ''
    if (typeof proc.colaborador === 'object' && proc.colaborador !== null) {
      const colaboradorObj = proc.colaborador as { nome?: string }
      colaborador = colaboradorObj.nome || ''
    } else if (typeof proc.colaborador === 'string') {
      colaborador = proc.colaborador
    }

    const matchBusca =
      nomeCliente.toLowerCase().includes(busca.toLowerCase()) ||
      nomeBeneficio.toLowerCase().includes(busca.toLowerCase())
    const matchResponsavel = !formData.responsavel || colaborador === formData.responsavel
    const matchTipo = !formData.tipoProcesso || nomeBeneficio === formData.tipoProcesso
    const matchSituacao = !formData.situacao || nomeStatus === formData.situacao
    return matchBusca && matchResponsavel && matchTipo && matchSituacao
  })

  // Paginação
  const totalItems = processosFiltrados.length
  const totalPages = Math.ceil(totalItems / pageSize)
  const startIndex = (currentPage - 1) * pageSize
  const endIndex = startIndex + pageSize
  const processosPaginados = processosFiltrados.slice(startIndex, endIndex)

  // Reset da página quando filtros mudarem
  useEffect(() => {
    setCurrentPage(1)
  }, [busca, formData.responsavel, formData.tipoProcesso, formData.situacao])

  return (
    <Box p={6} bg="#fff" minH="100vh" margin="0 auto">
      <Breadcrumb />
      <Text fontSize="2xl" fontWeight="bold" mb={4}>
        Processos
      </Text>
      {isLoading ? (
        <Skeleton />
      ) : (
        <>
          <Flex gap={3} mb={3} alignItems="center">
            <Field.Root required>
              <Field.Label fontWeight={'bold'}>Buscar</Field.Label>
              <InputGroup
                endElement={
                  <IconButton variant="ghost" aria-label="Buscar">
                    <IoSearchOutline />
                  </IconButton>
                }
              >
                <Input
                  placeholder="Buscar processo..."
                  p={5}
                  borderRadius="4px"
                  value={busca}
                  onChange={(e) => setBusca(e.target.value)}
                />
              </InputGroup>
            </Field.Root>

            <CustomSelect
              label="Responsável"
              placeholder="Selecione o funcionário"
              options={responsaveisList}
              value={selectedResponsavel}
              onValueChange={handleResponsavel}
              clearable={true}
              variant="outline"
            />

            <CustomSelect
              label="Tipo de Processo"
              placeholder="Selecione o tipo"
              options={tiposProcessosList}
              value={selectedTipoProcesso}
              onValueChange={handleTiposProcesso}
              clearable={true}
              variant="outline"
            />

            <CustomSelect
              label="Situação"
              placeholder="Selecione a situação"
              options={statusOptions}
              value={selectedSituacao}
              onValueChange={handleSituacao}
              clearable={true}
              variant="outline"
            />
          </Flex>

          <Box mb={4}>
            <GridTable<Processo>
              columns={[
                { key: 'cliente', label: 'Nome do cliente', width: '2fr' },
                { key: 'beneficio', label: 'Tipo de processo', width: '1.5fr' },
                { key: 'status', label: 'Tipo de agendamento', width: '1fr' },
                { key: 'data_atendimento', label: 'Data de cadastro', width: '1fr' },
                { key: 'colaborador', label: 'Responsável', width: '1fr' },
                { key: 'actions', label: '', width: '80px', align: 'right' },
              ]}
              data={processosPaginados}
              onRowClick={(processo) =>
                handlePush('/visualizar-cliente?cliente=' + (processo.cliente?.id || ''))
              }
              renderCell={(processo, column) => {
                if (column.key === 'cliente') {
                  return <Text color="gray.700">{processo.cliente?.nome || ''}</Text>
                }
                if (column.key === 'beneficio') {
                  return <Text color="gray.700">{processo.beneficio?.nome || ''}</Text>
                }
                if (column.key === 'status') {
                  return <Text color="gray.700">{processo.status?.nome || ''}</Text>
                }
                if (column.key === 'data_atendimento') {
                  return <Text color="gray.700">{processo.data_atendimento || ''}</Text>
                }
                if (column.key === 'colaborador') {
                  // Tratar colaborador que pode ser string ou objeto
                  let colaboradorNome = ''
                  if (typeof processo.colaborador === 'object' && processo.colaborador !== null) {
                    const colaboradorObj = processo.colaborador as { nome?: string }
                    colaboradorNome = colaboradorObj.nome || ''
                  } else if (typeof processo.colaborador === 'string') {
                    colaboradorNome = processo.colaborador
                  }
                  return <Text color="gray.700">{colaboradorNome}</Text>
                }
                if (column.key === 'actions') {
                  return (
                    <Link
                      href={{
                        pathname: '/visualizar-cliente',
                        query: { cliente: processo.cliente?.id || '' },
                      }}
                      title="Visualizar detalhes do cliente e processos"
                      style={{ display: 'inline-flex', alignItems: 'center' }}
                      onClick={(e) => e.stopPropagation()}
                    >
                      <IoEyeOutline size={20} />
                    </Link>
                  )
                }
                const value = processo[column.key as keyof Processo]
                let displayValue = ''

                if (value !== null && value !== undefined) {
                  if (typeof value === 'object') {
                    const objValue = value as Record<string, unknown>
                    displayValue =
                      (objValue.nome as string) ||
                      (objValue.label as string) ||
                      JSON.stringify(value)
                  } else {
                    displayValue = String(value)
                  }
                }

                return <Text color="gray.700">{displayValue}</Text>
              }}
              emptyMessage="Nenhum processo encontrado"
            />
          </Box>

          <Flex justifyContent="space-between" alignItems="center" mb={3}>
            <Text fontSize="sm" color="gray.600">
              Mostrando {startIndex + 1} - {Math.min(endIndex, totalItems)} de {totalItems}{' '}
              processos
            </Text>
          </Flex>
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
        </>
      )}
    </Box>
  )
}

export default ProcessosPage
