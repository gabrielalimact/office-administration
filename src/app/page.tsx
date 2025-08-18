'use client'
import { Box, Button, Field, Flex, Image, Input, Text, Tabs, Link } from "@chakra-ui/react";
import { useRouter } from 'next/navigation'
import { LuUser, LuSquareCheck } from "react-icons/lu";

export default function Login() {
  const router = useRouter();
  return (
    <Flex
      style={{
        padding: "0 12px",
        alignItems: "center",
        justifyContent: "space-between",
        height: "100vh",
        width: "100%",
        gap: '2rem',
        color: 'white',
        background: "linear-gradient(209deg,rgba(36, 34, 112, 1) 0%, rgba(51, 51, 143, 1) 54%, rgba(207, 249, 255, 1) 100%)",
      }}
    >
      <Box width={{ base: "100%", md: "55%" }} paddingLeft={{ base: 0, md: 10 }}>
        <Flex style={{
          flexDirection: 'column',
          justifyContent: 'space-between',
          alignItems: 'center',
          marginBottom: '20px',
        }}
        >
          <Image src='/images/balanca.svg' alt="Logo"  
            width={50}
            height={50}
          />
          <Text fontSize="xl" fontWeight='bold'>
            Diego Oliveira Nascimento
          </Text>
          <Text fontSize="lg">
            Advocacia & Consultoria
          </Text>
        </Flex>
        
        <Flex style={{
          minHeight: '70vh',
          flexDirection: 'column',
          backgroundColor: 'rgba(247, 247, 247, 0.99)',
          padding: '20px',
          borderRadius: '8px',
          color: 'black',
          alignItems: 'center',
          gap: '1rem',
        }}>
          <Text fontSize="4xl" fontWeight="bold">
            Sistema de Administração
          </Text>
          <Text>
            Este é um sistema de administração para gerenciar processos jurídicos.
          </Text>
         
          <Flex 
            flexDir='column'
            w='100%'
          >
            <Tabs.Root defaultValue="login" >
              <Tabs.List bg="bg.muted" gap="2rem" justifyContent="center">
                <Tabs.Trigger value="login" p="2">
                  <LuUser />
                  Entrar
                </Tabs.Trigger>

                <Tabs.Trigger value="register" p="2">
                  <LuSquareCheck />
                  Cadastrar
                </Tabs.Trigger>
              <Tabs.Indicator rounded="l2" />
            </Tabs.List>
            <Tabs.Content value="login" p="5" style={{
              display: 'flex',
              flexDirection: 'column',
              gap: '2rem',
              marginTop: '1rem',
            }}>
              <Field.Root required>
                <Field.Label fontSize="lg">
                  E-mail <Field.RequiredIndicator />
                </Field.Label>
                <Input placeholder="exemplo@exemplo.com" backgroundColor="#f0f0f0" type="text" padding={2}/>
              </Field.Root>
              
              <Field.Root required>
                <Field.Label fontSize="lg">
                  Senha <Field.RequiredIndicator />
                </Field.Label>
                <Input placeholder="Senha" type="password" backgroundColor="#f0f0f0" padding={2}/>
              </Field.Root>
              <Link href="#">
                <Text fontSize="sm" color="blue.500" textAlign="right">
                  Esqueceu sua senha?
                </Text>
              </Link>
              <Button
                type="submit"
                backgroundColor="#4A90E2"
                fontSize="lg"
                onClick={() => router.push('/home')}
              >
                Entrar
              </Button>

            </Tabs.Content>
            <Tabs.Content value="register" p="5" style={{
              display: 'flex',
              flexDirection: 'column',
              gap: '2rem',
              marginTop: '1rem',
            }}>
              <Field.Root required>
                <Field.Label fontSize="lg">
                  Nome <Field.RequiredIndicator />
                </Field.Label>
                <Input placeholder="Ex: Maria João Silva" backgroundColor="#f0f0f0" type="text" padding={2}/>
              </Field.Root>
              <Field.Root required>
                <Field.Label fontSize="lg">
                  E-mail <Field.RequiredIndicator />
                </Field.Label>
                <Input placeholder="exemplo@exemplo.com" backgroundColor="#f0f0f0" type="text" padding={2}/>
              </Field.Root>
              
              <Field.Root required>
                <Field.Label fontSize="lg">
                  Senha <Field.RequiredIndicator />
                </Field.Label>
                <Input placeholder="Senha" type="password" backgroundColor="#f0f0f0" padding={2}/>
              </Field.Root>
              <Button
                type="submit"
                backgroundColor="#4A90E2"
                fontSize="lg"
                onClick={() => router.push('/home')}
              >
                Cadastrar
              </Button>
            </Tabs.Content>
          </Tabs.Root>  


            
          </Flex>
        </Flex>
      </Box>
      
      <Flex
        style={{
          padding: '10px',
          borderRadius: '8px',
          height: '98vh',
          backgroundColor: 'white',
          justifyContent: 'center',
          alignItems: 'center',
          width: '45%',
        }}
        display={{ base: "none", md: "flex" }}
      >
        <Image
          src="/images/advogado.avif"
          alt="Banner Login/Register page"
        />
      </Flex>
    </Flex>
  );
}
