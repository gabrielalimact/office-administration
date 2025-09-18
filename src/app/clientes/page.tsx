'use client';
import { Box, Text, Table, Input, InputGroup, IconButton, Flex } from '@chakra-ui/react';
import { IoSearchOutline } from 'react-icons/io5';
import { useState } from 'react';
import { useLoading } from '@/components/LoadingContext';

const clientesMock = [
  { id: 1, nome: 'Lucas Andrade', email: 'lucas@email.com', telefone: '(11) 99999-1111' },
  { id: 2, nome: 'Gabriela Torres', email: 'gabriela@email.com', telefone: '(11) 99999-2222' },
  { id: 3, nome: 'Eduardo Silva', email: 'eduardo@email.com', telefone: '(11) 99999-3333' },
  { id: 4, nome: 'Renata Souza', email: 'renata@email.com', telefone: '(11) 99999-4444' },
  { id: 5, nome: 'Thiago Costa', email: 'thiago@email.com', telefone: '(11) 99999-5555' },
  { id: 6, nome: 'Amanda Martins', email: 'amanda@email.com', telefone: '(11) 99999-6666' },
  { id: 7, nome: 'Felipe Rocha', email: 'felipe@email.com', telefone: '(11) 99999-7777' },
  { id: 8, nome: 'Patrícia Fernandes', email: 'patricia@email.com', telefone: '(11) 99999-8888' },
  { id: 9, nome: 'Marcos Oliveira', email: 'marcos@email.com', telefone: '(11) 99999-9999' },
  { id: 10, nome: 'Beatriz Lima', email: 'beatriz@email.com', telefone: '(11) 99999-0000' },
];

export default function ClientesPage() {
  const [busca, setBusca] = useState('');
  const { setLoading } = useLoading();
  const clientesFiltrados = clientesMock.filter((c) =>
    c.nome.toLowerCase().includes(busca.toLowerCase()),
  );

  const handleClienteClick = (clienteNome: string) => {
    setLoading(true);
    setTimeout(() => {
      window.location.href = `/visualizar-cliente?cliente=${encodeURIComponent(clienteNome)}`;
      setLoading(false);
    }, 600);
  };

  return (
    <Box p={6} bg="#f4f8fb" minH="100vh" margin="0 auto">
      <Text fontSize="2xl" fontWeight="bold" mb={4}>
        Clientes
      </Text>
      <Flex mb={4} gap={2}>
        <InputGroup
          endElement={
            <IconButton variant="ghost" aria-label="Buscar">
              <IoSearchOutline />
            </IconButton>
          }
        >
          <Input
            placeholder="Buscar cliente..."
            p={5}
            borderRadius="50px"
            value={busca}
            onChange={(e) => setBusca(e.target.value)}
          />
        </InputGroup>
      </Flex>
      <Table.Root size="sm" variant="outline" borderRadius="8px">
        <Table.Header height="50px" bgColor="var(--primary)">
          <Table.Row>
            <Table.ColumnHeader color="white" fontSize="md" fontWeight="bold" paddingLeft={4}>
              Nome
            </Table.ColumnHeader>
            <Table.ColumnHeader color="white" fontSize="md" fontWeight="bold">
              Email
            </Table.ColumnHeader>
            <Table.ColumnHeader color="white" fontSize="md" fontWeight="bold">
              Telefone
            </Table.ColumnHeader>
          </Table.Row>
        </Table.Header>
        <Table.Body>
          {clientesFiltrados.map((cliente) => (
            <Table.Row
              height="50px"
              key={cliente.id}
              _hover={{ bgColor: 'var(--hover)', cursor: 'pointer' }}
              onClick={() => handleClienteClick(cliente.nome)}
            >
              <Table.Cell paddingLeft={4}>{cliente.nome}</Table.Cell>
              <Table.Cell>{cliente.email}</Table.Cell>
              <Table.Cell>{cliente.telefone}</Table.Cell>
            </Table.Row>
          ))}
        </Table.Body>
      </Table.Root>
    </Box>
  );
}
