'use client';
import { Box, Button, Field, Flex, Image, Input, Text, Tabs, Link } from '@chakra-ui/react';
import { useRouter } from 'next/navigation';
import { LuUser, LuSquareCheck } from 'react-icons/lu';

export default function Login() {
  const router = useRouter();
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
        <Tabs.Root defaultValue="login" w="100%">
          <Tabs.List bg="gray.100" gap="2" justifyContent="center" borderRadius="md" mb={2}>
            <Tabs.Trigger value="login" p={3} fontWeight="bold" color="#242270">
              <LuUser  /> Entrar
            </Tabs.Trigger>
            <Tabs.Trigger value="register" p={3} fontWeight="bold" color="#242270">
              <LuSquareCheck  /> Cadastrar
            </Tabs.Trigger>
            <Tabs.Indicator rounded="l2" />
          </Tabs.List>
          <Tabs.Content
            value="login"
            p={0}
            style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem', marginTop: '1rem' }}
          >
            <Field.Root required>
              <Field.Label fontSize="md" color="#242270">
                E-mail <Field.RequiredIndicator />
              </Field.Label>
              <Input
                placeholder="exemplo@exemplo.com"
                backgroundColor="#f0f0f0"
                type="text"
                padding={3}
                borderRadius="md"
                fontSize="md"
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
              />
            </Field.Root>
            <Flex w="100%" justify="flex-end">
              <Link href="#">
                <Text fontSize="sm" color="#4A90E2" textAlign="right" _hover={{ textDecoration: 'underline' }}>
                  Esqueceu sua senha?
                </Text>
              </Link>
            </Flex>
            <Button
              type="submit"
              bg="#242270"
              color="#4A90E2"
              fontSize="lg"
              borderRadius="md"
              fontWeight="bold"
              py={6}
              mt={2}
              _hover={{ bg: '#4A90E2', color: 'white', boxShadow: 'md' }}
              transition="all 0.2s"
              onClick={() => router.push('/home')}
            >
              Entrar
            </Button>
          </Tabs.Content>
          <Tabs.Content
            value="register"
            p={0}
            style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem', marginTop: '1rem' }}
          >
            <Field.Root required>
              <Field.Label fontSize="md" color="#242270">
                Nome <Field.RequiredIndicator />
              </Field.Label>
              <Input
                placeholder="Ex: Maria João Silva"
                backgroundColor="#f0f0f0"
                type="text"
                padding={3}
                borderRadius="md"
                fontSize="md"
              />
            </Field.Root>
            <Field.Root required>
              <Field.Label fontSize="md" color="#242270">
                E-mail <Field.RequiredIndicator />
              </Field.Label>
              <Input
                placeholder="exemplo@exemplo.com"
                backgroundColor="#f0f0f0"
                type="text"
                padding={3}
                borderRadius="md"
                fontSize="md"
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
              />
            </Field.Root>
            <Button
              type="submit"
              bg="#242270"
              color="#4A90E2"
              fontSize="lg"
              borderRadius="md"
              fontWeight="bold"
              py={6}
              mt={2}
              _hover={{ bg: '#4A90E2', color: 'white', boxShadow: 'md' }}
              transition="all 0.2s"
              onClick={() => router.push('/home')}
            >
              Cadastrar
            </Button>
          </Tabs.Content>
        </Tabs.Root>
      </Box>
      <Flex
        display={{ base: 'none', md: 'flex' }}
        align="center"
        justify="center"
        h="100vh"
        w={{ base: '100%', md: '45%' }}
        bg="white"
        // boxShadow="2xl"
        ml={2}
      >
        <Image src="/images/advogado.avif" alt="Banner Login/Register page" maxH="90vh" objectFit="cover" />
      </Flex>
    </Flex>
  );
}
