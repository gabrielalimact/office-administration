'use client';
import {
  Box,
  Button,
  ButtonGroup,
  Flex,
  IconButton,
  Pagination,
  Skeleton,
  Stack,
  Table,
  Text,
} from '@chakra-ui/react';
import { LuChevronLeft, LuChevronRight } from 'react-icons/lu';
import { MdPersonAdd } from 'react-icons/md';
import { useState, useEffect } from 'react';
import { useUserContext } from '@/components/UserContext';
import { useLoading } from '@/components/LoadingContext';
import { useBreadcrumb } from '@/components/BreadcrumbContext';
import Breadcrumb from '@/components/Breadcrumb';
import { IoEyeOutline } from 'react-icons/io5';
import { useRouter } from 'next/navigation';
import { getFuncionarios, IUsuarioResponse } from '@/services/usuario-service';
import CustomInput from '@/components/CustomInput';
import maskCPF from '../../../utils/maskCPF';

export interface IFuncionarios {
  id: number;
  nome: string;
  cargo: string;
  cpf: string;
  email: string;
}
const FuncionariosRelatoriosPage = () => {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(true);
  const [funcionarios, setFuncionarios] = useState<IFuncionarios[]>([]);
  const { setLoading } = useLoading();
  const { user } = useUserContext();
  const { setBreadcrumbs } = useBreadcrumb();
  const [currentPage, setCurrentPage] = useState(1);
  const pageSize = 10;
  const startIndex = (currentPage - 1) * pageSize;
  const endIndex = startIndex + pageSize;
  const funcionariosPage = funcionarios.slice(startIndex, endIndex);

  
  useEffect(() => {
    setBreadcrumbs([
      { label: 'Início', path: '/home' },
      { label: 'Funcionários', path: '/funcionarios-relatorios' },
    ]);
  }, [setBreadcrumbs]);

  useEffect(() => {
    if (user && user.cargo !== 'socio') {
      router.push('/home');
    }
  }, [user, router]);

  const handlePush = (path: string) => {
    setLoading(true);
    setTimeout(() => {
      router.push(path);
      setLoading(false);
    }, 400);
  };

  const fetchFuncionarios = async () => {
    setIsLoading(true);

    getFuncionarios().then((data) => {
      const funcionarios = data
        .map((item: IUsuarioResponse) => ({
          id: item.id,
          nome: item.nome,
          cargo: item.cargo,
          cpf: item.cpf,
          email: item.email,
        }))
        .sort((a, b) => {
          if (a.cargo === 'socio' && b.cargo !== 'socio') return -1;
          if (a.cargo !== 'socio' && b.cargo === 'socio') return 1;
          return a.cargo.localeCompare(b.cargo);
        });
      setFuncionarios(funcionarios);
      setIsLoading(false);
    });
  };

  useEffect(() => {
    fetchFuncionarios();
  }, []);
  return (
    <Box p={6} bg="#f4f8fb" minH="100vh" margin="0 auto">
      <Breadcrumb />
      <Text fontSize="2xl" fontWeight="bold" mb={4}>
        Funcionários
      </Text>
      <Flex gap="1rem">
        <CustomInput 
          placeholder="Buscar funcionário..."
          isSearch
        />
        <Flex justifyContent="flex-end">
          <Button
            variant="surface"
            size="sm"
            p="20px 10px"
            borderRadius="4px"
            backgroundColor="var(--primary)"
            color="white"
            fontWeight="bold"
            style={{ display: 'flex', alignItems: 'center', gap: 8 }}
            onClick={() => handlePush('/adicionar-funcionario')}
          >
            <MdPersonAdd style={{ marginRight: 6 }} /> Adicionar Funcionário
          </Button>
        </Flex>
      </Flex>

      {isLoading ? (
        <Stack mt={4}>
          <Skeleton height="40px" />
          <Skeleton height="40px" />
          <Skeleton height="40px" />
          <Skeleton height="40px" />
          <Skeleton height="40px" />
          <Skeleton height="40px" />
          <Skeleton height="40px" />
        </Stack>
      ) : (
        <Table.Root size="sm" variant="outline" mb={2} mt={4} borderRadius="4px" width="100%">
          <Table.Header height="50px" bgColor="var(--primary)">
            <Table.Row>
              <Table.ColumnHeader
                color="white"
                fontSize="md"
                fontWeight="bold"
                padding="0 0 0 20px"
                width="30%"
              >
                Funcionário
              </Table.ColumnHeader>
              <Table.ColumnHeader color="white" fontSize="md" fontWeight="bold" width="25%">
                Cargo
              </Table.ColumnHeader>
              <Table.ColumnHeader color="white" fontSize="md" fontWeight="bold" width="25%">
                CPF
              </Table.ColumnHeader>
              <Table.ColumnHeader
                color="white"
                fontSize="md"
                fontWeight="bold"
                textAlign="end"
                padding="0 20px 0 0"
                width="20%"
              >
                Ver relatório de atividade
              </Table.ColumnHeader>
            </Table.Row>
          </Table.Header>
          <Table.Body>
            {funcionariosPage.map((item) => (
              <Table.Row height="50px" key={item.id} _hover={{ bgColor: 'var(--hover)' }}>
                <Table.Cell padding="0 0 0 20px">{item.nome}</Table.Cell>
                <Table.Cell>{item.cargo}</Table.Cell>
                <Table.Cell>{maskCPF(item.cpf)}</Table.Cell>
                <Table.Cell padding="0 20px 0 0" textAlign="end">
                  <IconButton
                    variant="ghost"
                    aria-label="Ver relatório"
                    onClick={() => handlePush(`/visualizar-relatorio/${item.id}`)}
                  >
                    <IoEyeOutline />
                  </IconButton>
                </Table.Cell>
              </Table.Row>
            ))}
          </Table.Body>
        </Table.Root>
      )}

      <Pagination.Root
        count={funcionarios.length}
        pageSize={pageSize}
        page={currentPage}
        onPageChange={(details) => setCurrentPage(details.page)}
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
