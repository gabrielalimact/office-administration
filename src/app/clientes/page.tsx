'use client';
import { Box, Text, IconButton, Flex, Button, ButtonGroup, Pagination } from '@chakra-ui/react';
import { IoEyeOutline, IoTrash } from 'react-icons/io5';
import { useEffect, useState, useCallback } from 'react';
import { useLoading } from '@/components/LoadingContext';
import { getClientes, deletarCliente } from '@/services/cliente-service';
import { Cliente } from '../../../types/cliente';
import { LuChevronLeft, LuChevronRight } from 'react-icons/lu';
import { useBreadcrumb } from '@/components/BreadcrumbContext';
import Breadcrumb from '@/components/Breadcrumb';
import GridTable from '@/components/GridTable';
import { maskCPF } from '../../../utils/maskCPF';
import CustomInput from '@/components/CustomInput';

export default function ClientesPage() {
  const [busca, setBusca] = useState('');
  const [clientes, setClientes] = useState<Cliente[]>([]);
  const [clienteParaExcluir, setClienteParaExcluir] = useState<Cliente | null>(null);
  const [modalAberto, setModalAberto] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize] = useState(10);
  const { setLoading } = useLoading();
  const { setBreadcrumbs } = useBreadcrumb();

  useEffect(() => {
    setBreadcrumbs([
      { label: 'Início', path: '/home' },
      { label: 'Clientes', path: '/clientes' },
    ]);
  }, [setBreadcrumbs]);

  const clientesFiltrados = clientes.filter((c) =>
    c.nome.toLowerCase().includes(busca.toLowerCase()),
  );
  const totalItems = clientesFiltrados.length;
  const totalPages = Math.ceil(totalItems / pageSize);
  const startIndex = (currentPage - 1) * pageSize;
  const endIndex = startIndex + pageSize;
  const clientesPaginados = clientesFiltrados.slice(startIndex, endIndex);

  useEffect(() => {
    setCurrentPage(1);
  }, [busca]);

  const handleClienteClick = (clienteID: number) => {
    setLoading(true);
    setTimeout(() => {
      window.location.href = `/visualizar-cliente?cliente=${encodeURIComponent(clienteID)}`;
      setLoading(false);
    }, 600);
  };

  const handleExcluirClick = (e: React.MouseEvent, cliente: Cliente) => {
    e.stopPropagation();
    setClienteParaExcluir(cliente);
    setModalAberto(true);
  };

  const confirmarExclusao = async () => {
    if (!clienteParaExcluir) return;

    setLoading(true);
    try {
      await deletarCliente(clienteParaExcluir.id);
      setClientes(clientes.filter((c) => c.id !== clienteParaExcluir.id));
      setModalAberto(false);
      setClienteParaExcluir(null);
    } catch (error) {
      console.error('Erro ao excluir cliente:', error);
      alert('Erro ao excluir cliente. Tente novamente.');
    } finally {
      setLoading(false);
    }
  };

  const cancelarExclusao = () => {
    setModalAberto(false);
    setClienteParaExcluir(null);
  };

  const fetchClientes = useCallback(async () => {
    setLoading(true);
    const data = await getClientes();
    setClientes(data);
    setLoading(false);
  }, [setLoading]);

  useEffect(() => {
    fetchClientes();
  }, [fetchClientes]);

  return (
    <Box p={6} bg="#f4f8fb" minH="100vh" margin="0 auto">
      <Breadcrumb />
      <Text fontSize="2xl" fontWeight="bold" mb={4}>
        Clientes
      </Text>
      <CustomInput
        placeholder="Buscar cliente..."
        isSearch
        value={busca}
        onChange={(e) => setBusca(e.target.value)}
      />
      <Box mt={4}>
        <GridTable<Cliente>
          columns={[
            { key: 'nome', label: 'Nome', width: '2fr' },
            { key: 'cpf', label: 'CPF', width: '1fr' },
            { key: 'email', label: 'Email', width: '1fr' },
            { key: 'processosCount', label: 'Processos', width: '1fr' },
            { key: 'actions', label: '', width: '120px', align: 'right' },
          ]}
          data={clientesPaginados}
          onRowClick={(cliente) => handleClienteClick(cliente.id)}
          renderCell={(cliente, column) => {
            if (column.key === 'cpf') {
              return <Text color="gray.700">{maskCPF(cliente.cpf)}</Text>;
            }
            if (column.key === 'email') {
              return <Text color="gray.700">{cliente.email ?? 'Não informado'}</Text>;
            }
            if (column.key === 'processosCount') {
              return <Text color="gray.700">{cliente.processos.length ?? 0}</Text>;
            }
            if (column.key === 'actions') {
              return (
                <Flex gap={1}>
                  <IconButton
                    variant="ghost"
                    aria-label="Visualizar cliente"
                    size="sm"
                    onClick={(e) => {
                      e.stopPropagation();
                      handleClienteClick(cliente.id);
                    }}
                  >
                    <IoEyeOutline />
                  </IconButton>
                  <IconButton
                    variant="ghost"
                    aria-label="Excluir cliente"
                    size="sm"
                    onClick={(e) => handleExcluirClick(e, cliente)}
                    _hover={{ color: 'red.500' }}
                  >
                    <IoTrash />
                  </IconButton>
                </Flex>
              );
            }
            return (
              <Text color="gray.700">{String(cliente[column.key as keyof Cliente] || '')}</Text>
            );
          }}
          emptyMessage="Nenhum cliente encontrado"
        />
      </Box>

      <Pagination.Root
        count={totalItems}
        pageSize={pageSize}
        page={currentPage}
        onPageChange={(details) => setCurrentPage(details.page)}
        display="flex"
        justifyContent="flex-end"
      >
        <ButtonGroup variant="ghost" size="sm" wrap="wrap">
          <Pagination.PrevTrigger asChild>
            <IconButton disabled={currentPage === 1}>
              <LuChevronLeft />
            </IconButton>
          </Pagination.PrevTrigger>

          <Pagination.Items
            render={(page) => (
              <IconButton
                variant={page.value === currentPage ? 'outline' : 'ghost'}
                onClick={() => setCurrentPage(page.value)}
              >
                {page.value}
              </IconButton>
            )}
          />

          <Pagination.NextTrigger asChild>
            <IconButton disabled={currentPage === totalPages}>
              <LuChevronRight />
            </IconButton>
          </Pagination.NextTrigger>
        </ButtonGroup>
      </Pagination.Root>

      {modalAberto && (
        <Box
          position="fixed"
          top="0"
          left="0"
          right="0"
          bottom="0"
          bg="rgba(0, 0, 0, 0.6)"
          display="flex"
          alignItems="center"
          justifyContent="center"
          zIndex="modal"
        >
          <Box bg="white" p={6} borderRadius="md" boxShadow="xl" minW="400px">
            <Text fontSize="lg" fontWeight="bold" mb={4}>
              Confirmar Exclusão
            </Text>
            <Text mb={6} color="gray.600">
              Tem certeza que deseja excluir o cliente{' '}
              <Text as="span" fontWeight="bold">
                {clienteParaExcluir?.nome}
              </Text>
              ? Esta ação não pode ser desfeita.
            </Text>
            <Flex gap={3} justifyContent="flex-end">
              <Button variant="ghost" onClick={cancelarExclusao} p={4}>
                Cancelar
              </Button>
              <Button
                bg="red.500"
                color="white"
                _hover={{ bg: 'red.600' }}
                onClick={confirmarExclusao}
                p={4}
              >
                Excluir
              </Button>
            </Flex>
          </Box>
        </Box>
      )}
    </Box>
  );
}
