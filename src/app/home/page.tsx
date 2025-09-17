'use client';
import { Box, SimpleGrid, Text, Heading } from '@chakra-ui/react';
import { useMemo } from 'react';
import { funcionariosMock } from '../../mocks/funcionarios';
import { IProcessosTable, processosMock } from '../../mocks/processos';

const tiposProcesso = [
  'LOAS/88',
  'LOAS/87',
  'PENSÃO DE MORTE URBANA OU RURAL',
  'APOSENTADORIAS',
  'AUXILIO DOENÇA',
];

const Home = () => {
  const processosPorTipo = useMemo(() => {
    const counts: Record<string, number> = {};
    tiposProcesso.forEach((tipo) => {
      counts[tipo] = processosMock.filter((p: IProcessosTable) => p.tipoProcesso === tipo).length;
    });
    return counts;
  }, []);

  const totalProcessos = processosMock.length;
  const totalFuncionarios = funcionariosMock.length;
  const totalClientes = new Set(processosMock.map((p: IProcessosTable) => p.cliente)).size;

  return (
    <Box p={8}>
      <Text fontSize="2xl" fontWeight="bold" mb={6} color="var(--darkblue)">
        Meu painel
      </Text>
      <SimpleGrid columns={{ base: 1, md: 3 }} gap={6} mb={8}>
        <Box bg="#e3eafd" borderRadius={12} p={6} boxShadow="sm">
          <Heading size="md" mb={2}>
            Total de Processos
          </Heading>
          <Text fontSize="3xl" color="var(--darkblue)">
            {totalProcessos}
          </Text>
          <Text fontSize="sm">Todos os processos cadastrados</Text>
        </Box>
        <Box bg="#e3eafd" borderRadius={12} p={6} boxShadow="sm">
          <Heading size="md" mb={2}>
            Total de Funcionários
          </Heading>
          <Text fontSize="3xl" color="var(--darkblue)">
            {totalFuncionarios}
          </Text>
          <Text fontSize="sm">Equipe cadastrada</Text>
        </Box>
        <Box bg="#e3eafd" borderRadius={12} p={6} boxShadow="sm">
          <Heading size="md" mb={2}>
            Total de Clientes
          </Heading>
          <Text fontSize="3xl" color="var(--darkblue)">
            {totalClientes}
          </Text>
          <Text fontSize="sm">Clientes únicos atendidos</Text>
        </Box>
      </SimpleGrid>
      <Text fontSize="xl" fontWeight="bold" mb={4} color="var(--darkblue)">
        Processos por tipo
      </Text>
      <SimpleGrid columns={{ base: 1, md: 3, lg: 5 }} gap={4}>
        {tiposProcesso.map((tipo) => (
          <Box key={tipo} bg="#f4f8fb" borderRadius={10} p={5} boxShadow="xs">
            <Heading size="sm" mb={2}>
              {tipo}
            </Heading>
            <Text fontSize="2xl" color="var(--darkblue)">
              {processosPorTipo[tipo]}
            </Text>
          </Box>
        ))}
      </SimpleGrid>
    </Box>
  );
};

export default Home;
