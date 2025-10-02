'use client';
import { Box, Button, Field, Flex, Image, Input, Text, Link } from '@chakra-ui/react';
import { useRouter } from 'next/navigation';
import { useLoading } from '@/components/LoadingContext';
import { useUserContext } from '@/components/UserContext';
import { login } from '@/services/auth-service';
import { useState } from 'react';

export default function Login() {
  const router = useRouter();
  const { setLoading } = useLoading();
  const { setUser } = useUserContext();
  const [cpf, setCpf] = useState('');
  const [senha, setSenha] = useState('');

  const handlePush = (path: string) => {
    setLoading(true);
    login(cpf, senha)
      .then((res) => {
        setUser({
          id: res.id,
          nome: res.nome,
          cpf: res.cpf,
          cargo: res.cargo,
          avatar: '/next.svg',
        });
        router.push(path);
      })
      .catch((error) => {
        alert('Falha no login. Verifique suas credenciais e tente novamente.');
      })
      .finally(() => {
        setLoading(false);
      });
  };
  return (
    <Flex
      minH="100vh"
      w="100%"
      align="center"
      justify="center"
      bgGradient="linear(209deg, #242270 0%, #33338F 54%, #cff9ff 100%)"
      px={{ base: 2, md: 8 }}
      py={0}
      gap={{ base: 0, md: 8 }}
      direction={{ base: 'column', md: 'row' }}
    >
      <Box
        w={{ base: '100%', md: '480px' }}
        maxW="480px"
        mx="auto"
        bg="white"
        borderRadius="2xl"
        boxShadow="2xl"
        p={{ base: 4, md: 8 }}
        display="flex"
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
        <Text fontSize="2xl" fontWeight="bold" color="#242270" textAlign="center">
          Sistema de Administração
        </Text>
        <Text color="gray.600" textAlign="center" mb={2}>
          Gerencie processos jurídicos de forma simples e segura.
        </Text>
        <Field.Root required>
          <Field.Label fontSize="md" color="#242270">
            CPF <Field.RequiredIndicator />
          </Field.Label>
          <Input
            placeholder="000.000.000-00"
            backgroundColor="#f0f0f0"
            type="text"
            padding={3}
            borderRadius="md"
            fontSize="md"
            value={cpf}
            onChange={(e) => setCpf(e.target.value)}
          />
        </Field.Root>
        <Field.Root required>
          <Field.Label fontSize="md" color="#242270">
            Senha <Field.RequiredIndicator />
          </Field.Label>
          <Input
            placeholder="Senha"
            type="password"
            backgroundColor="#f0f0f0"
            padding={3}
            borderRadius="md"
            fontSize="md"
            value={senha}
            onChange={(e) => setSenha(e.target.value)}
          />
        </Field.Root>
        <Flex w="100%" justify="flex-end">
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
        w={{ base: '100%', md: '45%' }}
        bg="white"
        ml={2}
      >
        <Image
          src="/images/advogado.avif"
          alt="Banner Login/Register page"
          maxH="90vh"
          objectFit="cover"
        />
      </Flex>
    </Flex>
  );
}
