'use client'
import {
  Box,
  ButtonGroup,
  IconButton,
  Flex,
  Text,
  Skeleton,
  Pagination,
  Button
} from '@chakra-ui/react'
import { IoEyeOutline } from 'react-icons/io5'
import { LuChevronLeft, LuChevronRight } from 'react-icons/lu'
import Link from 'next/link'
import { useEffect, useState } from 'react'
import { useLoading } from '@/components/LoadingContext'
import { useRouter, useSearchParams } from 'next/navigation'
import { getProcessos } from '@/services/processo-service'
import { Processo } from '../../../types/processos'
import { useBreadcrumb } from '@/components/BreadcrumbContext'
import Breadcrumb from '@/components/Breadcrumb'
import { CustomSelect, SelectOption } from '@/components/CustomSelect'
import GridTable from '@/components/GridTable'
import formatDate from '../../../utils/formatDate'
import CustomCheckbox from '@/components/CustomCheckbox'
import { MdPersonAdd } from 'react-icons/md'

const ProcessosPage = () => {
  const [isLoading, setIsLoading] = useState(true)
  const [processos, setProcessos] = useState<Processo[]>([])
  const [responsaveisList, setResponsaveisList] = useState<SelectOption[]>([])
  const [tiposProcessosList, setTiposProcessosList] = useState<SelectOption[]>([])
  const [statusOptions, setStatusOptions] = useState<SelectOption[]>([])
  const [showArquivados, setShowArquivados] = useState(false)
  const [showAtivos, setShowAtivos] = useState(true)
  const [showAll, setShowAll] = useState(false)
  const [currentPage, setCurrentPage] = useState(1)
  const [pageSize] = useState(10)
  const { setLoading } = useLoading()
  const { setBreadcrumbs } = useBreadcrumb()
  const router = useRouter()
  const searchParams = useSearchParams()

  const [formData, setFormData] = useState({
    situacao: '',
    tipoProcesso: '',
    responsavel: ''
  })

  const [selectedResponsavel, setSelectedResponsavel] = useState<string[]>([])
  const [selectedTipoProcesso, setSelectedTipoProcesso] = useState<string[]>([])
  const [selectedSituacao, setSelectedSituacao] = useState<string[]>([])

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

    const queryString = params.toString()
    router.push(`/processos${queryString ? '?' + queryString : ''}`, { scroll: false })
  }

  const handleSituacao = (value: string[]) => {
    const situacao = value[0] || ''
    setSelectedSituacao(value)
    setFormData((prev) => ({ ...prev, situacao }))
    updateURLParams({ ...formData, situacao, arquivados: showArquivados })
  }

  const handleResponsavel = (value: string[]) => {
    const responsavel = value[0] || ''
    setSelectedResponsavel(value)
    setFormData((prev) => ({ ...prev, responsavel }))
    updateURLParams({ ...formData, responsavel, arquivados: showArquivados })
  }

  const handleTiposProcesso = (value: string[]) => {
    const tipoProcesso = value[0] || ''
    setSelectedTipoProcesso(value)
    setFormData((prev) => ({ ...prev, tipoProcesso }))
    updateURLParams({ ...formData, tipoProcesso, arquivados: showArquivados })
  }

  const handleArquivados = () => {
    const novoValor = !showArquivados
    setShowArquivados(novoValor)
    updateURLParams({ ...formData, arquivados: novoValor })
  }

  const fetchProcessos = async () => {
    const processosList = await getProcessos()
    setProcessos(processosList)

    const responsaveis = processosList
      .map((p) => {
        if (typeof p.colaborador === 'object' && p.colaborador !== null)
          return (p.colaborador as { nome?: string }).nome || ''
        return typeof p.colaborador === 'string' ? p.colaborador : ''
      })
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

    setIsLoading(false)
  }

  useEffect(() => {
    fetchProcessos()
  }, [])

  useEffect(() => {
    const responsavel = searchParams.get('responsavel') || ''
    const tipoProcesso = searchParams.get('tipoProcesso') || ''
    const situacao = searchParams.get('situacao') || ''
    const arquivados = searchParams.get('arquivados') === 'true'
    const ativos = searchParams.get('arquivados') === 'false'
    const all = searchParams.get('all') === 'true'

    setFormData({ responsavel, tipoProcesso, situacao })
    setSelectedResponsavel(responsavel ? [responsavel] : [])
    setSelectedTipoProcesso(tipoProcesso ? [tipoProcesso] : [])
    setSelectedSituacao(situacao ? [situacao] : [])
    setShowArquivados(arquivados)
    setShowAtivos(ativos)
    setShowAll(all)
  }, [searchParams])

  const processosFiltrados = processos.filter((proc) => {
    const nomeBeneficio = proc.beneficio?.nome || ''
    const nomeStatus = proc.status?.nome || ''

    let colaborador = ''
    if (typeof proc.colaborador === 'object' && proc.colaborador !== null) {
      colaborador = (proc.colaborador as { nome?: string }).nome || ''
    } else if (typeof proc.colaborador === 'string') {
      colaborador = proc.colaborador
    }

    const matchResponsavel = !formData.responsavel || colaborador === formData.responsavel
    const matchTipo = !formData.tipoProcesso || nomeBeneficio === formData.tipoProcesso
    const matchSituacao = !formData.situacao || nomeStatus === formData.situacao
    const matchArquivado = !showArquivados || (showArquivados && proc.arquivado === true)
    const matchAtivo = !showAtivos || (showAtivos && proc.arquivado === false)
    return matchResponsavel && matchTipo && matchSituacao && matchArquivado && matchAtivo
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
          <Flex gap={3} mb={3} alignItems="center">
            <CustomSelect
              label="Responsável"
              placeholder="Selecione o funcionário"
              options={responsaveisList}
              value={selectedResponsavel}
              onValueChange={handleResponsavel}
              clearable
              variant="outline"
            />
            <CustomSelect
              label="Tipo de Processo"
              placeholder="Selecione o tipo"
              options={tiposProcessosList}
              value={selectedTipoProcesso}
              onValueChange={handleTiposProcesso}
              clearable
              variant="outline"
            />
            <CustomSelect
              label="Situação"
              placeholder="Selecione a situação"
              options={statusOptions}
              value={selectedSituacao}
              onValueChange={handleSituacao}
              clearable
              variant="outline"
            />
          </Flex>
          <Flex gap={6} mb={4} alignItems="center" justifyContent="space-between">
            <CustomCheckbox
              label="Arquivados"
              isChecked={showArquivados}
              onChange={handleArquivados}
            />
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
          </Flex>
          <Box my={4}>
            <GridTable<Processo>
              columns={[
                { key: 'cliente', label: 'Nome do cliente', width: '2fr' },
                { key: 'beneficio', label: 'Tipo de processo', width: '1.5fr' },
                { key: 'status', label: 'Situação', width: '1fr' },
                { key: 'data_cadastro', label: 'Atendimento', width: '1fr' },
                { key: 'colaborador', label: 'Responsável', width: '1fr' },
                { key: 'actions', label: '', width: '80px', align: 'right' }
              ]}
              data={processosPaginados}
              onRowClick={(proc) =>
                handlePush('/visualizar-cliente?cliente=' + (proc.cliente?.id || ''))
              }
              renderCell={(proc, col) => {
                if (col.key === 'cliente') return <Text>{proc.cliente?.nome || ''}</Text>
                if (col.key === 'beneficio') return <Text>{proc.beneficio?.nome || ''}</Text>
                if (col.key === 'status') return <Text>{proc.status?.nome || ''}</Text>
                if (col.key === 'data_cadastro')
                  return <Text>{formatDate(proc.data_cadastro)}</Text>
                if (col.key === 'colaborador') {
                  const nome =
                    typeof proc.colaborador === 'object'
                      ? proc.colaborador?.nome || ''
                      : (proc.colaborador as string)
                  return <Text>{nome}</Text>
                }
                if (col.key === 'actions')
                  return (
                    <Link
                      href={{
                        pathname: '/visualizar-cliente',
                        query: { cliente: proc.cliente?.id || '' }
                      }}
                      onClick={(e) => e.stopPropagation()}
                    >
                      <IoEyeOutline size={20} />
                    </Link>
                  )
                return <Text>{String(proc[col.key as keyof Processo] ?? '')}</Text>
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

export default ProcessosPage
