'use client'
import {
  Button,
  ButtonGroup,
  Flex,
  IconButton,
  Pagination,
  Skeleton,
  Stack,
  Text,
  Dialog,
  Portal,
  CloseButton
} from '@chakra-ui/react'
import { LuChevronLeft, LuChevronRight } from 'react-icons/lu'
import { MdPersonAdd } from 'react-icons/md'
import { useState, useEffect } from 'react'
import { useUserContext } from '@/components/UserContext'
import { useLoading } from '@/components/LoadingContext'
import { useBreadcrumb } from '@/components/BreadcrumbContext'
import Breadcrumb from '@/components/Breadcrumb'
import { IoEyeOutline, IoTrash } from 'react-icons/io5'
import { useRouter } from 'next/navigation'
import { deletarUsuario, getFuncionarios, IUsuarioResponse } from '@/services/usuario-service'
import CustomInput from '@/components/CustomInput'
import maskCPF from '../../../utils/maskCPF'
import GridTable from '@/components/GridTable'
import { toaster } from '@/components/ui/toaster'

export interface IFuncionarios {
  id: number
  nome: string
  cargo: string
  cpf: string
  email: string
}
const FuncionariosRelatoriosPage = () => {
  const router = useRouter()
  const [isLoading, setIsLoading] = useState(true)
  const [funcionarios, setFuncionarios] = useState<IFuncionarios[]>([])
  const { setLoading } = useLoading()
  const { user } = useUserContext()
  const { setBreadcrumbs } = useBreadcrumb()
  const [currentPage, setCurrentPage] = useState(1)
  const [showDeleteModal, setShowDeleteModal] = useState(false)
  const [funcionarioToDelete, setFuncionarioToDelete] = useState<IFuncionarios | null>(null)
  const pageSize = 10

  useEffect(() => {
    setBreadcrumbs([
      { label: 'Início', path: '/home' },
      { label: 'Funcionários', path: '/funcionarios' }
    ])
  }, [setBreadcrumbs])

  useEffect(() => {
    if (user && user.cargo !== 'socio') {
      router.push('/home')
    }
  }, [user, router])

  const handlePush = (path: string) => {
    setLoading(true)
    setTimeout(() => {
      router.push(path)
      setLoading(false)
    }, 400)
  }

  const fetchFuncionarios = async () => {
    setIsLoading(true)

    getFuncionarios().then((data) => {
      const funcionarios = data
        .map((item: IUsuarioResponse) => ({
          id: item.id,
          nome: item.nome,
          cargo: item.cargo,
          cpf: item.cpf,
          email: item.email
        }))
        .sort((a, b) => {
          if (a.cargo === 'socio' && b.cargo !== 'socio') return -1
          if (a.cargo !== 'socio' && b.cargo === 'socio') return 1
          return a.cargo.localeCompare(b.cargo)
        })
      setFuncionarios(funcionarios)
      setIsLoading(false)
    })
  }

  const handleExcluirClick = (e: React.MouseEvent, funcionario: IFuncionarios) => {
    e.stopPropagation()
    setFuncionarioToDelete(funcionario)
    setShowDeleteModal(true)
  }

  const handleConfirmDelete = () => {
    if (!funcionarioToDelete) return

    deletarUsuario(funcionarioToDelete.id).then(() => {
      toaster.create({
        title: 'Sucesso',
        description: `Funcionário ${funcionarioToDelete.nome} excluído com sucesso.`,
        type: 'success'
      })
      fetchFuncionarios()
      setShowDeleteModal(false)
      setFuncionarioToDelete(null)
    }).catch(() => {
      toaster.create({
        title: 'Erro',
        description: `Falha ao excluir o funcionário ${funcionarioToDelete.nome}. Tente novamente.`,
        type: 'error'
      })
      setShowDeleteModal(false)
      setFuncionarioToDelete(null)
    })
  }

  const handleCancelDelete = () => {
    setShowDeleteModal(false)
    setFuncionarioToDelete(null)
  }

  useEffect(() => {
    fetchFuncionarios()
  }, [])
  return (
    <Flex direction='column' p={6} bg="#f4f8fb" minH="100vh" margin="0 auto">
      <Breadcrumb />
      <Text fontSize="2xl" fontWeight="bold" mb={6}>
        Funcionários
      </Text>
      <Flex gap="1rem" mb={4} >
        <CustomInput placeholder="Buscar funcionário..." isSearch />
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
        <GridTable<IFuncionarios>
                  columns={[
                    { key: 'nome', label: 'Nome', width: '2fr' },
                    { key: 'cpf', label: 'CPF', width: '1fr' },
                    { key: 'cargo', label: 'Cargo', width: '1fr' },
                    { key: 'actions', label: '', width: '120px', align: 'right' }
                  ]}
                  data={funcionarios}
                  onRowClick={(funcionario) => handlePush(`/visualizar-relatorio/${funcionario.id}`)}
                  renderCell={(funcionario, column) => {
                    if (column.key === 'cpf') return <Text>{maskCPF(funcionario.cpf)}</Text>
                    if (column.key === 'cargo') return <Text>{funcionario.cargo ?? 'Não informado'}</Text>
                    if (column.key === 'actions')
                      return (
                        <Flex gap={1}>
                          <IconButton
                            variant="ghost"
                            aria-label="Visualizar cliente"
                            size="sm"
                            onClick={(e) => {
                              e.stopPropagation()
                              handlePush(`/visualizar-relatorio/${funcionario.id}`)
                            }}
                          >
                            <IoEyeOutline />
                          </IconButton>
                          <IconButton
                            variant="ghost"
                            aria-label="Excluir cliente"
                            size="sm"
                            onClick={(e) => handleExcluirClick(e, funcionario)}
                            _hover={{ color: 'red.500' }}
                          >
                            <IoTrash />
                          </IconButton>
                        </Flex>
                      )
                    const key = column.key as keyof IFuncionarios
                    return <Text>{String(funcionario[key] ?? '')}</Text>
                  }}
                  emptyMessage="Nenhum cliente encontrado"
                />

      )}

      <Pagination.Root
        count={funcionarios.length}
        pageSize={pageSize}
        page={currentPage}
        onPageChange={(details) => setCurrentPage(details.page)}
        display="flex"
        justifyContent="flex-end"
        mt={4}
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

      <Dialog.Root open={showDeleteModal} onOpenChange={({ open }) => !open && handleCancelDelete()}       placement="center"
