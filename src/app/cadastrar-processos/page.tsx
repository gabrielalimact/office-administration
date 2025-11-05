'use client'
import { Button, ButtonGroup, Steps, Text, Flex, Box } from '@chakra-ui/react'
import { useState, useEffect, Suspense } from 'react'
import { LuCheckCheck } from 'react-icons/lu'
import { useBreadcrumb } from '@/components/BreadcrumbContext'
import Breadcrumb from '@/components/Breadcrumb'
import { useUserContext } from '@/components/UserContext'
import { useRouter, useSearchParams } from 'next/navigation'
import { toaster } from '@/components/ui/toaster'
import { ProcessoData } from '@/types/step-forms'
import { ClienteStep, ProcessoStep, DocumentosStep, PreviewStep } from '@/components/Steps'
import {
  criarProcessoComNovoCliente,
  criarProcessoParaClienteExistente
} from '@/services/processo-service'
import { createZipFile } from '@/utils/zip'

const CadastrarProcessosContent = () => {
  const { user } = useUserContext()
  const router = useRouter()
  const searchParams = useSearchParams()
  const [stepActive, setStepActive] = useState(0)
  const { setBreadcrumbs } = useBreadcrumb()

  useEffect(() => {
    setBreadcrumbs([
      { label: 'Início', path: '/home' },
      { label: 'Cadastrar Processos', path: '/cadastrar-processos' }
    ])
  }, [setBreadcrumbs])

  useEffect(() => {
    const clienteId = searchParams.get('clienteId')
    if (clienteId) {
      setFormData((prev) => ({
        ...prev,
        cliente: {
          id: parseInt(clienteId),
          nome: searchParams.get('clienteNome') || '',
          cpf: searchParams.get('clienteCpf') || '',
          rg: searchParams.get('clienteRg') || '',
          data_nascimento: searchParams.get('clienteDataNascimento') || '',
          filiacao: searchParams.get('clienteFiliacao') || '',
          naturalidade: searchParams.get('clienteNaturalidade') || '',
          endereco: {
            cep: searchParams.get('endereco_cep') || '',
            logradouro: searchParams.get('endereco_logradouro') || '',
            numero: searchParams.get('endereco_numero') || '',
            bairro: searchParams.get('endereco_bairro') || '',
            complemento: searchParams.get('endereco_complemento') || '',
            cidade: searchParams.get('endereco_cidade') || '',
            estado: searchParams.get('endereco_estado') || ''
          }
        }
      }))
    }
  }, [searchParams])

  const [formData, setFormData] = useState<ProcessoData>({
    cliente: {
      id: 0,
      nome: '',
      cpf: '',
      rg: '',
      data_nascimento: '',
      filiacao: '',
      naturalidade: '',
      endereco: {
        cep: '',
        logradouro: '',
        numero: '',
        bairro: '',
        complemento: '',
        cidade: '',
        estado: ''
      }
    },
    colaboradorId: user ? user.id : 0,
    beneficio: { id: 0 },
    olhar_inss: false,
    olhar_pje_creta: false,
    data_cadastro: new Date().toISOString().split('T')[0],
    senha_inss: '',
    status: { id: 0 }
  })

  const handleStepChange = (e: { step: number }) => {
    setStepActive(e.step)
  }

  const handleDataChange = (newData: Partial<ProcessoData>) => {
    setFormData((prev) => ({
      ...prev,
      ...newData
    }))
  }

  const validateStep1 = () => {
    if (!formData.cliente.nome.trim()) {
      toaster.create({
        title: 'Campo obrigatório',
        description: 'Nome do cliente é obrigatório.',
        type: 'error',
        duration: 3000
      })
      return false
    }
    if (!formData.cliente.cpf.trim()) {
      toaster.create({
        title: 'Campo obrigatório',
        description: 'CPF do cliente é obrigatório.',
        type: 'error',
        duration: 3000
      })
      return false
    }
    if (formData.cliente.cpf.replace(/\D/g, '').length !== 11) {
      toaster.create({
        title: 'CPF inválido',
        description: 'CPF deve conter 11 dígitos.',
        type: 'error',
        duration: 3000
      })
      return false
    }
    return true
  }

  const validateStep2 = () => {
    if (!formData.beneficio.id || formData.beneficio.id === 0) {
      toaster.create({
        title: 'Campo obrigatório',
        description: 'Selecione um benefício para continuar.',
        type: 'error',
        duration: 3000
      })
      return false
    }
    if (!formData.status.id || formData.status.id === 0) {
      toaster.create({
        title: 'Campo obrigatório',
        description: 'Selecione uma situação para continuar.',
        type: 'error',
        duration: 3000
      })
      return false
    }
    return true
  }

  const handleNextStep = () => {
    let canProceed = true

    switch (stepActive) {
      case 0:
        canProceed = validateStep1()
        break
      case 1:
        canProceed = validateStep2()
        break
      case 2:
      case 3:
        canProceed = true
        break
      default:
        canProceed = true
    }

    if (canProceed) {
      if (stepActive === steps.length - 1) {
        handleSubmit()
      } else {
        setStepActive((prev) => prev + 1)
      }
    }
  }

  const handleSubmit = async () => {
    try {
      if (!formData.cliente.nome || !formData.cliente.cpf) {
        toaster.create({
          title: 'Erro de validação',
          description: 'Nome e CPF são obrigatórios.',
          type: 'error',
          duration: 5000
        })
        return
      }

      let arquivoFinal = null

      if (formData.files && formData.files.length > 1) {
        toaster.create({
          title: 'Compactando arquivos...',
          description: 'Criando arquivo ZIP dos documentos.',
          type: 'info',
          duration: 3000
        })

        arquivoFinal = await createZipFile(formData.files)

        if (arquivoFinal) {
          toaster.create({
            title: 'Arquivos compactados',
            description: `${formData.files.length} arquivos foram compactados em ${arquivoFinal.name}`,
            type: 'success',
            duration: 3000
          })
        }
      } else if (formData.files && formData.files.length === 1) {
        arquivoFinal = formData.files[0]
      }
      setStepActive(steps.length)

      const isClienteExistente = formData.cliente.id > 0

      if (isClienteExistente) {
        await criarProcessoParaClienteExistente(formData.cliente.id, {
          statusId: formData.status.id,
          tipoAgendamentoId: null,
          beneficioId: formData.beneficio.id,
          colaboradorId: formData.colaboradorId,
          olhar_inss: formData.olhar_inss,
          olhar_pje_creta: formData.olhar_pje_creta,
          data_cadastro: formData.data_cadastro,
          data_ultima_atualizacao: new Date().toISOString().split('T')[0],
          senha_inss: formData.senha_inss,
          observacoes: formData.observacoes,
          arquivo: arquivoFinal || undefined
        })
      } else {
        await criarProcessoComNovoCliente({
          cliente: {
            nome: formData.cliente.nome,
            data_nascimento: formData.cliente.data_nascimento,
            cpf: formData.cliente.cpf,
            rg: formData.cliente.rg,
            filiacao: formData.cliente.filiacao,
            naturalidade: formData.cliente.naturalidade,
            endereco: {
              logradouro: formData.cliente.endereco.logradouro,
              numero: formData.cliente.endereco.numero,
              complemento: formData.cliente.endereco.complemento,
              bairro: formData.cliente.endereco.bairro,
              cidade: formData.cliente.endereco.cidade,
              estado: formData.cliente.endereco.estado,
              cep: formData.cliente.endereco.cep
            }
          },
          colaboradorId: formData.colaboradorId,
          beneficio: formData.beneficio,
          olhar_inss: formData.olhar_inss,
          olhar_pje_creta: formData.olhar_pje_creta,
          data_cadastro: formData.data_cadastro,
          data_ultima_atualizacao: new Date().toISOString().split('T')[0],
          status: formData.status,
          senha_inss: formData.senha_inss,
          observacoes: formData.observacoes,
          arquivo: arquivoFinal || undefined
        })
      }

      toaster.create({
        title: 'Sucesso',
        description: `O processo do cliente ${formData.cliente.nome} foi criado com sucesso.`,
        type: 'success',
        duration: 5000
      })
    } catch (error) {
      console.error('Erro na requisição:', error)

      toaster.create({
        title: 'Erro de conexão',
        description: 'Verifique sua conexão e tente novamente.',
        type: 'error',
        duration: 5000
      })
    }
  }

  const steps = [
    {
      title: 'Informações do cliente',
      component: <ClienteStep data={formData} onDataChange={handleDataChange} />
    },
    {
      title: 'Informações do processo',
      component: <ProcessoStep data={formData} onDataChange={handleDataChange} />
    },
    {
      title: 'Envio de documentos',
      component: <DocumentosStep data={formData} onDataChange={handleDataChange} />
    },
    {
      title: 'Revisar informações',
      component: <PreviewStep data={formData} onDataChange={handleDataChange} />
    }
  ]

  return (
    <Box p={6} bg="#f4f8fb" minH="100vh" margin="0 auto">
      <Breadcrumb />
      <Text fontSize="2xl" fontWeight="bold" mb={4}>
        Cadastrar Novo Processo
      </Text>
      <Steps.Root
        defaultStep={1}
        step={stepActive}
        onStepChange={(e) => handleStepChange(e)}
        count={steps.length}
      >
        <Steps.List mb={3} mt={3}>
          {steps.map((step, index) => (
            <Steps.Item key={index} index={index} title={step.title}>
              <Steps.Indicator
                bgColor={
                  stepActive === index
                    ? 'var(--primary)'
                    : stepActive > index
                      ? '#556B2F'
                      : undefined
                }
                color={stepActive === index || stepActive > index ? 'white' : undefined}
              />
              <Steps.Title>{step.title}</Steps.Title>
              <Steps.Separator />
            </Steps.Item>
          ))}
        </Steps.List>

        {steps.map((step, index) => (
          <Steps.Content key={index} index={index} minHeight="50vh">
            {step.component}
          </Steps.Content>
        ))}
        <Steps.CompletedContent>
          <Flex justifyContent="center" alignItems="center" flexDir="column" fontSize="3xl">
            <LuCheckCheck size={48} />O processo foi salvo!
          </Flex>
        </Steps.CompletedContent>

        {stepActive === steps.length ? (
          <ButtonGroup size="lg" variant="solid" justifyContent="center">
            <Button bgColor="var(--primary)" w="200px" onClick={() => router.push('/processos')}>
              Ver Processos
            </Button>
          </ButtonGroup>
        ) : (
          <ButtonGroup size="lg" variant="solid" justifyContent="space-between">
            <Steps.PrevTrigger asChild>
              <Button bgColor="var(--primary)" w="100px">
                Voltar
              </Button>
            </Steps.PrevTrigger>
            {stepActive !== steps.length && (
              <Button bgColor="var(--primary)" w="100px" onClick={handleNextStep}>
                {stepActive < steps.length - 1
                  ? 'Próximo'
                  : stepActive === steps.length - 1
                    ? 'Salvar'
                    : 'Finalizado'}
              </Button>
            )}
          </ButtonGroup>
        )}
      </Steps.Root>
    </Box>
  )
}

const CadastrarProcessosPage = () => {
  return (
    <Suspense fallback={<Box p={6}>Carregando...</Box>}>
      <CadastrarProcessosContent />
    </Suspense>
  )
}

export default CadastrarProcessosPage
