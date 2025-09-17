'use client';
import { Box, Button, Flex, Input, Text } from '@chakra-ui/react';
import { MdPersonAdd } from 'react-icons/md';
import { useState } from 'react';

const cargos = [
  {
    nome: 'Sócio',
    descricao: 'Acesso total ao sistema, pode gerenciar todos os aspectos do escritório.',
  },
  {
    nome: 'Advogado Sênior',
    descricao: 'Acesso total ao sistema, pode cadastrar, editar e remover processos.',
  },
  {
    nome: 'Advogado Pleno',
    descricao: 'Pode cadastrar e editar processos, enviar relatórios.',
  },
  {
    nome: 'Advogado Júnior',
    descricao: 'Pode cadastrar processos e enviar relatórios.',
  },
  {
    nome: 'Assistente Jurídico',
    descricao: 'Pode visualizar processos e relatórios.',
  },
  {
    nome: 'Estagiário',
    descricao: 'Pode visualizar processos.',
  },
];

export default function AdicionarFuncionarioPage() {
  const [nome, setNome] = useState('');
  const [email, setEmail] = useState('');
  const [senha, setSenha] = useState('');
  const [cargoSelecionado, setCargoSelecionado] = useState(cargos[0].nome);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setNome('');
    setEmail('');
    setSenha('');
    setCargoSelecionado(cargos[0].nome);
  };

  return (
    <Box mx="auto" p={8} bg="white">
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
                  key={cargo.nome}
                  as="button"
                  onClick={() => setCargoSelecionado(cargo.nome)}
                  bg={cargoSelecionado === cargo.nome ? 'var(--darkblue)' : '#f7f7fa'}
                  color={cargoSelecionado === cargo.nome ? 'white' : 'black'}
                  borderRadius={8}
                  p={3}
                  mb={1}
                  textAlign="left"
                  fontWeight={cargoSelecionado === cargo.nome ? 700 : 500}
                  border={
                    cargoSelecionado === cargo.nome
                      ? '2px solid var(--darkblue)'
                      : '1px solid #e0e0e0'
                  }
                  cursor="pointer"
                  transition="all 0.2s"
                >
                  <div style={{ fontWeight: 600 }}>{cargo.nome}</div>
                  <div
                    style={{
                      fontSize: 13,
                      color: cargoSelecionado === cargo.nome ? 'white' : '#555',
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
          style={{ backgroundColor: 'var(--darkblue)', fontWeight: 700, width: '100%' }}
          mt={8}
        >
          Cadastrar
        </Button>
      </form>
    </Box>
  );
}