>
        <Portal>
          <Dialog.Backdrop />
          <Dialog.Positioner >
            <Dialog.Content maxW="md" p={6}>
              <Dialog.Header>
                <Dialog.Title fontSize="lg" fontWeight="bold">
                  Confirmar Exclusão
                </Dialog.Title>
                <Dialog.CloseTrigger asChild>
                  <CloseButton size="sm" onClick={handleCancelDelete} />
                </Dialog.CloseTrigger>
              </Dialog.Header>

              <Dialog.Body py={4}>
                <Text>
                  Tem certeza que deseja excluir o funcionário{' '}
                  <strong>{funcionarioToDelete?.nome}</strong>?
                </Text>
                <Text mt={2} fontSize="sm" color="gray.600">
                  Esta ação não pode ser desfeita.
                </Text>
              </Dialog.Body>

              <Dialog.Footer>
                <Flex gap={3} justify="flex-end">
                  <Button
                    variant="outline"
                    px={4}
                    onClick={handleCancelDelete}
                  >
                    Cancelar
                  </Button>
                  <Button
                    bg="red.500"
                    color="white"
                    onClick={handleConfirmDelete}
                    _hover={{ bg: 'red.600' }}
                    px={4}
                  >
                    Excluir
                  </Button>
                </Flex>
              </Dialog.Footer>
            </Dialog.Content>
          </Dialog.Positioner>
        </Portal>
      </Dialog.Root>
    </Flex>
  )
}

export default FuncionariosRelatoriosPage
