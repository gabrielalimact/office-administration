/* eslint-disable @typescript-eslint/no-explicit-any */
'use client';
import {
  Box,
  ButtonGroup,
  IconButton,
  Input,
  InputGroup,
  Pagination,
  Table,
  Flex,
  Text,
  Select,
  createListCollection,
  Portal,
  Field,
} from '@chakra-ui/react';
import { IoEyeOutline, IoSearchOutline } from 'react-icons/io5';
import { LuChevronLeft, LuChevronRight } from 'react-icons/lu';
import Link from 'next/link';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { processosMock } from '@/mocks/processos';

const responsaveisList = createListCollection({
  items: processosMock
    .map((p) => p.responsavel)
    .filter((value, index, self) => self.indexOf(value) === index)
    .map((responsavel) => ({ label: responsavel, value: responsavel })),
});

const tiposProcessosList = createListCollection({
  items: processosMock
    .map((p) => p.tipoProcesso)
    .filter((value, index, self) => self.indexOf(value) === index)
    .map((tipo) => ({ label: tipo, value: tipo })),
});

const statusOptions = createListCollection({
  items: processosMock
    .map((p) => p.status)
    .filter((value, index, self) => self.indexOf(value) === index)
    .map((tipo) => ({ label: tipo, value: tipo })),
});

