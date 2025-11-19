'use client'
import {
  Box,
  ButtonGroup,
  IconButton,
  Flex,
  Text,
  Skeleton,
  Pagination,
  Button,
  Grid
} from '@chakra-ui/react'
import { LuChevronLeft, LuChevronRight, LuFilter } from 'react-icons/lu'
import { useEffect, useState, Suspense } from 'react'
import { useLoading } from '@/components/LoadingContext'
import { useRouter, useSearchParams } from 'next/navigation'
import { getProcessos } from '@/services/processo-service'
import { Processo } from '../../../types/processos'
import { useBreadcrumb } from '@/components/BreadcrumbContext'
import Breadcrumb from '@/components/Breadcrumb'
import { CustomSelect, SelectOption } from '@/components/CustomSelect'
import GridTable from '@/components/GridTable'
import { formatDate, formatDateHour } from '../../../utils/formatDate'
import CustomCheckbox from '@/components/CustomCheckbox'
import { MdPersonAdd } from 'react-icons/md'
import CustomInput from '@/components/CustomInput'
import { Modal } from '@/components/Modal'

const ProcessosContent = () => {
  const [isLoading, setIsLoading] = useState(true)
  const [processos, setProcessos] = useState<Processo[]>([])
  const [responsaveisList, setResponsaveisList] = useState<SelectOption[]>([])
  const [tiposAgendamentoList, setTiposAgendamentoList] = useState<SelectOption[]>([])
  const [tiposProcessosList, setTiposProcessosList] = useState<SelectOption[]>([])
  const [statusOptions, setStatusOptions] = useState<SelectOption[]>([])
  const [showArquivados, setShowArquivados] = useState(false)
  const [showAtivos, setShowAtivos] = useState(true)
  const [currentPage, setCurrentPage] = useState(1)
  const [pageSize] = useState(10)
  const { setLoading } = useLoading()
  const { setBreadcrumbs } = useBreadcrumb()
  const router = useRouter()
  const searchParams = useSearchParams()

  const [formData, setFormData] = useState({
    situacao: '',
    tipoProcesso: '',
    responsavel: '',
    dataAgendamento: '',
    tipoAgendamento: '',
    dataProtocolo: ''
  })

  const [selectedResponsavel, setSelectedResponsavel] = useState<string[]>([])
  const [selectedTipoProcesso, setSelectedTipoProcesso] = useState<string[]>([])
  const [selectedSituacao, setSelectedSituacao] = useState<string[]>([])
  const [selectedTipoAgendamento, setSelectedTipoAgendamento] = useState<string[]>([])
  const [isFilterModalOpen, setIsFilterModalOpen] = useState(false)

  const handlePush = (path: string) => {
    setLoading(true)
    setTimeout(() => {
      router.push(path)
      setLoading(false)
    }, 400)
  }

  useEffect(() => {
    setBreadcrumbs([
      { label: 'Início', path: '/home' },
      { label: 'Processos', path: '/processos' }
    ])
  }, [setBreadcrumbs])

  const updateURLParams = (newData: Partial<typeof formData> & { arquivados?: boolean }) => {
    const params = new URLSearchParams()

    if (newData.responsavel) params.set('responsavel', newData.responsavel)
    if (newData.tipoProcesso) params.set('tipoProcesso', newData.tipoProcesso)
    if (newData.situacao) params.set('situacao', newData.situacao)
    if (newData.arquivados) params.set('arquivados', 'true')
    if (newData.dataAgendamento) params.set('dataAgendamento', newData.dataAgendamento)
    if (newData.tipoAgendamento) params.set('tipoAgendamento', newData.tipoAgendamento)
    if (newData.dataProtocolo) params.set('dataProtocolo', newData.dataProtocolo)

    const queryString = params.toString()
    router.push(`/processos${queryString ? '?' + queryString : ''}`, { scroll: false })
  }

  const clearAllFilters = () => {
    setFormData({
      situacao: '',
      tipoProcesso: '',
      responsavel: '',
      dataAgendamento: '',
      tipoAgendamento: '',
      dataProtocolo: ''
    })
    setSelectedResponsavel([])
    setSelectedTipoProcesso([])
    setSelectedSituacao([])
    setSelectedTipoAgendamento([])
    setShowArquivados(false)
    setShowAtivos(true)

    router.push('/processos', { scroll: false })
    setIsFilterModalOpen(false)
  }

  const fetchProcessos = async () => {
    const processosList = await getProcessos()
    setProcessos(processosList)

    const responsaveis = processosList
      .map((p) => p.funcionario?.nome || '')
      .filter((v, i, a) => !!v && a.indexOf(v) === i)
      .map((r) => ({ label: r, value: r }))
    setResponsaveisList(responsaveis)

    const tiposProcessos = processosList
      .map((p) => p.beneficio?.nome)
      .filter((v, i, a) => !!v && a.indexOf(v) === i)
      .map((t) => ({ label: t!, value: t! }))
    setTiposProcessosList(tiposProcessos)

    const status = processosList
      .map((p) => p.status?.nome)
      .filter((v, i, a) => !!v && a.indexOf(v) === i)
      .map((s) => ({ label: s!, value: s! }))
    setStatusOptions(status)

    const tiposAgendamento = processosList
      .flatMap((p) => p.agendamentos || [])
      .map((agendamento) => agendamento.tipo_agendamento?.nome)
      .filter((v, i, a) => !!v && a.indexOf(v) === i)
      .map((t) => ({ label: t!, value: t! }))
    setTiposAgendamentoList(tiposAgendamento)

    setIsLoading(false)
  }

  useEffect(() => {
    fetchProcessos()
  }, [])

  useEffect(() => {
    const responsavel = searchParams.get('responsavel') || ''
    const tipoProcesso = searchParams.get('tipoProcesso') || ''
    const dataAgendamento = searchParams.get('dataAgendamento') || ''
    const tipoAgendamento = searchParams.get('tipoAgendamento') || ''
    const situacao = searchParams.get('situacao') || ''
    const dataProtocolo = searchParams.get('dataProtocolo') || ''
    const arquivados = searchParams.get('arquivados') === 'true'
    const ativos = searchParams.get('arquivados') === 'false'

    setFormData({ responsavel, tipoProcesso, situacao, dataAgendamento, tipoAgendamento, dataProtocolo })
    setSelectedResponsavel(responsavel ? [responsavel] : [])
    setSelectedTipoAgendamento(tipoAgendamento ? [tipoAgendamento] : [])
    setSelectedSituacao(situacao ? [situacao] : [])
    setShowArquivados(arquivados)
    setShowAtivos(ativos)
  }, [searchParams])

  const processosFiltrados = processos.filter((proc) => {
    const nomeBeneficio = proc.beneficio?.nome || ''
    const nomeStatus = proc.status?.nome || ''

    let colaborador = ''
    if (proc.funcionario && typeof proc.funcionario === 'object') {
      colaborador = proc.funcionario.nome || ''
    }

    const matchResponsavel = !formData.responsavel || colaborador === formData.responsavel
    const matchTipo = !formData.tipoProcesso || nomeBeneficio === formData.tipoProcesso
    const matchSituacao = !formData.situacao || nomeStatus === formData.situacao
    const matchArquivado = !showArquivados || (showArquivados && proc.arquivado === true)
    const matchAtivo = !showAtivos || (showAtivos && proc.arquivado === false)

    const matchDataAgendamento =
      !formData.dataAgendamento ||
      (() => {
        if (!proc.agendamentos || proc.agendamentos.length === 0) return false
        const filterDate = new Date(formData.dataAgendamento)

        return proc.agendamentos.some(agendamento => {
          const procDate = new Date(agendamento.data_agendamento)
          return (
            filterDate.getFullYear() === procDate.getFullYear() &&
            filterDate.getMonth() === procDate.getMonth() &&
            filterDate.getDate() === procDate.getDate() &&
            filterDate.getHours() === procDate.getHours() &&
            filterDate.getMinutes() === procDate.getMinutes()
          )
        })
      })()

    const matchTipoAgendamento =
      !formData.tipoAgendamento ||
      (proc.agendamentos && proc.agendamentos.some(agendamento =>
        agendamento.tipo_agendamento?.nome === formData.tipoAgendamento
      ))

    const matchDataProtocolo =
      !formData.dataProtocolo ||
      (() => {
        if (!proc.data_protocolo) return false
        const filterDate = new Date(formData.dataProtocolo)
        const procDate = new Date(proc.data_protocolo)

        return (
          filterDate.getFullYear() === procDate.getFullYear() &&
          filterDate.getMonth() === procDate.getMonth() &&
          filterDate.getDate() === procDate.getDate()
        )
      })()

    return (
      matchResponsavel &&
      matchTipo &&
      matchSituacao &&
      matchArquivado &&
      matchAtivo &&
      matchDataAgendamento &&
      matchTipoAgendamento &&
      matchDataProtocolo
    )
  })

  const totalItems = processosFiltrados.length
  const totalPages = Math.ceil(totalItems / pageSize)
  const startIndex = (currentPage - 1) * pageSize
  const endIndex = startIndex + pageSize
  const processosPaginados = processosFiltrados.slice(startIndex, endIndex)

  useEffect(() => {
    setCurrentPage(1)
  }, [formData, showArquivados])

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
          <Flex justify="space-between" align="center" mb={3}>
            <Button
              variant="surface"
              size="sm"
              p="20px 10px"
              borderRadius="4px"
              backgroundColor="var(--primary)"
              color="white"
              fontWeight="bold"
              style={{ display: 'flex', alignItems: 'center', gap: 8 }}
              onClick={() => handlePush('/cadastrar-processos')}
            >
              <MdPersonAdd style={{ marginRight: 6 }} /> Cadastrar Processo
            </Button>

            <Modal
              hasButton
              buttonText="Filtros"
              icon={<LuFilter style={{ marginRight: 6 }} />}
              title="Filtros"
              size="lg"
              open={isFilterModalOpen}
              onClose={() => setIsFilterModalOpen(false)}
              isActive={
                !!(
                  formData.responsavel ||
                  formData.tipoProcesso ||
                  formData.situacao ||
                  formData.dataAgendamento ||
                  formData.tipoAgendamento ||
                  formData.dataProtocolo ||
                  showArquivados
                )
              }
            >
              <Grid gap={3}>
                <CustomSelect
                  label="Tipo de Processo"
                  placeholder="Selecione o tipo"
                  options={tiposProcessosList}
                  value={selectedTipoProcesso}
                  onValueChange={(v) => {
                    setSelectedTipoProcesso(v)
                    setFormData((prev) => ({ ...prev, tipoProcesso: v[0] || '' }))
                  }}
                  clearable
                />
                <CustomSelect
                  label="Situação"
                  placeholder="Selecione a situação"
                  options={statusOptions}
                  value={selectedSituacao}
                  onValueChange={(v) => {
                    setSelectedSituacao(v)
                    setFormData((prev) => ({ ...prev, situacao: v[0] || '' }))
                  }}
                  clearable
                />
                <CustomSelect
                  label="Tipo de Agendamento"
                  placeholder="Selecione o tipo"
                  options={tiposAgendamentoList}
                  value={selectedTipoAgendamento}
                  onValueChange={(v) => {
                    setSelectedTipoAgendamento(v)
                    setFormData((prev) => ({ ...prev, tipoAgendamento: v[0] || '' }))
                  }}
                  clearable
                  variant="outline"
                />
                <CustomInput
                  type="datetime-local"
                  label="Data de Agendamento"
                  value={
                    formData.dataAgendamento
                      ? (() => {
                          const date = new Date(formData.dataAgendamento)
                          date.setHours(date.getHours() - 3)
                          return date.toISOString().slice(0, 16)
                        })()
                      : ''
                  }
                  onChange={(e) => {
                    const value = e.target.value
                    if (value) {
                      const localDate = new Date(value)
                      const isoValue = localDate.toISOString()
                      setFormData((prev) => ({ ...prev, dataAgendamento: isoValue }))
                    } else {
                      setFormData((prev) => ({ ...prev, dataAgendamento: '' }))
                    }
                  }}
                />
                <CustomInput
                  type="date"
                  label="Data do Protocolo"
                  value={formData.dataProtocolo}
                  onChange={(e) => {
                    setFormData((prev) => ({ ...prev, dataProtocolo: e.target.value }))
                  }}
                />
                <CustomCheckbox
                  label="Arquivados"
                  isChecked={showArquivados}
                  onChange={() => setShowArquivados(!showArquivados)}
                />

                <Flex gap={3} mt={4}>
                  <Button flex={1} variant="outline" onClick={clearAllFilters}>
                    Limpar Filtros
                  </Button>
                  <Button
                    flex={1}
                    bg="var(--primary)"
                    color="white"
                    onClick={() => {
                      updateURLParams({ ...formData, arquivados: showArquivados })
                      setIsFilterModalOpen(false)
                    }}
                  >
                    Aplicar Filtros
                  </Button>
                </Flex>
              </Grid>
            </Modal>
          </Flex>
          <Box my={4}>
            <GridTable<Processo>
              columns={[
                { key: 'cliente', label: 'Nome do cliente', width: '1.5fr' },
                { key: 'beneficio', label: 'Tipo de processo', width: '1fr' },
                { key: 'status', label: 'Situação', width: '1fr' },
                { key: 'data_protocolo', label: 'Data do Protocolo', width: '1fr' },
                { key: 'colaborador_responsavel', label: 'Responsável', width: '1fr' },
                { key: 'tipo_agendamento', label: 'Tipo de Agendamento', width: '1fr' },
                { key: 'data_agendamento', label: 'Data de Agendamento', width: '1fr' }
              ]}
              data={processosPaginados}
              onRowClick={(proc) =>
                handlePush('/visualizar-cliente?cliente=' + (proc.cliente?.id || '-'))
              }
              renderCell={(proc, col) => {
                if (col.key === 'cliente') return <Text>{proc.cliente?.nome || '-'}</Text>
                if (col.key === 'beneficio') return <Text>{proc.beneficio?.nome || '-'}</Text>
                if (col.key === 'status') return <Text>{proc.status?.nome || '-'}</Text>
                if (col.key === 'colaborador_responsavel') return <Text>{proc.colaborador_responsavel !== '' ? proc.colaborador_responsavel : '-'}</Text>

                if (col.key === 'tipo_agendamento') {
                  return (
                    <Box>
                      {proc.agendamentos && proc.agendamentos.length > 0
                        ? proc.agendamentos.map((ag, index) => (
                            <Text key={index} fontSize="sm">
                              {ag.tipo_agendamento?.nome || '-'}
                            </Text>
                          ))
                        : <Text>-</Text>}
                    </Box>
                  )
                }
                if (col.key === 'data_protocolo')
                  return <Text>{formatDate(proc.data_protocolo || '-')}</Text>
                if (col.key === 'data_agendamento') {
                  return (
                    <Box>
                      {proc.agendamentos && proc.agendamentos.length > 0
                        ? proc.agendamentos.map((ag, index) => (
                            <Text key={index} fontSize="sm">
                              {formatDateHour(ag.data_agendamento)}
                            </Text>
                          ))
                        : <Text>-</Text>}
                    </Box>
                  )
                }
                return <Text>{String(proc[col.key as keyof Processo] ?? '-')}</Text>
              }}
              emptyMessage="Nenhum processo encontrado"
            />
          </Box>

          <Flex justifyContent="space-between" alignItems="center" mb={3}>
            <Text fontSize="sm" color="gray.600">
              Mostrando {startIndex + 1} - {Math.min(endIndex, totalItems)} de {totalItems}{' '}
              processos
            </Text>

            <Pagination.Root
              count={totalItems}
              pageSize={pageSize}
              page={currentPage}
              onPageChange={(d) => setCurrentPage(d.page)}
              display="flex"
              justifyContent="flex-end"
            >
              <ButtonGroup variant="ghost" size="sm">
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
        </>
      )}
    </Box>
  )
}

const ProcessosPage = () => {
  return (
    <Suspense
      fallback={
        <Box p={6} bg="#fff" minH="100vh" margin="0 auto">
          <Skeleton height="400px" />
        </Box>
      }
    >
      <ProcessosContent />
    </Suspense>
  )
}

export default ProcessosPage
