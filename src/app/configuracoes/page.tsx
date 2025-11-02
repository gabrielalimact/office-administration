'use client'
import { Box, Button, Fieldset, Flex, Text, IconButton, VStack, Image } from '@chakra-ui/react'
import React, { useState, useEffect, useRef } from 'react'
import { MdOutlineEdit } from 'react-icons/md'
import { FaRegSave, FaCamera } from 'react-icons/fa'
import { useBreadcrumb } from '@/components/BreadcrumbContext'
import Breadcrumb from '@/components/Breadcrumb'
import { useUserContext } from '@/components/UserContext'
import { updateUsuario } from '@/services/usuario-service'
import { toaster } from '@/components/ui/toaster'
import { useAvatar } from '@/hooks/useAvatar'
import maskCPF from '../../../utils/maskCPF'
import CustomInput from '@/components/CustomInput'
import CustomRadioGroup from '@/components/CustomRadioGroup'

type UsuarioData = {
  id: number
  name: string
  cpf: string
  email: string
  cargo: string
  avatar?: string
}
const ConfiguracoesPage = () => {
  const { user, setUser } = useUserContext()
  const [editMode, setEditMode] = useState(false)
  const { setBreadcrumbs } = useBreadcrumb()
  const fileInputRef = useRef<HTMLInputElement>(null)
  const [avisoImagem, setAvisoImagem] = useState<string>(
    'Clique na foto ou no ícone para alterar (JPG, PNG, máximo 5MB)'
  )
  const [avatarFile, setAvatarFile] = useState<File | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const { avatarUrl: currentAvatarUrl } = useAvatar(user?.avatar)
  const [newAvatarPreview, setNewAvatarPreview] = useState<string>('')

  useEffect(() => {
    setBreadcrumbs([
      { label: 'Início', path: '/home' },
      { label: 'Configurações', path: '/configuracoes' }
    ])
  }, [setBreadcrumbs])

  const [usuario, setUsuario] = useState<UsuarioData>({
    id: user?.id || 0,
    name: user?.nome || '',
    cpf: user?.cpf || '',
    email: user?.email || '',
    cargo: user?.cargo || '',
    avatar: user?.avatar || ''
  })

  const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = event.target
    if (name === 'cpf') {
      const raw = value.replace(/\D/g, '')
      if (raw.length <= 11) {
        setUsuario((prev) => ({ ...prev, [name]: raw }))
      }
      return
    }
    setUsuario((prev) => ({ ...prev, [name]: value }))
  }

  const handleAvatarClick = () => {
    if (editMode && fileInputRef.current) {
      fileInputRef.current.click()
    }
  }

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (file) {
      if (!file.type.startsWith('image/')) {
        setAvisoImagem('Por favor, selecione apenas arquivos de imagem (JPG, PNG, GIF, etc.).')
        return
      }
      if (file.size > 5 * 1024 * 1024) {
        setAvisoImagem('O arquivo deve ter no máximo 5MB.')
        return
      }

      setAvatarFile(file)

      const previewUrl = URL.createObjectURL(file)
      setNewAvatarPreview(previewUrl)

      if (event.target) {
        event.target.value = ''
      }

      setAvisoImagem('')
    }
  }

  const handleSubmit = async () => {
    if (editMode) {
      setIsLoading(true)
      try {
        const result = await updateUsuario({
          id: usuario.id,
          nome: usuario.name,
          email: usuario.email,
          cargo: usuario.cargo,
          avatar: avatarFile || undefined
        })

        setUser({
          id: result.usuario.id,
          cpf: result.usuario.cpf || '',
          nome: result.usuario.nome || '',
          email: result.usuario.email || '',
          cargo: result.usuario.cargo || '',
          avatar: '/imagens/' + result.usuario.imagem.nome_arquivo || ''
        })

        toaster.create({
          title: 'Sucesso!',
          description: 'Dados atualizados com sucesso.',
          type: 'success',
          duration: 3000
        })

        setAvatarFile(null)

        if (newAvatarPreview && newAvatarPreview.startsWith('blob:')) {
          URL.revokeObjectURL(newAvatarPreview)
          setNewAvatarPreview('')
        }
      } catch (error) {
        console.error('Erro ao atualizar usuário:', error)

        toaster.create({
          title: 'Erro!',
          description: 'Não foi possível atualizar os dados. Tente novamente.',
          type: 'error',
          duration: 5000
        })

        setIsLoading(false)
        return
      }
      setIsLoading(false)
    }

    setEditMode(!editMode)
    setAvisoImagem('')
  }

  return (
    <Box p={6} bg="#f4f8fb" minH="100vh" margin="0 auto">
      <Breadcrumb />
      {/* Seção do Avatar */}
      <Flex gap={10}>
        <VStack align="center">
          <Box position="relative" display="inline-block">
            <Box
              w="120px"
              h="120px"
              borderRadius="full"
              overflow="hidden"
              cursor={editMode ? 'pointer' : 'default'}
              onClick={handleAvatarClick}
              transition="all 0.2s ease"
              _hover={
                editMode
                  ? {
                      transform: 'scale(1.05)',
                      filter: 'brightness(0.9)'
                    }
                  : {}
              }
              border="4px solid"
              borderColor="white"
              boxShadow="0 4px 12px rgba(0, 0, 0, 0.15)"
              bg="gray.200"
              display="flex"
              alignItems="center"
              justifyContent="center"
            >
              {newAvatarPreview || currentAvatarUrl ? (
                <Image
                  src={newAvatarPreview || currentAvatarUrl}
                  alt={usuario.name}
                  w="100%"
                  h="100%"
                  objectFit="cover"
                />
              ) : (
                <Text fontSize="2xl" fontWeight="bold" color="gray.500">
                  {usuario.name.charAt(0).toUpperCase()}
                </Text>
              )}
            </Box>
            {editMode && (
              <IconButton
                position="absolute"
                bottom="-2"
                right="-2"
                size="sm"
                borderRadius="full"
                bg="var(--primary)"
                color="white"
                _hover={{ bg: 'var(--primary)', opacity: 0.8 }}
                onClick={handleAvatarClick}
                aria-label="Alterar foto"
                boxShadow="0 2px 8px rgba(0, 0, 0, 0.2)"
              >
                <FaCamera />
              </IconButton>
            )}
          </Box>
          <Text fontSize="sm" color="gray.600" textAlign="center" maxW="200px">
            {editMode ? avisoImagem : ''}
          </Text>

          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            onChange={handleFileChange}
            style={{ display: 'none' }}
          />
        </VStack>

        <Box w="full">
          <Fieldset.Root>
            <Fieldset.Content display="flex" flexDir="column">
              <CustomInput
                label="Nome completo"
                name="name"
                value={usuario.name}
                onChange={handleInputChange}
                disabled={!editMode}
                mt={0}
              />
              <CustomInput
                label="CPF"
                name="cpf"
                value={maskCPF(usuario.cpf)}
                onChange={handleInputChange}
                disabled={!editMode}
                mt={0}
              />
              <CustomInput
                label="E-mail"
                name="email"
                value={usuario.email}
                onChange={handleInputChange}
                disabled={!editMode}
                mt={0}
              />

              <CustomRadioGroup
                value={usuario.cargo === 'socio' ? 'socio' : 'funcionario'}
                items={[
                  { label: 'Sócio(a)', value: 'socio' },
                  { label: 'Funcionário(a)', value: 'funcionario' }
                ]}
                onChange={(value) => {
                  const cargo = value === 'socio' ? 'socio' : 'funcionario'
                  setUsuario((prev) => ({ ...prev, cargo }))
                }}
                disabled={!editMode}
              />
            </Fieldset.Content>
          </Fieldset.Root>

          <Flex justifyContent="flex-end" mt={3}>
            <Button
              onClick={() => handleSubmit()}
              borderRadius="50px"
              fontWeight="bold"
              width="150px"
              bgColor={editMode ? 'green.500' : 'var(--primary)'}
              loading={isLoading}
              disabled={isLoading}
            >
              {editMode ? <FaRegSave /> : <MdOutlineEdit />}
              {editMode ? (isLoading ? 'Salvando...' : 'Salvar') : 'Editar'}
            </Button>
          </Flex>
        </Box>
      </Flex>
    </Box>
  )
}

export default ConfiguracoesPage
