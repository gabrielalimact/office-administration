'use client';
import {
  Box,
  Button,
  ButtonGroup,
  Flex,
  IconButton,
  Input,
  InputGroup,
  Pagination,
  Table,
  Text,
} from '@chakra-ui/react';
import { LuChevronLeft, LuChevronRight } from 'react-icons/lu';
import { MdPersonAdd } from 'react-icons/md';
import { useState } from 'react';
import { IoEyeOutline, IoSearchOutline } from 'react-icons/io5';
import { useRouter } from 'next/navigation';
import { funcionariosMock } from '@/mocks/funcionarios';

export interface IFuncionarios {
  id: number;
  nome: string;
  cargo: string;
  relatorios: {
    id: number;
    tipoProcesso: string;
    descricao: string;
    status: string;
    feitoEm: string;
  }[];
}


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

const FuncionariosRelatoriosPage = () => {
  const router = useRouter();
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
    <Box p={6} bg="#f4f8fb" minH="100vh" margin="0 auto">
      <Text fontSize="2xl" fontWeight="bold" mb={4}>
        Funcionários
      </Text>
      <Flex gap="1rem">
        <InputGroup
          endElement={
            <IconButton variant="ghost" aria-label="Buscar">
              <IoSearchOutline />
            </IconButton>
          }
        >
          <Input placeholder="Buscar funcionário..." p={5} borderRadius="50px" />
        </InputGroup>
        <Flex justifyContent="flex-end">
          <Button
            variant="surface"
            size="sm"
            p="20px 10px"
            borderRadius="50px"
            backgroundColor="var(--darkblue)"
            color="white"
            fontWeight="bold"
            style={{ display: 'flex', alignItems: 'center', gap: 8 }}
            onClick={() => router.push('/home/adicionar-funcionario')}
          >
            <MdPersonAdd style={{ marginRight: 6 }} /> Adicionar Funcionário
          </Button>
        </Flex>
      </Flex>

      <Table.Root size="sm" variant="outline" mb={2} mt={4} borderRadius="8px">
        <Table.Header height="50px" bgColor="var(--primary)">
          <Table.Row>
            <Table.ColumnHeader color="white" fontSize="md" fontWeight="bold" padding="0 20px">
              Funcionário
            </Table.ColumnHeader>
            <Table.ColumnHeader color="white" fontSize="md" fontWeight="bold">
              Cargo
            </Table.ColumnHeader>
            <Table.ColumnHeader
              color="white"
              fontSize="md"
              fontWeight="bold"
              textAlign="end"
              padding="0 20px"
            >
              Ver relatório de atividade
            </Table.ColumnHeader>
          </Table.Row>
        </Table.Header>
        <Table.Body>
          {funcionariosMock.map((item) => (
            <Table.Row height="50px" key={item.id} _hover={{ bgColor: 'var(--hover)' }}>
              <Table.Cell padding="0 20px">{item.nome}</Table.Cell>
              <Table.Cell>{item.cargo}</Table.Cell>
              <Table.Cell padding="0 20px" textAlign="end">
                <IconButton variant="ghost" aria-label="Ver relatório">
                  <IoEyeOutline />
                </IconButton>
              </Table.Cell>
            </Table.Row>
          ))}
        </Table.Body>
      </Table.Root>

      <Pagination.Root
        count={funcionariosMock.length * 5}
        pageSize={10}
        page={1}
        display="flex"
        justifyContent="flex-end"
      >
        <ButtonGroup variant="ghost" size="sm" wrap="wrap">
          <Pagination.PrevTrigger asChild>
            <IconButton>
              <LuChevronLeft />
            </IconButton>
          </Pagination.PrevTrigger>

          <Pagination.Items
            render={(page) => (
              <IconButton variant={{ base: 'ghost', _selected: 'outline' }}>
                {page.value}
              </IconButton>
            )}
          />

          <Pagination.NextTrigger asChild>
            <IconButton>
              <LuChevronRight />
            </IconButton>
          </Pagination.NextTrigger>
        </ButtonGroup>
      </Pagination.Root>
    </Box>
  );
};

export default FuncionariosRelatoriosPage;
