"use client";
import { Box, Text, Table } from '@chakra-ui/react';
import { useEffect, useState } from 'react';
import { marked } from 'marked';
import { useParams } from 'next/navigation';
import { funcionariosMock } from '@/mocks/funcionarios';

export default function VisualizarRelatorioPage() {
  const params = useParams();
  const id = Number(params.id);
  const funcionario = funcionariosMock.find((f) => f.id === id);


  const [relatorio, setRelatorio] = useState<{ data: string; conteudo: string } | null>(null);
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const raw = localStorage.getItem('relatorio');
      if (raw) {
        try {
          const obj = JSON.parse(raw);
          if (obj && obj.data && obj.conteudo) {
            setRelatorio(obj);
            console.log(obj);
          }
        } catch (e) {
          setRelatorio(null);
        }
      }
    }
  }, []);

  if (!funcionario) {
    return <Text>Funcionário não encontrado.</Text>;
  }

  return (
    <Box p={6} bg="#f4f8fb" minH="100vh" margin="0 auto">
      <Text fontSize="2xl" fontWeight="bold" mb={4}>
        Relatórios de {funcionario.nome}
      </Text>
      <Text fontSize="md" mb={2} color="gray.600">
        Cargo: {funcionario.cargo}
      </Text>
      <Table.Root size="sm" variant="outline" borderRadius="8px" boxShadow="sm" mt={4}>
        <Table.Header bg="var(--primary)">
          <Table.Row>
            <Table.ColumnHeader color="white" p={2}>Tipo de Processo</Table.ColumnHeader>
            <Table.ColumnHeader color="white" p={2}>Descrição</Table.ColumnHeader>
            <Table.ColumnHeader color="white" p={2}>Status</Table.ColumnHeader>
            <Table.ColumnHeader color="white" p={2}>Data</Table.ColumnHeader>
          </Table.Row>
        </Table.Header>
        <Table.Body>
          {funcionario.relatorios.length === 0 ? (
            <Table.Row>
              <Table.Cell colSpan={4} textAlign="center">
                Nenhum relatório encontrado para este funcionário.
              </Table.Cell>
            </Table.Row>
          ) : (
            funcionario.relatorios.map((rel) => (
              <Table.Row key={rel.id} _hover={{ bg: '#e3eafd' }}>
                <Table.Cell p={2}>{rel.tipoProcesso}</Table.Cell>
                <Table.Cell p={2}>{rel.descricao}</Table.Cell>
                <Table.Cell p={2}>{rel.status}</Table.Cell>
                <Table.Cell p={2}>{rel.feitoEm}</Table.Cell>
              </Table.Row>
            ))
          )}
        </Table.Body>
      </Table.Root>

      <Box mt={8} p={4} bg="white" borderRadius={8} boxShadow="sm">
        <Text fontWeight="bold" mb={2}>Último relatório enviado:</Text>
        {relatorio ? (
          <>
            <Text fontSize="sm" color="gray.500" mb={2}>
              Data de envio: {new Date(relatorio.data).toLocaleString('pt-BR', { dateStyle: 'short', timeStyle: 'short' })}
            </Text>
            <Box
              className="markdown-body"
              dangerouslySetInnerHTML={{
                __html: marked.parse(relatorio.conteudo as string)
              }}
            />
          </>
        ) : (
          <Text color="gray.500">Nenhum relatório enviado ainda.</Text>
        )}
      </Box>
    </Box>
  );
}
