'use client'
import { useUserContext } from '@/components/UserContext'
import { cadastrarNovoUsuario, IUsuario } from '@/services/usuario-service'
import { Box, Button, Flex, Input, Text } from '@chakra-ui/react'
import { useRouter } from 'next/navigation'
import { useEffect, useState } from 'react'
import { useBreadcrumb } from '@/components/BreadcrumbContext'
import Breadcrumb from '@/components/Breadcrumb'
import maskCPF from '../../../utils/maskCPF'

const cargos = [
  {
    label: 'socio',
    nome: 'Sócio',
    descricao: 'Acesso total ao sistema, pode gerenciar todos os aspectos do escritório.',
  },
  {
    label: 'funcionario',
    nome: 'Funcionário',
    descricao: 'Acesso aos processos e clientes, pode cadastrar, editar e remover.',
  },
]

export default function AdicionarFuncionarioPage() {
  const router = useRouter()
  const [nome, setNome] = useState('')
  const [email, setEmail] = useState('')
  const [cpf, setCpf] = useState('')
  const [senha, setSenha] = useState('')
  const [cargoSelecionado, setCargoSelecionado] = useState(cargos[0].label)
  const { user } = useUserContext()
  const { setBreadcrumbs } = useBreadcrumb()

  useEffect(() => {
    setBreadcrumbs([
      { label: 'Início', path: '/home' },
      { label: 'Funcionários', path: '/funcionarios-relatorios' },
      { label: 'Adicionar Funcionário', path: '/adicionar-funcionario' },
    ])
  }, [setBreadcrumbs])

  const handleCPF = (e: React.ChangeEvent<HTMLInputElement>) => {
    const raw = e.target.value.replace(/\D/g, '')
    if (raw.length <= 11) {
      setCpf(raw)
    }
  }
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    cadastrarNovoUsuario({
      nome,
      email,
      cpf: cpf.replace(/\D/g, ''),
      senha,
      cargo: cargoSelecionado,
    } as IUsuario)
      .then(() => {
        alert('Funcionário cadastrado com sucesso!')
        router.push('/funcionarios-relatorios')
      })
      .catch((error) => {
        console.error('Erro ao cadastrar funcionário:', error)
        alert('Erro ao cadastrar funcionário. Tente novamente.')
      })
    setNome('')
    setEmail('')
    setCpf('')
    setSenha('')
    setCargoSelecionado(cargos[0].label)
  }

  useEffect(() => {
    if (user && user.cargo !== 'socio') {
      router.push('/home')
    }
  }, [user, router])
  return (
    <Box mx="auto" p={8} bg="white">
      <Breadcrumb />
      <Flex align="center" gap={3} mb={6}>
        <Text fontSize="2xl" fontWeight="bold">
          Adicionar Funcionário
        </Text>
      </Flex>
      <form onSubmit={handleSubmit} style={{ minWidth: 400 }}>
        <Flex direction={{ base: 'column', md: 'row' }} gap={6}>
          <Flex flex={1} direction="column" gap={4}>
            <Box mb={2}>
              <label style={{ fontWeight: 500, marginBottom: 4, display: 'block' }}>
                Nome completo *
              </label>
              <Input
                p={3}
                value={nome}
                onChange={(e) => setNome(e.target.value)}
                placeholder="Nome completo"
                required
              />
            </Box>
            <Box mb={2}>
              <label style={{ fontWeight: 500, marginBottom: 4, display: 'block' }}>Email *</label>
              <Input
                p={3}
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Email"
                required
              />
            </Box>
            <Box mb={2}>
              <label style={{ fontWeight: 500, marginBottom: 4, display: 'block' }}>CPF *</label>
              <Input
                p={3}
                type="text"
                value={maskCPF(cpf)}
                onChange={(e) => handleCPF(e)}
                placeholder="CPF"
                required
              />
            </Box>
            <Box mb={2}>
              <label style={{ fontWeight: 500, marginBottom: 4, display: 'block' }}>Senha *</label>
              <Input
                p={3}
                type="text"
                value={senha}
                onChange={(e) => setSenha(e.target.value)}
                placeholder="Senha"
                required
              />
            </Box>
          </Flex>
          <Box flex={1} minW={220} ml={{ md: 2 }}>
            <label style={{ fontWeight: 500, marginBottom: 8, display: 'block' }}>Cargo</label>
            <Flex direction="column" gap={3}>
              {cargos.map((cargo) => (
                <Box
                  key={cargo.label}
                  onClick={() => setCargoSelecionado(cargo.label)}
                  bg={cargoSelecionado === cargo.label ? 'var(--primary)' : '#f7f7fa'}
                  color={cargoSelecionado === cargo.label ? 'white' : 'black'}
                  borderRadius={8}
                  p={3}
                  mb={1}
                  textAlign="left"
                  fontWeight={cargoSelecionado === cargo.label ? 700 : 500}
                  border={
                    cargoSelecionado === cargo.label
                      ? '2px solid var(--primary)'
                      : '1px solid #e0e0e0'
                  }
                  cursor="pointer"
                  transition="all 0.2s"
                >
                  <div style={{ fontWeight: 600 }}>{cargo.nome}</div>
                  <div
                    style={{
                      fontSize: 13,
                      color: cargoSelecionado === cargo.label ? 'white' : '#555',
                    }}
                  >
                    {cargo.descricao}
                  </div>
                </Box>
              ))}
            </Flex>
          </Box>
        </Flex>
        <Button
          type="submit"
          style={{ backgroundColor: 'var(--primary)', fontWeight: 700, width: '100%' }}
          mt={8}
        >
          Cadastrar
        </Button>
      </form>
    </Box>
  )
}
