'use client'
import {
  Box,
  Button,
  Field,
  Flex,
  Image,
  Input,
  Text,
  Link,
  IconButton,
  InputGroup,
} from '@chakra-ui/react'
import { useRouter } from 'next/navigation'
import { useLoading } from '@/components/LoadingContext'
import { useUserContext } from '@/components/UserContext'
import { login } from '@/services/auth-service'
import { useState } from 'react'
import { IoEyeOutline, IoEyeOffOutline } from 'react-icons/io5'
import maskCPF from '../../utils/maskCPF'
import { toaster } from '@/components/ui/toaster'

export default function Login() {
  const router = useRouter()
  const { setLoading } = useLoading()
  const { setUser } = useUserContext()
  const [cpf, setCpf] = useState('')
  const [senha, setSenha] = useState('')
  const [showPassword, setShowPassword] = useState(false)

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword)
  }
  const handleChangeCPF = (e: React.ChangeEvent<HTMLInputElement>) => {
    const raw = e.target.value.replace(/\D/g, '')
    if (raw.length <= 11) {
      setCpf(raw)
    }
  }

  const handleEnter = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      handlePush('/home')
    }
  }

  const handlePush = (path: string) => {
    setLoading(true)
    login(cpf, senha)
      .then((res) => {
        setUser({
          id: res.id,
          nome: res.nome,
          cpf: res.cpf,
          cargo: res.cargo,
          email: res.email,
          avatar: res.avatar ? res.avatar.url : '/next.svg',
        })
        router.push(path)
      })
      .catch(() => {
        toaster.create({
          title: 'Erro ao fazer login',
          description: 'CPF ou senha incorretos. Tente novamente.',
          type: 'error',
          duration: 3000,
        })
      })
      .finally(() => {
        setLoading(false)
      })
  }
  return (
    <Flex
      minH="100vh"
      w="100%"
      align="center"
      justify="center"
      py={0}
      direction={{ base: 'column', md: 'row' }}
    >
      <Box
        w={{ base: '100%', md: '50%' }}
        mx="auto"
        bg="whiteAlpha.900"
        display="flex"
        px={20}
        flexDirection="column"
        alignItems="center"
        justifyContent="center"
        gap={6}
      >
        <Flex direction="column" align="center" gap={1} mb={2}>
          <Image src="/images/balanca.svg" alt="Logo" width={50} height={50} mb={2} />
          <Text fontSize="2xl" fontWeight="bold" color="#242270">
            Diego Oliveira Nascimento
          </Text>
          <Text fontSize="md" color="#4A90E2" fontWeight="semibold">
            Advocacia & Consultoria
          </Text>
        </Flex>
        <Field.Root required>
          <Field.Label fontSize="md" color="#242270">
            CPF <Field.RequiredIndicator />
          </Field.Label>
          <Input
            placeholder="000.000.000-00"
            type="text"
            inputMode="numeric"
            backgroundColor="#ffffffff"
            padding={3}
            border={'1px solid #717171ff'}
            fontSize="md"
            value={maskCPF(cpf)}
            onChange={(e) => handleChangeCPF(e)}
            onKeyDown={(e) => handleEnter(e)}
          />
        </Field.Root>
        <Field.Root required>
          <Field.Label fontSize="md" color="#242270">
            Senha <Field.RequiredIndicator />
          </Field.Label>
          <InputGroup
            endElement={
              <IconButton
                variant="ghost"
                size="sm"
                onClick={togglePasswordVisibility}
                aria-label={showPassword ? 'Ocultar senha' : 'Mostrar senha'}
                _hover={{ bg: 'transparent' }}
              >
                {showPassword ? <IoEyeOffOutline /> : <IoEyeOutline />}
              </IconButton>
            }
          >
            <Input
              placeholder="Senha"
              type={showPassword ? 'text' : 'password'}
              backgroundColor="#ffffffff"
              padding={3}
              border={'1px solid #717171ff'}
              fontSize="md"
              value={senha}
              onChange={(e) => setSenha(e.target.value)}
              onKeyDown={(e) => handleEnter(e)}
            />
          </InputGroup>
        </Field.Root>
        <Flex justify="flex-end" w="100%">
          <Link href="#">
            <Text
              fontSize="sm"
              color="#4A90E2"
              textAlign="right"
              _hover={{ textDecoration: 'underline' }}
            >
              Esqueceu sua senha?
            </Text>
          </Link>
        </Flex>
        <Button
          type="submit"
          bg="#4A90E2"
          color="white"
          fontSize="lg"
          borderRadius="md"
          fontWeight="bold"
          py={6}
          mt={2}
          w={'100%'}
          _hover={{ bg: '#242270', boxShadow: 'md' }}
          transition="all 0.2s"
          onClick={() => handlePush('/home')}
        >
          Entrar
        </Button>
      </Box>
      <Flex
        display={{ base: 'none', md: 'flex' }}
        align="center"
        justify="center"
        h="100vh"
        w="50%"
      >
        <Image
          src="/images/blue-blue.jpg"
          alt="Banner Login/Register page"
          objectFit="cover"
          w="100%"
          h="100%"
        />
      </Flex>
    </Flex>
  )
}
