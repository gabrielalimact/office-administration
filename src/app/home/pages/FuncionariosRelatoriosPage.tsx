import { Box, Button, ButtonGroup, Flex, IconButton, Input, InputGroup, Pagination, Table, Text } from '@chakra-ui/react';
import { LuChevronLeft, LuChevronRight } from 'react-icons/lu';
import { MdPersonAdd } from "react-icons/md";
import { IoEyeOutline, IoSearchOutline } from "react-icons/io5";

interface IFuncionarios {
  id: number;
  nome: string;
  cargo: string;
  relatorios: {
    id: number;
    tipoProcesso: string;
    descricao: string;
    feitoEm: string;
  };
}

const funcionariosMock: IFuncionarios[] = [
  {
    id: 1,
    nome: "Ana Paula Souza",
    cargo: "Advogada Sênior",
    relatorios: {
      id: 101,
      tipoProcesso: "Trabalhista",
      descricao: "Revisão de contrato de trabalho.",
      feitoEm: "2024-05-10"
    }
  },
  {
    id: 2,
    nome: "Carlos Henrique Lima",
    cargo: "Advogado Júnior",
    relatorios: {
      id: 102,
      tipoProcesso: "Cível",
      descricao: "Elaboração de petição inicial.",
      feitoEm: "2024-06-01"
    }
  },
  {
    id: 3,
    nome: "Fernanda Dias",
    cargo: "Estagiária",
    relatorios: {
      id: 103,
      tipoProcesso: "Família",
      descricao: "Pesquisa jurisprudencial.",
      feitoEm: "2024-05-22"
    }
  },
  {
    id: 4,
    nome: "João Pedro Martins",
    cargo: "Advogado Pleno",
    relatorios: {
      id: 104,
      tipoProcesso: "Tributário",
      descricao: "Análise de autos de infração.",
      feitoEm: "2024-04-30"
    }
  },
  {
    id: 5,
    nome: "Mariana Alves",
    cargo: "Assistente Jurídica",
    relatorios: {
      id: 105,
      tipoProcesso: "Empresarial",
      descricao: "Abertura de empresa.",
      feitoEm: "2024-06-05"
    }
  },
  {
    id: 6,
    nome: "Ricardo Gomes",
    cargo: "Advogado Sênior",
    relatorios: {
      id: 106,
      tipoProcesso: "Penal",
      descricao: "Defesa em audiência.",
      feitoEm: "2024-05-15"
    }
  },
  {
    id: 7,
    nome: "Beatriz Ferreira",
    cargo: "Advogada Júnior",
    relatorios: {
      id: 107,
      tipoProcesso: "Consumidor",
      descricao: "Atendimento ao cliente.",
      feitoEm: "2024-06-03"
    }
  },
  {
    id: 8,
    nome: "Lucas Silva",
    cargo: "Estagiário",
    relatorios: {
      id: 108,
      tipoProcesso: "Ambiental",
      descricao: "Levantamento de documentos.",
      feitoEm: "2024-05-28"
    }
  },
  {
    id: 9,
    nome: "Patrícia Ramos",
    cargo: "Advogada Plena",
    relatorios: {
      id: 109,
      tipoProcesso: "Imobiliário",
      descricao: "Análise de contrato de locação.",
      feitoEm: "2024-06-07"
    }
  },
  {
    id: 10,
    nome: "Eduardo Castro",
    cargo: "Assistente Jurídico",
    relatorios: {
      id: 110,
      tipoProcesso: "Previdenciário",
      descricao: "Revisão de benefícios.",
      feitoEm: "2024-05-18"
    }
  }
];
const FuncionariosRelatoriosPage = () => {
  return (
    <Box>
      <Flex gap="1rem">
        <InputGroup endElement={<IconButton variant="ghost" aria-label="Buscar"><IoSearchOutline /></IconButton>}>
          <Input placeholder="Buscar funcionário..." p={5}/>
        </InputGroup>
      
        <Flex justifyContent="flex-end">
          <Button variant="surface" size="sm" p="20px 10px" backgroundColor="var(--darkblue)" color="white">
            <MdPersonAdd /> Adicionar Funcionário
          </Button>
        </Flex>
      </Flex>

      <Table.Root size="sm" variant="outline" mb={2} mt={4}>
        <Table.Header height="50px" bgColor="var(--primary)">
          <Table.Row>
            <Table.ColumnHeader color="white" fontSize="md" fontWeight="bold" padding="0 20px">Funcionário</Table.ColumnHeader>
            <Table.ColumnHeader color="white" fontSize="md" fontWeight="bold">Cargo</Table.ColumnHeader>
            <Table.ColumnHeader color="white" fontSize="md" fontWeight="bold" textAlign="end" padding="0 20px">Ver relatório de atividade</Table.ColumnHeader>
          </Table.Row>
        </Table.Header>
        <Table.Body>
          {funcionariosMock.map((item) => (
            <Table.Row height="50px" key={item.id} _hover={{ bgColor: "var(--hover)" }}>
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

      <Pagination.Root count={funcionariosMock.length*5} pageSize={10} page={1} display="flex" 
     justifyContent='flex-end'>
        <ButtonGroup variant="ghost" size="sm" wrap="wrap">
          <Pagination.PrevTrigger asChild>
            <IconButton>
              <LuChevronLeft />
            </IconButton>
          </Pagination.PrevTrigger>

          <Pagination.Items
            render={(page) => (
              <IconButton variant={{ base: "ghost", _selected: "outline" }}>
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
  )
};

export default FuncionariosRelatoriosPage;