const ProcessosPage = () => {
  const router = useRouter();
  const [busca, setBusca] = useState('');
  const [responsavel, setResponsavel] = useState('');
  const [tipoProcesso, setTipoProcesso] = useState('');
  const [formData, setFormData] = useState({ situacao: '', tipoProcesso: '', responsavel: '' });

  const handleSituacao = (value: any) => {
    if (!value.items.length) {
      setFormData((prev) => ({ ...prev, situacao: '' }));
      return;
    }
    setFormData((prev) => ({ ...prev, situacao: value.items[0].label }));
  };

  const handleResponsavel = (value: any) => {
    if (!value.items.length) {
      setFormData((prev) => ({ ...prev, responsavel: '' }));
      return;
    }
    setFormData((prev) => ({ ...prev, responsavel: value.items[0].label }));
  };

  const handleTiposProcesso = (value: any) => {
    if (!value.items.length) {
      setFormData((prev) => ({ ...prev, tipoProcesso: '' }));
      return;
    }
    setFormData((prev) => ({ ...prev, tipoProcesso: value.items[0].label }));
  };

  const processosFiltrados = processosMock.filter((proc) => {
    const matchBusca =
      proc.cliente.toLowerCase().includes(busca.toLowerCase()) ||
      proc.tipoProcesso.toLowerCase().includes(busca.toLowerCase());
    const matchResponsavel = !formData.responsavel || proc.responsavel === formData.responsavel;
    const matchTipo = !formData.tipoProcesso || proc.tipoProcesso === formData.tipoProcesso;
    const matchSituacao = !formData.situacao || proc.status === formData.situacao;
    return matchBusca && matchResponsavel && matchTipo && matchSituacao;
  });

  return (
    <Box p={6} bg="#f4f8fb" minH="100vh" margin="0 auto">
      <Text fontSize="2xl" fontWeight="bold" mb={4}>
        Processos
      </Text>
      <Flex gap={3} mb={3} alignItems="center">
        <Field.Root required>
          <Field.Label fontWeight={'bold'}>Buscar</Field.Label>
          <InputGroup
            endElement={
              <IconButton variant="ghost" aria-label="Buscar">
                <IoSearchOutline />
              </IconButton>
            }
          >
            <Input
              placeholder="Buscar processo..."
              p={5}
              borderRadius="4px"
              value={busca}
              onChange={(e) => setBusca(e.target.value)}
            />
          </InputGroup>
        </Field.Root>

        <Select.Root
          collection={responsaveisList}
          onValueChange={(value) => handleResponsavel(value)}
        >
          <Select.HiddenSelect />
          <Select.Label fontWeight="bold">Responsável</Select.Label>
          <Select.Control>
            <Select.Trigger p={2}>
              <Select.ValueText placeholder="Selecione o funcionário" />
            </Select.Trigger>
            <Select.IndicatorGroup p={2}>
              <Select.ClearTrigger />
              <Select.Indicator />
            </Select.IndicatorGroup>
          </Select.Control>
          <Portal>
            <Select.Positioner>
              <Select.Content>
                {responsaveisList.items.map((responsavel) => (
                  <Select.Item p={2} item={responsavel} key={responsavel.value}>
                    {responsavel.label}
                    <Select.ItemIndicator />
                  </Select.Item>
                ))}
              </Select.Content>
            </Select.Positioner>
          </Portal>
        </Select.Root>
        <Select.Root
          collection={tiposProcessosList}
          onValueChange={(value) => handleTiposProcesso(value)}
        >
          <Select.HiddenSelect />
          <Select.Label fontWeight="bold">Tipo de Processo</Select.Label>
          <Select.Control>
            <Select.Trigger p={2}>
              <Select.ValueText placeholder="Selecione o tipo" />
            </Select.Trigger>
            <Select.IndicatorGroup p={2}>
              <Select.ClearTrigger />
              <Select.Indicator />
            </Select.IndicatorGroup>
          </Select.Control>
          <Portal>
            <Select.Positioner>
              <Select.Content>
                {tiposProcessosList.items.map((status) => (
                  <Select.Item p={2} item={status} key={status.value}>
                    {status.label}
                    <Select.ItemIndicator />
                  </Select.Item>
                ))}
              </Select.Content>
            </Select.Positioner>
          </Portal>
        </Select.Root>
        <Select.Root collection={statusOptions} onValueChange={(value) => handleSituacao(value)}>
          <Select.HiddenSelect />
          <Select.Label fontWeight="bold">Situação</Select.Label>
          <Select.Control>
            <Select.Trigger p={2}>
              <Select.ValueText placeholder="Selecione a situação" />
            </Select.Trigger>
            <Select.IndicatorGroup p={2}>
              <Select.ClearTrigger />
              <Select.Indicator />
            </Select.IndicatorGroup>
          </Select.Control>
          <Portal>
            <Select.Positioner>
              <Select.Content>
                {statusOptions.items.map((status) => (
                  <Select.Item p={2} item={status} key={status.value}>
                    {status.label}
                    <Select.ItemIndicator />
                  </Select.Item>
                ))}
              </Select.Content>
            </Select.Positioner>
          </Portal>
        </Select.Root>
      </Flex>

      <Table.Root size="sm" variant="outline" mb={2} mt={4} borderRadius="8px">
        <Table.Header height="50px" bgColor="var(--primary)">
          <Table.Row>
            <Table.ColumnHeader color="white" fontSize="md" fontWeight="bold" paddingLeft={4}>
              Nome do cliente
            </Table.ColumnHeader>
            <Table.ColumnHeader color="white" fontSize="md" fontWeight="bold">
              Tipo de processo
            </Table.ColumnHeader>
            <Table.ColumnHeader color="white" fontSize="md" fontWeight="bold">
              Tipo de agendamento
            </Table.ColumnHeader>
            <Table.ColumnHeader color="white" fontSize="md" fontWeight="bold">
              Situação
            </Table.ColumnHeader>
            <Table.ColumnHeader color="white" fontSize="md" fontWeight="bold">
              Data de cadastro
            </Table.ColumnHeader>
            <Table.ColumnHeader color="white" fontSize="md" fontWeight="bold">
              Responsável
            </Table.ColumnHeader>
            <Table.ColumnHeader
              w="fit-content"
              color="white"
              fontSize="md"
              fontWeight="bold"
              textAlign="end"
              paddingRight={4}
            />
          </Table.Row>
        </Table.Header>
        <Table.Body>
          {processosFiltrados.map((item) => (
            <Table.Row
              onClick={() => {
                router.push('/home/visualizar-cliente?cliente=' + item.cliente);
              }}
              height="50px"
              key={item.id}
              _hover={{ bgColor: 'var(--hover)', cursor: 'pointer' }}
            >
              <Table.Cell paddingLeft={4}>{item.cliente}</Table.Cell>
              <Table.Cell>{item.tipoProcesso}</Table.Cell>
              <Table.Cell>{item.tipoAgendamento}</Table.Cell>
              <Table.Cell>{item.status}</Table.Cell>
              <Table.Cell>{item.feitoEm}</Table.Cell>
              <Table.Cell>{item.responsavel}</Table.Cell>
              <Table.Cell paddingRight={4} textAlign="end">
                <Link
                  href={{ pathname: '/home/visualizar-cliente', query: { cliente: item.cliente } }}
                  title="Visualizar detalhes do cliente e processos"
                  style={{ display: 'inline-flex', alignItems: 'center' }}
                >
                  <IoEyeOutline size={20} />
                </Link>
              </Table.Cell>
            </Table.Row>
          ))}
        </Table.Body>
      </Table.Root>

      <Pagination.Root
        count={processosMock.length * 5}
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

export default ProcessosPage;
