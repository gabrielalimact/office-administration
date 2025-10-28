'use client';
import { Box, Flex, Skeleton, Stack, Text } from '@chakra-ui/react';
import { useEffect, useState } from 'react';
import { marked } from 'marked';
import { useParams } from 'next/navigation';
import { getRelatoriosByFuncionarioID } from '@/services/relatorios-service';
import { useBreadcrumb } from '@/components/BreadcrumbContext';
import Breadcrumb from '@/components/Breadcrumb';
interface IFuncionario {
  id: number;
  nome: string;
  cargo: string;
  cpf: string;
  email: string;
}

interface IRelatorio {
  created_at: string;
  conteudo: string | string[];
  titulo: string;
}
interface Props {
  conteudo: string
}
function RelatorioPreview({ conteudo }: Props) {
  const html = marked(conteudo, { breaks: true })

  return (
    <Box
      className="preview-content"
      dangerouslySetInnerHTML={{ __html: html }}
    />
  )
}
function VisualizarRelatorioPage() {
  const params = useParams();
  const id = Number(params.id);
  const [isLoading, setIsLoading] = useState(true);
  const [funcionario, setFuncionario] = useState<IFuncionario | null>(null);
  const [relatorio, setRelatorio] = useState<IRelatorio[] | null>(null);
  const { setBreadcrumbs } = useBreadcrumb();
  useEffect(() => {
    getRelatoriosByFuncionarioID(Number(id)).then((data) => {
      console.log(data)
      const relatorios = data.map((rel) => ({
        created_at: rel.created_at,
        conteudo: rel.conteudo,
        titulo: rel.titulo,
      }));
      const funcionario = data.map((rel) => ({
        id: rel.funcionario.id,
        nome: rel.funcionario.nome,
        cargo: rel.funcionario.cargo,
        cpf: '',
        email: '',
      }))[0];
      setFuncionario(funcionario);
      setRelatorio(relatorios);
      setIsLoading(false);

      if (funcionario) {
        setBreadcrumbs([
          { label: 'Início', path: '/home' },
          { label: 'Funcionários', path: '/funcionarios-relatorios' },
          { label: `Relatórios de ${funcionario.nome}`, path: `/visualizar-relatorio/${id}` },
        ]);
      }
    });
  }, [id, setBreadcrumbs]);

  return (
    <Box p={6} bg="#f4f8fb" minH="100vh" margin="0 auto">
      <Breadcrumb />
      {isLoading ? (
        <Stack>
          <Skeleton height="20px" mb="4" />
          <Skeleton height="16px" mb="2" />
        </Stack>
      ) : (
        <>
          <Text fontSize="2xl" fontWeight="bold" mb={4}>
            Relatórios de {funcionario?.nome}
          </Text>
          <Text fontSize="md" mb={2} color="gray.600">
            Cargo: {funcionario?.cargo}
          </Text>
        </>
      )}

      {/* <Table.Root size="sm" variant="outline" borderRadius="8px" boxShadow="sm" mt={4}>
        <Table.Header bg="var(--primary)">
          <Table.Row>
            <Table.ColumnHeader color="white" p={2}>
              Tipo de Processo
            </Table.ColumnHeader>
            <Table.ColumnHeader color="white" p={2}>
              Descrição
            </Table.ColumnHeader>
            <Table.ColumnHeader color="white" p={2}>
              Status
            </Table.ColumnHeader>
            <Table.ColumnHeader color="white" p={2}>
              Data
            </Table.ColumnHeader>
          </Table.Row>
        </Table.Header>
        <Table.Body>
          {relatorio?.length === 0 ? (
            <Table.Row>
              <Table.Cell colSpan={4} textAlign="center">
                Nenhum relatório encontrado para este funcionário.
              </Table.Cell>
            </Table.Row>
          ) : (
            relatorio?.map((rel) => (
              <Table.Row key={rel.id} _hover={{ bg: '#e3eafd' }}>
                <Table.Cell p={2}>{rel.tipoProcesso}</Table.Cell>
                <Table.Cell p={2}>{rel.descricao}</Table.Cell>
                <Table.Cell p={2}>{rel.status}</Table.Cell>
                <Table.Cell p={2}>{rel.feitoEm}</Table.Cell>
              </Table.Row>
            ))
          )}
        </Table.Body>
      </Table.Root> */}

      {isLoading ? (
        <Stack>
          <Skeleton height="40px" />
          <Skeleton height="40px" />
          <Skeleton height="40px" />
          <Skeleton height="40px" />
          <Skeleton height="40px" />
        </Stack>
      ) : (
        <>
          <Text fontWeight="bold" mb={2} borderBottomWidth={1} borderColor="gray.100">
            Todos os relatórios enviados:
          </Text>
          <Box p={4} bg="white" borderRadius={8} boxShadow="sm">
            {relatorio ? (
              relatorio.map((rel, index) => (
                <Box
                  key={index}
                  mb={4}
                  borderBottom={index < relatorio.length - 1 ? '1px solid #e2e8f0' : 'none'}
                  pb={4}
                >
                  <Flex align="center" gap={2} mb={2}>
                    <Text fontSize='18px' fontWeight={550}>
                      {rel?.titulo} |
                    </Text>
                    <Text fontSize="sm" color="gray.500">
                      Data de envio:{' '}
                      {new Date(rel?.created_at).toLocaleString('pt-BR', {
                      dateStyle: 'short',
                      timeStyle: 'short',
                    })}
                  </Text>
                  
                  </Flex>
                  <RelatorioPreview conteudo={rel?.conteudo as string} />
                </Box>
              ))
            ) : (
              <Text color="gray.500">Nenhum relatório enviado ainda.</Text>
            )}
          </Box>
        </>
      )}
    </Box>
  );
}

export default VisualizarRelatorioPage;