'use client'

import { useEffect, useState } from 'react'
import {
  Box,
  Flex,
  Text,
  Stack,
  Button,
  Spinner,
  Portal,
  Dialog,
  CloseButton,
  Grid,
  FileUpload,
  HStack,
  VStack,
  Icon
} from '@chakra-ui/react'
import { LuFile, LuUpload } from 'react-icons/lu'
import { toaster } from '@/components/ui/toaster'
import {
  getBeneficios,
  getStatus,
  getTipoAgendamento,
  updateProcesso
} from '@/services/processo-service'
import { Beneficio, Status, Agendamento } from '../../../types/processos'
import { Cliente } from '../../../types/cliente'
import { CustomSelect, SelectOption } from '@/components/CustomSelect'
import CustomInput from '@/components/CustomInput'
import CustomCheckbox from '@/components/CustomCheckbox'

interface ModalEditarProcessoProps {
  proc: Cliente['processos'][0]
  onClose: () => void
  onUpdate: (processo: Cliente['processos'][0]) => void
}

export const ModalEditarProcesso = ({ proc, onClose, onUpdate }: ModalEditarProcessoProps) => {
  const [formData, setFormData] = useState({
    beneficio: proc.beneficio?.id || 0,
    status: proc.status?.id || 0,
    olhar_inss: proc.olhar_inss || false,
    olhar_pje_creta: proc.olhar_pje_creta || false,
    senha_inss: proc.senha_inss || '',
    data_cadastro: proc.data_cadastro ? proc.data_cadastro.split('T')[0] : '',
    observacoes: proc.observacoes || '',
    tipo_agendamento: proc.tipo_agendamento?.id || 0,
    data_agendamento: proc.data_agendamento ? proc.data_agendamento.split('T')[0] : ''
  })

  const [beneficios, setBeneficios] = useState<SelectOption[]>([])
  const [tipoAgendamentoOptions, setTipoAgendamentoOptions] = useState<SelectOption[]>([])
  const [statusOptions, setStatusOptions] = useState<SelectOption[]>([])
  const [loading, setLoading] = useState(false)
  const [files, setFiles] = useState<File[]>([])

  const handleFileChange = (details: FileUpload.FileChangeDetails) => {
    const accepted = details?.acceptedFiles ?? []
    setFiles(accepted)
  }

  const removeFile = (name: string) => {
    const updated = files.filter((f) => f.name !== name)
    setFiles(updated)
  }

  useEffect(() => {
    const fetchOptions = async () => {
      try {
        const [beneficiosData, statusData, tipoAgendamentoData] = await Promise.all([
          getBeneficios(),
          getStatus(),
          getTipoAgendamento()
        ])
        setBeneficios(
          beneficiosData.map((b: Beneficio) => ({
            label: b.nome,
            value: b.id.toString()
          }))
        )

        setStatusOptions(
          statusData.map((s: Status) => ({
            label: s.nome,
            value: s.id.toString()
          }))
        )

        setTipoAgendamentoOptions(
          tipoAgendamentoData.map((t: Agendamento) => ({
            label: t.nome,
            value: t.id.toString()
          }))
        )
      } catch (error) {
        console.error('Erro ao carregar opções:', error)
      }
    }

    fetchOptions()
  }, [])

  const handleInputChange = (field: string, value: any) => {
    if (Array.isArray(value) && value.length === 0) {
      if (field === 'tipo_agendamento') {
        setFormData((prev) => ({ ...prev, [field]: 0 }))
        return
      }
    }
    
    if (Array.isArray(value) && value.length > 0) {
      const processedValue = parseInt(value[0])
      setFormData((prev) => ({ ...prev, [field]: processedValue }))
      return
    }
    
    if ((field === 'data_cadastro' || field === 'data_agendamento') && value === '') {
      setFormData((prev) => ({ ...prev, [field]: '' }))
      return
    }
    
    setFormData((prev) => ({ ...prev, [field]: value }))
  }

  const handleSubmit = async () => {
    setLoading(true)
    try {
      const updatedProcesso = {
        ...proc,
        beneficio: beneficios.find((b) => b.value === formData.beneficio.toString())?.label
          ? {
              id: formData.beneficio,
              nome: beneficios.find((b) => b.value === formData.beneficio.toString())?.label || ''
            }
          : proc.beneficio,
        status: statusOptions.find((s) => s.value === formData.status.toString())?.label
          ? {
              id: formData.status,
              nome: statusOptions.find((s) => s.value === formData.status.toString())?.label || ''
            }
          : proc.status,
          
        tipo_agendamento: formData.tipo_agendamento === 0 
          ? null 
          : tipoAgendamentoOptions.find((t) => t.value === formData.tipo_agendamento.toString())?.label
            ? {
                id: formData.tipo_agendamento,
                nome: tipoAgendamentoOptions.find((s) => s.value === formData.tipo_agendamento.toString())?.label || ''
              }
            : proc.tipo_agendamento,
        data_agendamento: formData.data_agendamento || null,
        olhar_inss: formData.olhar_inss,
        olhar_pje_creta: formData.olhar_pje_creta,
        senha_inss: formData.senha_inss,
        data_cadastro: formData.data_cadastro || new Date().toISOString().split('T')[0],
        observacoes: formData.observacoes,
        data_ultima_atualizacao: new Date().toISOString()
      }

      onUpdate(updatedProcesso)
      const payload = { ...updatedProcesso } as any
      if (payload.cliente) delete payload.cliente
      
      if (formData.tipo_agendamento === 0) {
        payload.tipo_agendamento = null
      }
      
      if (!formData.data_cadastro || formData.data_cadastro === '') {
        payload.data_cadastro = null
      }
      
      if (!formData.data_agendamento || formData.data_agendamento === '') {
        payload.data_agendamento = null
      }
      
      console.log('Payload enviado:', payload)
      updateProcesso(proc.id, payload)
        .then(() => {
          onClose()
          toaster.create({
            title: 'Processo atualizado',
            description: 'O processo foi atualizado com sucesso.',
            type: 'success'
          })
        })
        .catch(() => {
          toaster.create({
            title: 'Erro ao atualizar',
            description: 'Não foi possível atualizar o processo.',
            type: 'error'
          })
        })
    } catch (error) {
      toaster.create({
        title: 'Erro ao atualizar',
        description: 'Não foi possível atualizar o processo.',
        type: 'error'
      })
    } finally {
      setLoading(false)
    }
  }

  return (
    <Dialog.Root open size="lg" placement="center">
      <Portal>
        <Dialog.Backdrop onClick={onClose} zIndex={1000} />
        <Dialog.Positioner zIndex={1001}>
          <Dialog.Content maxH="90vh" overflowY="auto" p={6} position="relative" zIndex={1002}>
            <Dialog.Header display="flex" justifyContent="space-between" alignItems="center" mb={4}>
              <Dialog.Title fontSize="xl" fontWeight="bold">
                Editar Processo #{proc.id}
              </Dialog.Title>
              <CloseButton size="sm" onClick={onClose} />
            </Dialog.Header>

            <Dialog.Body>
              <Stack gap={4}>
                <Grid templateColumns="1fr 1fr" gap={4}>
                  <CustomSelect
                    label="Benefício"
                    placeholder="Selecione o benefício"
                    options={beneficios}
                    value={[formData.beneficio.toString()]}
                    onValueChange={(value) => handleInputChange('beneficio', value)}
                    isRequired
                    disabled
                    portalled={false}
                  />
                  <CustomSelect
                    label="Situação"
                    placeholder="Selecione a situação"
                    options={statusOptions}
                    value={[formData.status.toString()]}
                    onValueChange={(value) => handleInputChange('status', value)}
                    isRequired
                    disabled
                    portalled={false}
                  />
                  <CustomInput
                  label="Data do Cadastro"
                  type="date"
                  value={formData.data_cadastro}
                  onChange={(e) => handleInputChange('data_cadastro', e.target.value)}
                />
                <CustomInput
                  label="Senha INSS"
                  placeholder="Digite a senha do INSS"
                  value={formData.senha_inss}
                  onChange={(e) => handleInputChange('senha_inss', e.target.value)}
                  disabled={formData.olhar_inss === false}
                />
                </Grid>

                
                <Flex gap={6}>
                  <CustomCheckbox
                    label="Olhar INSS"
                    isChecked={formData.olhar_inss}
                    onChange={() => handleInputChange('olhar_inss', !formData.olhar_inss)}
                  />

                  <CustomCheckbox
                    label="Olhar PJE/CRETA"
                    isChecked={formData.olhar_pje_creta}
                    onChange={() => handleInputChange('olhar_pje_creta', !formData.olhar_pje_creta)}
                  />
                </Flex>

                <Grid gap={2} gridTemplateColumns={{ base: '1fr', md: '1.8fr 1fr' }}>
                  <CustomSelect
                    label="Agendamento"
                    placeholder="Selecione o tipo"
                    options={tipoAgendamentoOptions}
                    value={formData.tipo_agendamento === 0 ? [] : [formData.tipo_agendamento.toString()]}
                    onValueChange={(value) => handleInputChange('tipo_agendamento', value)}
                    portalled={false}
                  />
                  <CustomInput
                    label="Data do Agendamento"
                    type="date"
                    value={formData.data_agendamento}
                    onChange={(e) => handleInputChange('data_agendamento', e.target.value)}
                  />
                </Grid>
                <CustomInput
                  label="Observações"
                  placeholder="Digite as observações"
                  value={formData.observacoes}
                  onChange={(e) => handleInputChange('observacoes', e.target.value)}
                  isTextArea
                />
                <FileUpload.Root
                  alignItems="stretch"
                  onFileChange={(details) => handleFileChange(details)}
                  maxFiles={10}
                >
                  <FileUpload.HiddenInput />
                  <FileUpload.Dropzone style={{ border: '1px dashed', borderColor: 'black' }}>
                    <Icon size="md" color="fg.muted">
                      <LuUpload />
                    </Icon>
                    <FileUpload.DropzoneContent>
                      <Box>Clique aqui para anexar os arquivos</Box>
                      <Box color="fg.muted">.png, .jpg, .pdf</Box>
                    </FileUpload.DropzoneContent>
                  </FileUpload.Dropzone>

                  {files.length > 0 && (
                    <VStack align="stretch" gap={2}>
                      {files.map((file) => (
                        <HStack
                          key={file.name}
                          justify="space-between"
                          p={2}
                          bg="white"
                          borderRadius="md"
                          boxShadow="sm"
                        >
                          <HStack>
                            <Icon as={LuFile} color="blue.500" />
                            <Box>
                              <Text fontSize="sm">{file.name}</Text>
                              <Text fontSize="xs" color="gray.500">
                                {(file.size / 1048576).toFixed(1)} MB
                              </Text>
                            </Box>
                          </HStack>
                          <CloseButton size="sm" onClick={() => removeFile(file.name)} />
                        </HStack>
                      ))}
                    </VStack>
                  )}
                </FileUpload.Root>

                <Flex gap={3} mt={6} justify="flex-end">
                  <Button variant="outline" onClick={onClose} px={4}>
                    Cancelar
                  </Button>
                  <Button
                    bg="var(--primary)"
                    color="white"
                    onClick={handleSubmit}
                    px={4}
                    loading={loading}
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

export default ModalEditarProcesso
