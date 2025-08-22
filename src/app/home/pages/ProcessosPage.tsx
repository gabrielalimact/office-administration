import { Box, ButtonGroup, IconButton, Input, InputGroup, Pagination, Table, Flex, Text } from '@chakra-ui/react';
import { IoEyeOutline, IoSearchOutline } from 'react-icons/io5';
import { LuChevronLeft, LuChevronRight } from 'react-icons/lu';
import { Modal } from '@/components/Modal';
import Link from 'next/link';

type IProcessosTable = {
  id: number;
  cliente: string;
  tipoProcesso: "LOAS/88" | "LOAS/87" | "PENSÃO DE MORTE URBANA OU RURAL" | "APOSENTADORIAS" | "AUXILIO DOENÇA" | string;
  feitoPor: string;
  feitoEm: string;
};

const processosMock: IProcessosTable[] = [
  { id: 1, cliente: "Lucas Andrade", tipoProcesso: "LOAS/88", feitoPor: "Marina Lopes", feitoEm: "2024-01-05" },
  { id: 2, cliente: "Gabriela Torres", tipoProcesso: "LOAS/87", feitoPor: "João Pedro", feitoEm: "2024-01-18" },
  { id: 3, cliente: "Eduardo Silva", tipoProcesso: "PENSÃO DE MORTE URBANA OU RURAL", feitoPor: "Ana Paula", feitoEm: "2024-02-10" },
  { id: 4, cliente: "Renata Souza", tipoProcesso: "APOSENTADORIAS", feitoPor: "Carlos Lima", feitoEm: "2024-02-25" },
  { id: 5, cliente: "Thiago Costa", tipoProcesso: "AUXILIO DOENÇA", feitoPor: "Fernanda Dias", feitoEm: "2024-03-12" },
  { id: 6, cliente: "Amanda Martins", tipoProcesso: "LOAS/88", feitoPor: "Ricardo Alves", feitoEm: "2024-03-28" },
  { id: 7, cliente: "Felipe Rocha", tipoProcesso: "LOAS/87", feitoPor: "Juliana Ramos", feitoEm: "2024-04-15" },
  { id: 8, cliente: "Patrícia Fernandes", tipoProcesso: "PENSÃO DE MORTE URBANA OU RURAL", feitoPor: "Bruno Cardoso", feitoEm: "2024-04-30" },
  { id: 9, cliente: "Marcos Oliveira", tipoProcesso: "APOSENTADORIAS", feitoPor: "Larissa Souza", feitoEm: "2024-05-09" },
  { id: 10, cliente: "Beatriz Lima", tipoProcesso: "AUXILIO DOENÇA", feitoPor: "Paulo Henrique", feitoEm: "2024-05-22" },
];
const ProcessosPage = () => {
  return (
    <Box>
      <InputGroup endElement={<IconButton variant="ghost" aria-label="Buscar"><IoSearchOutline /></IconButton>}>
        <Input placeholder="Buscar processo..." p={5} borderRadius="50px"/>
      </InputGroup>

      <Table.Root size="sm" variant="outline" mb={2} mt={4} borderRadius="8px">
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
                <Modal 
                  hasButton={false}
                  icon={<IoEyeOutline size={20} />}
                  title={`Visualizar processo`}
                >
                  <Flex flexDir="column" gap={4}>
                    <Text><strong>Cliente:</strong> {item.cliente}</Text>
                    <Text><strong>Benefício:</strong> {item.tipoProcesso}</Text>
                    <Text><strong>Data do Atendimento:</strong> {item.feitoEm}</Text>

                    <Text><strong>Observações:</strong> Lorem ipsum dolor, sit amet consectetur adipisicing elit. Sunt aspernatur nesciunt soluta laborum consequuntur repudiandae repellat tempora doloribus, ratione veritatis quisquam, molestiae, at dolorum reiciendis. Ducimus beatae pariatur odit ex.</Text>

                    <Text><strong>Documentos:</strong> <Link href="#">Link para documentos</Link></Text>

                    <Text><strong>Feito Por:</strong> {item.feitoPor}</Text>

                  </Flex>
                </Modal>
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
