import { Dialog, Portal, CloseButton, Stack, Grid, Flex, Button, Box } from '@chakra-ui/react'
import CustomInput from '../CustomInput'
import { AtualizarCliente } from '../../../types/cliente'
import { useState } from 'react'
import maskCPF from '../../../utils/maskCPF'
import { maskTelefone } from '../../../utils/maskTelefone'
import { getCepInfo } from '@/services/cep-service'
import { atualizarCliente } from '@/services/cliente-service'
import { toaster } from '../ui/toaster'

type Props = {
  onClose: () => void
  cliente: AtualizarCliente
}
const ModalEditarCliente = ({ onClose, cliente }: Props) => {
  const [cepError, setCepError] = useState<boolean>(false)
  const [formData, setFormData] = useState({
    id: cliente.id,
    nome: cliente.nome || '',
    email: cliente.email || '',
    telefone: cliente.telefone || '',
    data_nascimento: cliente.data_nascimento || '',
    cpf: cliente.cpf || '',
    rg: cliente.rg || '',
    filiacao: cliente.filiacao || '',
    naturalidade: cliente.naturalidade || '',
    endereco: { ...cliente.endereco }
  })

  const handleInputChange = (field: string, value: string) => {
    if (field === 'telefone') {
      value = value.replace(/\D/g, '').slice(0, 11)
    }
    if (field === 'cpf') {
      value = value.replace(/\D/g, '')
    }
    if (field === 'cep') {
      const cepNumerico = value.replace(/\D/g, '')
      setFormData((prev) => ({
        ...prev,
        endereco: { ...prev.endereco, cep: cepNumerico }
      }))

      if (cepNumerico.length === 8) {
        getCepInfo(cepNumerico)
          .then((response) => {
            const data = response.data
            if (data.erro === 'true' || data.erro === true) {
              console.log('CEP não encontrado:', data)
              setFormData((prev) => ({
                ...prev,
                endereco: {
                  ...prev.endereco,
                  logradouro: '',
                  bairro: '',
                  cidade: '',
                  estado: '',
                  cep: cepNumerico
                }
              }))
              setCepError(true)
            } else {
              console.log('CEP encontrado:', data)
              setCepError(false)
              setFormData((prev) => ({
                ...prev,
                endereco: {
                  ...prev.endereco,
                  cep: cepNumerico,
                  logradouro: data.logradouro || '',
                  bairro: data.bairro || '',
                  cidade: data.localidade || '',
                  estado: data.uf || ''
                }
              }))
            }
          })
          .catch((error) => {
            console.log('Erro ao buscar informações do CEP:', error)
            setCepError(true)
          })
      } else {
        setCepError(false)
      }
      return
    }

    if (field.startsWith('endereco.')) {
      const enderecoField = field.replace('endereco.', '')
      setFormData((prev) => ({
        ...prev,
        endereco: { ...prev.endereco, [enderecoField]: value }
      }))
      return
    }

    setFormData((prev) => ({
      ...prev,
      [field]: value
    }))
  }
  const handleSubmit = () => {
    atualizarCliente(cliente.id, formData)
      .then(() => {
        toaster.create({
          description: 'Cliente atualizado com sucesso!',
          type: 'success'
        })
        onClose()
        window.location.reload()
      })
      .catch(() => {
        toaster.create({
          description: 'Falha ao atualizar o cliente. Por favor, tente novamente.',
          type: 'error'
        })
      })
  }
  return (
    <Dialog.Root open size="xl" placement="center">
      <Portal>
        <Dialog.Backdrop onClick={onClose} zIndex={1000} />
        <Dialog.Positioner zIndex={1001}>
          <Dialog.Content maxH="90vh" overflowY="auto" p={6} position="relative" zIndex={1002}>
            <Dialog.Header display="flex" justifyContent="space-between" alignItems="center" mb={4}>
              <Dialog.Title fontSize="xl" fontWeight="bold">
                Editar Cliente
              </Dialog.Title>
              <CloseButton size="sm" onClick={onClose} />
            </Dialog.Header>

            <Dialog.Body>
              <Stack gap={4}>
                <Grid gridTemplateColumns="1fr 1fr 1fr" gap={4}>
                  <CustomInput
                    label="Nome"
                    type="text"
                    value={formData.nome}
                    onChange={(e) => handleInputChange('nome', e.target.value)}
                  />
                  <CustomInput
                    label="Email"
                    type="email"
                    value={formData.email}
                    onChange={(e) => handleInputChange('email', e.target.value)}
                  />
                  <CustomInput
                    label="Telefone"
                    type="text"
                    placeholder="(DD) 9XXXX-XXXX"
                    value={maskTelefone(formData.telefone)}
                    onChange={(e) => handleInputChange('telefone', e.target.value)}
                  />
                  <CustomInput
                    label="Data de Nascimento"
                    type="date"
                    value={formData.data_nascimento}
                    onChange={(e) => handleInputChange('data_nascimento', e.target.value)}
                  />
                  <CustomInput
                    label="CPF"
                    type="text"
                    value={maskCPF(formData.cpf)}
                    onChange={(e) => handleInputChange('cpf', e.target.value)}
                  />
                  <CustomInput
                    label="RG"
                    type="text"
                    value={formData.rg}
                    onChange={(e) => handleInputChange('rg', e.target.value)}
                  />
                  <CustomInput
                    label="Filiação"
                    type="text"
                    value={formData.filiacao}
                    onChange={(e) => handleInputChange('filiacao', e.target.value)}
                  />
                  <CustomInput
                    label="Naturalidade"
                    type="text"
                    value={formData.naturalidade}
                    onChange={(e) => handleInputChange('naturalidade', e.target.value)}
                  />
                </Grid>
                <Box fontWeight="bold" mt={4} mb={2} borderBottom={'1px solid #E2E8F0'} pb={2}>
                  <strong>Endereço</strong>
                </Box>
                <Grid gridTemplateColumns={'1fr 1fr 1fr'} gap={4}>
                  <Box>
                    <CustomInput
                      label="CEP"
                      type="text"
                      value={formData.endereco.cep || ''}
                      onChange={(e) => handleInputChange('cep', e.target.value)}
                    />
                    {cepError && (
                      <Box color="red.500" fontSize="sm">
                        CEP inválido ou não encontrado.
                      </Box>
                    )}
                  </Box>
                  <CustomInput
                    label="Logradouro"
                    type="text"
                    value={formData.endereco.logradouro || ''}
                    onChange={(e) => handleInputChange('endereco.logradouro', e.target.value)}
                  />
                  <CustomInput
                    label="Número"
                    type="text"
                    value={formData.endereco.numero || ''}
                    onChange={(e) => handleInputChange('endereco.numero', e.target.value)}
                  />
                  <CustomInput
                    label="Complemento"
                    type="text"
                    value={formData.endereco.complemento || ''}
                    onChange={(e) => handleInputChange('endereco.complemento', e.target.value)}
                  />
                  <CustomInput
                    label="Bairro"
                    type="text"
                    value={formData.endereco.bairro || ''}
                    onChange={(e) => handleInputChange('endereco.bairro', e.target.value)}
                  />
                  <CustomInput
                    label="Cidade"
                    type="text"
                    value={formData.endereco.cidade || ''}
                    onChange={(e) => handleInputChange('endereco.cidade', e.target.value)}
                  />
                  <CustomInput
                    label="Estado"
                    type="text"
                    value={formData.endereco.estado || ''}
                    onChange={(e) => handleInputChange('endereco.estado', e.target.value)}
                  />
                </Grid>

                <Flex gap={3} mt={6} justify="flex-end">
                  <Button variant="outline" onClick={onClose} px={4}>
                    Cancelar
                  </Button>
                  <Button
                    bg="var(--primary)"
                    color="white"
                    onClick={handleSubmit}
                    px={4}
                    // loading={loading}
                  >
                    Salvar Alterações
                  </Button>
                </Flex>
              </Stack>
            </Dialog.Body>
          </Dialog.Content>
        </Dialog.Positioner>
      </Portal>
    </Dialog.Root>
  )
}

export default ModalEditarCliente
