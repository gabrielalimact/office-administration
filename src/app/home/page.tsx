'use client'
import { Box, SimpleGrid, Text, Heading, Flex, Grid } from '@chakra-ui/react'
import { useEffect, useState } from 'react'
import { useBreadcrumb } from '@/components/BreadcrumbContext'
import Breadcrumb from '@/components/Breadcrumb'
import { getDashboardData } from '@/services/dashboard-service'
import { useUserContext } from '@/components/UserContext'
import { getFuncionariosEProcessos } from '@/services/usuario-service'
import { ProcessosPorFuncionario } from '../../../types/processos'
import { useRouter } from 'next/navigation'

const Home = () => {
  const { user } = useUserContext()
  const { setBreadcrumbs } = useBreadcrumb()
  const router = useRouter()
  const [mounted, setMounted] = useState(false)
  const [funcionarios, setFuncionarios] = useState<ProcessosPorFuncionario[]>([])
  const [totalProcessos, setTotalProcessos] = useState(0)
  const [processosArquivados, setProcessosArquivados] = useState(0)
  const [processosAtivos, setProcessosAtivos] = useState(0)
  const [processosPorBeneficio, setProcessosPorBeneficio] = useState<
    { beneficio: string; quantidade: number }[]
  >([])
  const [clientesComProcessosAtivos, setClientesComProcessosAtivos] = useState(0)

  useEffect(() => {
    setBreadcrumbs([{ label: 'Início', path: '/home' }])
    setMounted(true)
  }, [setBreadcrumbs])

  const fetchData = () => {
    getDashboardData().then((data) => {
      setTotalProcessos(data.totalProcessos)
      setProcessosArquivados(data.processosArquivados)
      setProcessosAtivos(data.processosAtivos)
      setProcessosPorBeneficio(data.processosPorBeneficio)
      setClientesComProcessosAtivos(data.clientesComProcessosAtivos)
    })

    getFuncionariosEProcessos().then((data) => {
      setFuncionarios(data)
    })
  }

  useEffect(() => {
    fetchData()
  }, [])

  const getPastelColor = (index: number) => {
    const pastelColors = [
      '#FFE5E5',
      '#E5F3FF',
      '#E5FFE5',
      '#FFF5E5',
      '#F0E5FF',
      '#E5FFF5',
      '#FFE5F5',
      '#F5E5FF',
      '#E5FFFF',
      '#FFFFE5'
    ]
    return pastelColors[index % pastelColors.length]
  }

  return (
    <Box p={8} bg="gray.50" minH="100vh">
      <Breadcrumb />

      <Box mb={8}>
        <Text mb={2} color="var(--primary)" fontSize={'24px'} fontWeight="bold">
          {mounted && user?.nome ? `Bem-vindo(a), ${user.nome}` : 'Bem-vindo(a)!'}
        </Text>
      </Box>

      <Box mb={8}>
        <Text fontSize="20px" mb={4}>
          Estatísticas Gerais
        </Text>
        <SimpleGrid columns={{ base: 1, sm: 2, lg: 4 }} gap={6}>
          <Box
            bg="white"
            borderRadius={5}
            p={6}
            border="1px solid"
            borderColor="gray.300"
            onClick={() => router.push('/processos?all=true')}
            cursor={'pointer'}
          >
            <Flex align="center" justify="space-between" mb={2}>
              <Text fontSize="sm" fontWeight="medium" color="gray.600">
                TOTAL DE PROCESSOS
              </Text>
              <Box w={3} h={3} bg="blue.400" borderRadius="full" />
            </Flex>
            <Text fontSize="3xl" fontWeight="bold" color="var(--primary)" mb={1}>
              {totalProcessos}
            </Text>
            <Text fontSize="sm" color="gray.500">
              Todos os processos cadastrados
            </Text>
          </Box>

          <Box
            bg="white"
            borderRadius={5}
            p={6}
            border="1px solid"
            borderColor="gray.300"
            onClick={() => router.push('/processos?arquivados=false')}
            cursor={'pointer'}
          >
            <Flex align="center" justify="space-between" mb={2}>
              <Text fontSize="sm" fontWeight="medium" color="gray.600">
                PROCESSOS ATIVOS
              </Text>
              <Box w={3} h={3} bg="green.400" borderRadius="full" />
            </Flex>
            <Text fontSize="3xl" fontWeight="bold" color="green.600" mb={1}>
              {processosAtivos}
            </Text>
            <Text fontSize="sm" color="gray.500">
              Processos em andamento
            </Text>
          </Box>

          <Box
            bg="white"
            borderRadius={5}
            p={6}
            border="1px solid"
            borderColor="gray.300"
            onClick={() => router.push('/processos?arquivados=true')}
            cursor={'pointer'}
          >
            <Flex align="center" justify="space-between" mb={2}>
              <Text fontSize="sm" fontWeight="medium" color="gray.600">
                PROCESSOS ARQUIVADOS
              </Text>
              <Box w={3} h={3} bg="orange.400" borderRadius="full" />
            </Flex>
            <Text fontSize="3xl" fontWeight="bold" color="orange.600" mb={1}>
              {processosArquivados}
            </Text>
            <Text fontSize="sm" color="gray.500">
              Processos finalizados
            </Text>
          </Box>

          <Box
            bg="white"
            borderRadius={5}
            p={6}
            border="1px solid"
            borderColor="gray.300"
            onClick={() => router.push('/clientes?ativos=true')}
            cursor={'pointer'}
          >
            <Flex align="center" justify="space-between" mb={2}>
              <Text fontSize="sm" fontWeight="medium" color="gray.600">
                TOTAL DE CLIENTES
              </Text>
              <Box w={3} h={3} bg="purple.400" borderRadius="full" />
            </Flex>
            <Text fontSize="3xl" fontWeight="bold" color="purple.600" mb={1}>
              {clientesComProcessosAtivos}
            </Text>
            <Text fontSize="sm" color="gray.500">
              Clientes com processos ativos
            </Text>
          </Box>
        </SimpleGrid>
      </Box>

      <Grid templateColumns={{ base: '1fr', xl: '1fr 1fr' }} gap={8}>
        <Box>
          <Box bg="white" borderRadius={5} p={6} border="1px solid" borderColor="gray.300">
            <Flex align="center" justify="space-between" mb={6}>
              <Heading size="md" color="var(--primary)">
                Processos por Tipo de Benefício
              </Heading>
              <Text fontSize="sm" color="gray.500">
                {processosPorBeneficio.length} tipos diferentes
              </Text>
            </Flex>
            <SimpleGrid columns={{ base: 1, sm: 2, md: 3 }} gap={4}>
              {processosPorBeneficio.map((item, index) => (
                <Box
                  key={item.beneficio}
                  bg={getPastelColor(index)}
                  borderRadius={6}
                  p={4}
                  border="1px solid"
                  borderColor="gray.300"
                  transition="all 0.2s"
                  _hover={{ transform: 'translateY(-2px)', boxShadow: 'md' }}
                  onClick={() =>
                    router.push('/processos?tipoProcesso=' + encodeURIComponent(item.beneficio))
                  }
                  cursor={'pointer'}
                >
                  <Text
                    fontSize="sm"
                    fontWeight="medium"
                    color="gray.700"
                    mb={2}
                    overflow="hidden"
                    textOverflow="ellipsis"
                    whiteSpace="nowrap"
                  >
                    {item.beneficio}
                  </Text>
                  <Text fontSize="2xl" fontWeight="bold" color="var(--primary)">
                    {item.quantidade}
                  </Text>
                </Box>
              ))}
            </SimpleGrid>
          </Box>
        </Box>

        <Box>
          <Box
            bg="white"
            borderRadius={5}
            p={6}
            border="1px solid"
            borderColor="gray.300"
            h="fit-content"
          >
            <Flex align="center" justify="space-between" mb={6}>
              <Heading size="md" color="var(--primary)">
                Distribuição por Funcionário
              </Heading>
              <Text fontSize="sm" color="gray.500">
                {funcionarios.length} funcionários
              </Text>
            </Flex>

            {funcionarios.length > 0 ? (
              <Box>
                {funcionarios.map((funcionario, index) => (
                  <Flex
                    key={funcionario.id}
                    align="center"
                    justify="space-between"
                    p={3}
                    borderRadius={6}
                    _hover={{ bg: 'gray.50', scale: 1.01 }}
                    borderBottom={index < funcionarios.length - 1 ? '1px solid' : 'none'}
                    borderColor="gray.100"
                    onClick={() => router.push('/visualizar-relatorio/' + funcionario.id)}
                    cursor={'pointer'}
                  >
                    <Box>
                      <Text fontWeight="medium" color="gray.800">
                        {funcionario.nome}
                      </Text>
                      <Text fontSize="sm" color="gray.500">
                        {funcionario.cargo}
                      </Text>
                    </Box>
                    <Box textAlign="right">
                      <Text fontSize="xl" fontWeight="bold" color="var(--primary)">
                        {funcionario.totalProcessos}
                      </Text>
                      <Text fontSize="xs" color="gray.500">
                        processos
                      </Text>
                    </Box>
                  </Flex>
                ))}
              </Box>
            ) : (
              <Box textAlign="center" py={8}>
                <Text color="gray.500" fontSize="sm">
                  Nenhum funcionário encontrado
                </Text>
              </Box>
            )}
          </Box>
        </Box>
      </Grid>
    </Box>
  )
}

export default Home
