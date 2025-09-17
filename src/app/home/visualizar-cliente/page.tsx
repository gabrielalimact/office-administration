'use client';
import { Box, Flex, Text, Table, Button } from '@chakra-ui/react';
import { useRouter, useSearchParams } from 'next/navigation';
import { useMemo, Suspense } from 'react';
import { IoIosArrowBack } from 'react-icons/io';

const clientesMock = [
  {
    nome: 'Lucas Andrade',
    cpf: '123.456.789-00',
    rg: 'MG-12.345.678',
    endereco: 'Rua das Flores, 123',
    cidade: 'Belo Horizonte',
    estado: 'MG',
    processos: [
      {
        id: 1,
        tipoProcesso: 'LOAS/88',
        beneficio: 'LOAS/88',
        feitoPor: 'Marina Lopes',
        feitoEm: '2024-01-05',
        status: 'EM ANDAMENTO',
        observacoes: 'Cliente apresentou todos os documentos necessários.',
        documentos: [
          { nome: 'RG.pdf', url: '#' },
          { nome: 'CPF.pdf', url: '#' },
        ],
      },
      {
        id: 11,
        tipoProcesso: 'AUXILIO DOENÇA',
        beneficio: 'AUXILIO DOENÇA',
        feitoPor: 'Marina Lopes',
        feitoEm: '2024-03-10',
        status: 'FINALIZADO',
        observacoes: 'Processo finalizado com sucesso.',
        documentos: [{ nome: 'Atestado.pdf', url: '#' }],
      },
    ],
  },
  // ...outros clientes
];

function VisualizarClienteContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const clienteNome = searchParams.get('cliente') || '';
  const cliente = useMemo(
    () => clientesMock.find((c) => c.nome === clienteNome) || clientesMock[0],
    [clienteNome],
  );

  if (!cliente) return <Text>Cliente não encontrado.</Text>;

  return (
    <Box p={6} bg="#f4f8fb" minH="100vh">
      <Button
        mb={4}
        p={3}
        onClick={() => router.back()}
        bg="var(--darkblue)"
        color="white"
        _hover={{ bg: '#2a357a' }}
      >
        <IoIosArrowBack />
        Voltar
      </Button>
      <Flex gap={12} mb={8}>
        <Box minW={320} bg="var(--primary)" color="white" borderRadius={12} p={6} boxShadow="md">
          <Text fontSize="2xl" fontWeight="bold" mb={2}>
            {cliente.nome}
          </Text>
          <Text mb={1}>
            <strong>CPF:</strong> {cliente.cpf}
          </Text>
          <Text mb={1}>
            <strong>RG:</strong> {cliente.rg}
          </Text>
          <Text mb={1}>
            <strong>Endereço:</strong> {cliente.endereco}
          </Text>
          <Text mb={1}>
            <strong>Cidade/Estado:</strong> {cliente.cidade}/{cliente.estado}
          </Text>
        </Box>
        <Box flex={1}>
          <Text fontSize="xl" fontWeight="bold" mb={2} color="var(--darkblue)">
            Processos do cliente
          </Text>
          <Table.Root size="sm" variant="outline" borderRadius="8px" boxShadow="sm">
            <Table.Header bg="var(--primary)">
              <Table.Row>
                <Table.ColumnHeader color="white" p={2}>
                  Tipo
                </Table.ColumnHeader>
                <Table.ColumnHeader color="white" p={2}>
                  Status
                </Table.ColumnHeader>
                <Table.ColumnHeader color="white" p={2}>
                  Data
                </Table.ColumnHeader>
                <Table.ColumnHeader color="white" p={2}>
                  Feito por
                </Table.ColumnHeader>
              </Table.Row>
            </Table.Header>
            <Table.Body>
              {cliente.processos.map((proc) => (
                <Table.Row key={proc.id} _hover={{ bg: '#e3eafd' }}>
                  <Table.Cell p={2}>{proc.tipoProcesso}</Table.Cell>
                  <Table.Cell p={2}>{proc.status}</Table.Cell>
                  <Table.Cell p={2}>{proc.feitoEm}</Table.Cell>
                  <Table.Cell p={2}>{proc.feitoPor}</Table.Cell>
                </Table.Row>
              ))}
            </Table.Body>
          </Table.Root>
        </Box>
      </Flex>
      <Box>
        {cliente.processos.map((proc) => (
          <Box
            key={proc.id}
            id={`detalhe-proc-${proc.id}`}
            mb={8}
            p={6}
            borderWidth={1}
            borderRadius={12}
            bg="#e3eafd"
            boxShadow="sm"
          >
            <Text fontSize="lg" fontWeight="bold" mb={2} color="var(--darkblue)">
              Detalhes do Processo: {proc.tipoProcesso}
            </Text>
            <Text mb={1}>
              <strong>Status:</strong> {proc.status}
            </Text>
            <Text mb={1}>
              <strong>Data do Atendimento:</strong> {proc.feitoEm}
            </Text>
            <Text mb={1}>
              <strong>Observações:</strong> {proc.observacoes}
            </Text>
            <Text mb={1}>
              <strong>Documentos:</strong>{' '}
              {proc.documentos.map((doc) => (
                <a
                  key={doc.nome}
                  href={doc.url}
                  style={{ marginRight: 8, color: '#2a357a', textDecoration: 'underline' }}
                >
                  {doc.nome}
                </a>
              ))}
            </Text>
            <Text mb={1}>
              <strong>Feito Por:</strong> {proc.feitoPor}
            </Text>
          </Box>
        ))}
      </Box>
    </Box>
  );
}

export default function VisualizarClientePage() {
  return (
    <Suspense fallback={<Text>Carregando cliente...</Text>}>
      <VisualizarClienteContent />
    </Suspense>
  );
}
