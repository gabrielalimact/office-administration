'use client'
import { Box, Flex, Skeleton, Stack, Text, HStack } from '@chakra-ui/react'
import { useEffect, useState } from 'react'
import { marked } from 'marked'
import { useParams } from 'next/navigation'
import { getRelatoriosByFuncionarioID } from '@/services/relatorios-service'
import { getFuncionariosByID, getLogDeAtividades } from '@/services/usuario-service'
import { CustomSelect } from '@/components/CustomSelect'
interface IFuncionario {
  id: number
  nome: string
  cargo: string
  cpf: string
  email: string
}

interface IRelatorio {
  created_at: string
  conteudo: string | string[]
  titulo: string
}

interface ILogAtividade {
  id: number
  usuario_id: number
  acao: string
  entidade_tipo: string
  entidade_id: number
  descricao: string
  dados_anteriores: Record<string, unknown> | null
  dados_novos: Record<string, unknown> | null
  ip_address: string
  user_agent: string
  data_acao: string
  usuario: {
    id: number
    nome: string
    cpf: string
    email: string
    cargo: string
    id_imagem: number
  }
}

interface ILogsResponse {
  logs: ILogAtividade[]
  total: number
  pagina: number
  totalPaginas: number
  limite: number
}
interface Props {
  conteudo: string
}
function RelatorioPreview({ conteudo }: Props) {
  const html = marked(conteudo, { breaks: true })

  return <Box className="preview-content" dangerouslySetInnerHTML={{ __html: html }} />
}

function getAcaoColor(acao: string) {
  switch (acao) {
    case 'CRIAR':
      return 'green.500'
    case 'ATUALIZAR':
      return 'blue.500'
    case 'DELETAR':
      return 'red.500'
    default:
      return 'gray.500'
  }
}

