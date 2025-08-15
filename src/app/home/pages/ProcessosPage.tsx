import { Box, ButtonGroup, IconButton, Input, InputGroup, Pagination, Table } from '@chakra-ui/react';
import { IoEyeOutline, IoSearchOutline } from 'react-icons/io5';
import { LuChevronLeft, LuChevronRight } from 'react-icons/lu';

type IProcessos = {
  id: number;
  cliente: string;
  tipoProcesso: string;
  feitoPor: string;
  feitoEm: string;
};

const processosMock: IProcessos[] = [
  { id: 1, cliente: "Lucas Andrade", tipoProcesso: "Cível", feitoPor: "Marina Lopes", feitoEm: "2024-01-05" },
  { id: 2, cliente: "Gabriela Torres", tipoProcesso: "Trabalhista", feitoPor: "João Pedro", feitoEm: "2024-01-18" },
  { id: 3, cliente: "Eduardo Silva", tipoProcesso: "Penal", feitoPor: "Ana Paula", feitoEm: "2024-02-10" },
  { id: 4, cliente: "Renata Souza", tipoProcesso: "Tributário", feitoPor: "Carlos Lima", feitoEm: "2024-02-25" },
  { id: 5, cliente: "Thiago Costa", tipoProcesso: "Família", feitoPor: "Fernanda Dias", feitoEm: "2024-03-12" },
  { id: 6, cliente: "Amanda Martins", tipoProcesso: "Previdenciário", feitoPor: "Ricardo Alves", feitoEm: "2024-03-28" },
  { id: 7, cliente: "Felipe Rocha", tipoProcesso: "Ambiental", feitoPor: "Juliana Ramos", feitoEm: "2024-04-15" },
  { id: 8, cliente: "Patrícia Fernandes", tipoProcesso: "Empresarial", feitoPor: "Bruno Cardoso", feitoEm: "2024-04-30" },
  { id: 9, cliente: "Marcos Oliveira", tipoProcesso: "Consumidor", feitoPor: "Larissa Souza", feitoEm: "2024-05-09" },
  { id: 10, cliente: "Beatriz Lima", tipoProcesso: "Eleitoral", feitoPor: "Paulo Henrique", feitoEm: "2024-05-22" },
];
const ProcessosPage = () => {
  return (
    <Box>
      <InputGroup endElement={<IconButton variant="ghost" aria-label="Buscar"><IoSearchOutline /></IconButton>}>
        <Input placeholder="Buscar processo..." p={5}/>
      </InputGroup>

      <Table.Root size="sm" variant="outline" mb={2} mt={4}>
        <Table.Header height="50px" bgColor="var(--primary)">
          <Table.Row>
            <Table.ColumnHeader color="white" fontSize="md" fontWeight="bold" paddingLeft={4}>Nome do cliente</Table.ColumnHeader>
            <Table.ColumnHeader color="white" fontSize="md" fontWeight="bold">Tipo de processo</Table.ColumnHeader>
            <Table.ColumnHeader color="white" fontSize="md" fontWeight="bold">Data de cadastro</Table.ColumnHeader>
            <Table.ColumnHeader color="white" fontSize="md" fontWeight="bold">Feito por</Table.ColumnHeader>
            <Table.ColumnHeader w='fit-content' color="white" fontSize="md" fontWeight="bold" textAlign="end" paddingRight={4} />
          </Table.Row>
        </Table.Header>
        <Table.Body>
          {processosMock.map((item) => (
            <Table.Row height="50px" key={item.id} _hover={{ bgColor: "var(--hover)" }}>
              <Table.Cell paddingLeft={4}>{item.cliente}</Table.Cell>
              <Table.Cell>{item.tipoProcesso}</Table.Cell>
              <Table.Cell>{item.feitoEm}</Table.Cell>
              <Table.Cell>{item.feitoPor}</Table.Cell>
              <Table.Cell paddingRight={4} textAlign="end">
                <IconButton variant="ghost" aria-label="Ver processo">
                  <IoEyeOutline />
                </IconButton>
              </Table.Cell>
            </Table.Row>
          ))}
        </Table.Body>
      </Table.Root>

      <Pagination.Root count={processosMock.length*5} pageSize={10} page={1} display="flex" 
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

export default ProcessosPage;
