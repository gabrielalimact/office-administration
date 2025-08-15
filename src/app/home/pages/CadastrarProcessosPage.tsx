"use client"
import { Button, ButtonGroup, Steps, Text, Flex, Field, Fieldset, Input, Textarea, Box, FileUpload, Icon, List } from '@chakra-ui/react';
import { useState } from "react"
import { LuUpload, LuCheckCheck } from 'react-icons/lu';

const CadastrarProcessosPage = () => {
  const [stepActive, setStepActive] = useState(0)

  const handleStepChange = (e: { step: number }) => {
    setStepActive(e.step);
  }

  return (
    <Steps.Root defaultStep={1} step={stepActive}
      onStepChange={(e) => handleStepChange(e)}
      count={steps.length}>
      <Steps.List mb={5}>
        {steps.map((step, index) => (
          <Steps.Item key={index} index={index} title={step.title}>
            <Steps.Indicator
              bgColor={stepActive === index ? "var(--darkblue)" : stepActive > index ? "green" : ""}
              color={stepActive === index ? "white" : ""} />
            <Steps.Title>{step.title}</Steps.Title>
            <Steps.Separator />
          </Steps.Item>
        ))}
      </Steps.List>

      {steps.map((step, index) => (
        <Steps.Content key={index} index={index} p="0 20px" height="50vh">
          {step.description}
        </Steps.Content>
      ))}
      <Steps.CompletedContent>
        <Flex justifyContent="center" alignItems="center" flexDir="column" fontSize="3xl">
        <LuCheckCheck size={48} />
        O processo foi salvo!
        </Flex>
      </Steps.CompletedContent>


      <ButtonGroup size="lg" variant="solid" p="0 20px" justifyContent="space-between">
        <Steps.PrevTrigger asChild>
          <Button bgColor="var(--primary)" w="100px">Voltar</Button>
        </Steps.PrevTrigger>
        {stepActive !== steps.length && (
        <Steps.NextTrigger asChild>
            <Button bgColor="var(--primary)" w="100px">
            {stepActive < steps.length - 1 ? 'Próximo' : stepActive === steps.length - 1 ? 'Salvar' : 'Finalizado'}
            </Button>
        </Steps.NextTrigger>
)}
      </ButtonGroup>
    </Steps.Root>
  )
};

export default CadastrarProcessosPage;

const steps = [
  {
    title: "Informações do cliente",
    description: (
      <Fieldset.Root minW="full" flex={1} gap="12px" >
        <Fieldset.Content display="flex" gap="12px" flexDir="row">
          <Field.Root required minW="70%">
            <Field.Label fontWeight="bold">Nome completo</Field.Label>
            <Input p="12px" name="name" />
          </Field.Root>

          <Field.Root required>
            <Field.Label fontWeight="bold">Data de nascimento</Field.Label>
            <Input p="12px" name="birthdate" type="date" />
          </Field.Root>
        </Fieldset.Content>
        <Fieldset.Content display="grid" gridTemplateColumns="1fr 1fr" gap="12px">
          <Field.Root required>
            <Field.Label fontWeight="bold">CPF</Field.Label>
            <Input p="12px" name="cpf" />
          </Field.Root>

          <Field.Root required>
            <Field.Label fontWeight="bold">RG</Field.Label>
            <Input p="12px" name="rg" />
          </Field.Root>

          <Field.Root>
            <Field.Label fontWeight="bold">Filiação</Field.Label>
            <Input p="12px" name="filiation" />
          </Field.Root>

          <Field.Root>
            <Field.Label fontWeight="bold">Colaborador</Field.Label>
            <Input p="12px" name="collaborator" />
          </Field.Root>
        </Fieldset.Content>
        <Fieldset.Content display="grid" gridTemplateColumns="1fr 1fr 1fr" gap="12px">
          <Field.Root>
            <Field.Label fontWeight="bold">Logradouro</Field.Label>
            <Input p="12px" name="street" />
          </Field.Root>
          <Field.Root>
            <Field.Label fontWeight="bold">Número</Field.Label>
            <Input p="12px" name="number" />
          </Field.Root>
          <Field.Root>
            <Field.Label fontWeight="bold">Bairro</Field.Label>
            <Input p="12px" name="neighborhood" />
          </Field.Root>
        </Fieldset.Content>
        <Fieldset.Content display="grid" gridTemplateColumns="1fr 1fr" gap="12px">
          <Field.Root>
            <Field.Label fontWeight="bold">Cidade</Field.Label>
            <Input p="12px" name="city" />
          </Field.Root>
          <Field.Root>
            <Field.Label fontWeight="bold">Estado</Field.Label>
            <Input p="12px" name="state" />
          </Field.Root>

        </Fieldset.Content>
      </Fieldset.Root>
    )
  },
  {
    title: "Adicionar observações",
    description: (
      <Fieldset.Root minW="full" flex={1} gap="12px" >
        <Fieldset.Content display="flex" gap="12px" flexDir="row">
          <Field.Root required minW="70%">
            <Field.Label fontWeight="bold">Observações</Field.Label>
            <Textarea p="12px" name="observations" height={250} fontSize={18}/>
          </Field.Root>
        </Fieldset.Content>
      </Fieldset.Root>
    ),
  },
  {
    title: "Envio de documentos",
    description: (
      <Box>
        <Text fontWeight="semibold" mb={5}>Documentos necessários</Text>
        <List.Root p="0 30px" mb={5} display="grid" gridTemplateColumns="repeat(3, 1fr)" gap="12px">
          <List.Item>Documento 1</List.Item>
          <List.Item>Documento 2</List.Item>
          <List.Item>Documento 3</List.Item>
          <List.Item>Documento 1</List.Item>
          <List.Item>Documento 2</List.Item>
          <List.Item>Documento 3</List.Item>
          <List.Item>Documento 1</List.Item>
          <List.Item>Documento 2</List.Item>
          <List.Item>Documento 3</List.Item>
        </List.Root>
        <FileUpload.Root minW="full" alignItems="stretch" maxFiles={10} >
          <FileUpload.HiddenInput />
          <FileUpload.Dropzone>
            <Icon size="md" color="fg.muted">
              <LuUpload />
            </Icon>
            <FileUpload.DropzoneContent>
              <Box>Clique aqui para anexar os arquivos no OneDrive</Box>
              <Box color="fg.muted">.png, .jpg, .pdf</Box>
            </FileUpload.DropzoneContent>
          </FileUpload.Dropzone>
          <FileUpload.List />
        </FileUpload.Root>
    </Box>
    ),
  },
]