function getEntidadeTipoIcon(tipo: string) {
  switch (tipo) {
    case 'CLIENTE':
      return '👤'
    case 'PROCESSO':
      return '📋'
    case 'RELATORIO':
      return '📄'
    default:
      return '📝'
  }
}
function VisualizarRelatorioPage() {
  const params = useParams()
  const id = Number(params.id)
  const [isLoading, setIsLoading] = useState(true)
  const [funcionario, setFuncionario] = useState<IFuncionario | null>(null)
  const [relatorio, setRelatorio] = useState<IRelatorio[] | null>(null)
  const [logs, setLogs] = useState<ILogsResponse | null>(null)
  const [allLogs, setAllLogs] = useState<ILogAtividade[]>([])
  const [filteredLogs, setFilteredLogs] = useState<ILogAtividade[]>([])
  const [availableDates, setAvailableDates] = useState<string[]>([])
  const [selectedDate, setSelectedDate] = useState<string>('')

  // Função para extrair datas únicas dos logs
  const extractUniqueDates = (logsList: ILogAtividade[]) => {
    const dates = logsList.map(log => {
      const date = new Date(log.data_acao)
      return date.toLocaleDateString('pt-BR')
    })
    return [...new Set(dates)].sort((a, b) => {
      const dateA = new Date(a.split('/').reverse().join('-'))
      const dateB = new Date(b.split('/').reverse().join('-'))
      return dateB.getTime() - dateA.getTime()
    })
  }

  // Função para filtrar logs por data
  const filterLogsByDate = (logsList: ILogAtividade[], date: string) => {
    if (!date) return logsList
    return logsList.filter(log => {
      const logDate = new Date(log.data_acao).toLocaleDateString('pt-BR')
      return logDate === date
    })
  }

  // Função para lidar com mudança de data selecionada
  const handleDateChange = (dateValue: string[]) => {
    const newDate = dateValue.length > 0 ? dateValue[0] : ''
    setSelectedDate(newDate)
    setFilteredLogs(filterLogsByDate(allLogs, newDate))
  }

  useEffect(() => {
    getRelatoriosByFuncionarioID(Number(id)).then((data) => {
      const relatorios = data.map((rel) => ({
        created_at: rel.created_at,
        conteudo: rel.conteudo,
        titulo: rel.titulo
      }))
      setRelatorio(relatorios)
      setIsLoading(false)
    })

    getLogDeAtividades(id).then((data: ILogsResponse) => {
      setLogs(data)
      setAllLogs(data.logs)

      // Extrair datas únicas e configurar o filtro
      const uniqueDates = extractUniqueDates(data.logs)
      setAvailableDates(uniqueDates)

      // Mostrar todos os logs por padrão
      setSelectedDate(uniqueDates[0] || '')
      setFilteredLogs(data.logs)
    })

    getFuncionariosByID(id).then((funcionarioData) => {
      setFuncionario(funcionarioData)
    })
  }, [id])

  return (
    <Box p={6} bg="#f4f8fb" minH="100vh" margin="0 auto">
      {isLoading ? (
        <Stack>
          <Skeleton height="20px" mb="4" />
          <Skeleton height="16px" mb="2" />
        </Stack>
      ) : (
        <>
          <Text fontSize="2xl" fontWeight="bold" mb={4}>
            Relatórios e ações de {funcionario?.nome}
          </Text>
          <Text fontSize="md" mb={2} color="gray.600">
            Cargo: {funcionario?.cargo === 'socio' ? 'Sócio' : 'Funcionário'}
          </Text>
        </>
      )}

      {isLoading ? (
        <Stack>
          <Skeleton height="40px" />
          <Skeleton height="40px" />
          <Skeleton height="40px" />
          <Skeleton height="40px" />
          <Skeleton height="40px" />
        </Stack>
      ) : (
        <>
          {relatorio && relatorio.length > 0 && (
            <>
              <Text fontWeight="bold" mb={2} borderBottomWidth={1} borderColor="gray.100">
                Todos os relatórios enviados:
              </Text>
              <Box p={4} bg="white" borderRadius={8} boxShadow="sm" mb={6}>
                {relatorio.map((rel, index) => (
                  <Box
                    key={index}
                    mb={4}
                    borderBottom={index < relatorio.length - 1 ? '1px solid #e2e8f0' : 'none'}
                    pb={4}
                  >
                    <Flex align="center" gap={2} mb={2}>
                      <Text fontSize="18px" fontWeight={550}>
                        {rel?.titulo} |
                      </Text>
                      <Text fontSize="sm" color="gray.500">
                        Data de envio:{' '}
                        {new Date(rel?.created_at).toLocaleString('pt-BR', {
                          dateStyle: 'short',
                          timeStyle: 'short'
                        })}
                      </Text>
                    </Flex>
                    <RelatorioPreview conteudo={rel?.conteudo as string} />
                  </Box>
                ))}
              </Box>
            </>
          )}
          {/* Seção de Logs de Atividades */}
          <Text fontWeight="bold" mb={2} borderBottomWidth={1} borderColor="gray.100">
            Histórico de atividades:
          </Text>

          {/* Filtro de Data */}
          {availableDates.length > 0 && (
            <Box mb={4} p={3} bg="gray.50" borderRadius={6}>
              <HStack gap={4} align="center">
                <Text fontSize="sm" fontWeight="medium" minW="fit-content">
                  Filtrar por data:
                </Text>
                <Box minW={'200px'}>
                  <CustomSelect
                    placeholder="Selecione uma data"
                    options={[
                      { label: 'Todas as datas', value: '' },
                      ...availableDates.map(date => ({
                        label: date,
                        value: date
                      }))
                    ]}
                    value={selectedDate ? [selectedDate] : ['']}
                    onValueChange={handleDateChange}
                    portalled={false}
                  />
                </Box>
              </HStack>
            </Box>
          )}

          <Box p={4} bg="white" borderRadius={8} boxShadow="sm">
            {filteredLogs && filteredLogs.length > 0 ? (
              <Stack gap={3}>
                {filteredLogs.map((log) => (
                  <Box
                    key={log.id}
                    p={4}
                    border="1px solid"
                    borderColor="gray.200"
                    borderRadius={6}
                    _hover={{ bg: 'gray.50' }}
                  >
                    <Flex align="center" justify="space-between" mb={2}>
                      <Flex align="center" gap={2}>
                        <Text fontSize="lg">{getEntidadeTipoIcon(log.entidade_tipo)}</Text>
                        <Text
                          fontSize="sm"
                          fontWeight="bold"
                          color={getAcaoColor(log.acao)}
                          textTransform="uppercase"
                        >
                          {log.acao}
                        </Text>
                        <Text fontSize="sm" color="gray.600">
                          {log.entidade_tipo}
                        </Text>
                      </Flex>
                      <Text fontSize="xs" color="gray.500">
                        {new Date(log.data_acao).toLocaleString('pt-BR', {
                          dateStyle: 'short',
                          timeStyle: 'short'
                        })}
                      </Text>
                    </Flex>

                    <Text fontSize="sm" mb={2}>
                      {log.descricao}
                    </Text>
                  </Box>
                ))}

                {logs && logs.total > 0 && (
                  <Box textAlign="center" pt={4} borderTop="1px solid" borderColor="gray.200">
                    <Text fontSize="sm" color="gray.600">
                      {selectedDate ? (
                        <>Mostrando {filteredLogs.length} atividades para {selectedDate}</>
                      ) : (
                        <>Mostrando {filteredLogs.length} de {logs.total} atividades</>
                      )}
                    </Text>
                  </Box>
                )}
              </Stack>
            ) : (
              <Text color="gray.500">Nenhuma atividade registrada para este funcionário.</Text>
            )}
          </Box>
        </>
      )}
    </Box>
  )
}

export default VisualizarRelatorioPage
