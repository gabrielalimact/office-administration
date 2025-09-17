'use client';
import {
  Button,
  ButtonGroup,
  Steps,
  Text,
  Flex,
  Field,
  Fieldset,
  Input,
  Textarea,
  Box,
  FileUpload,
  Icon,
  List,
  Portal,
  Select,
  createListCollection,
  Checkbox,
  CloseButton,
} from '@chakra-ui/react';
import { CheckedChangeDetails } from '@zag-js/checkbox';
import { JSX, useState } from 'react';
import { LuUpload, LuCheckCheck } from 'react-icons/lu';

interface IProcessos {
  name: string;
  birthdate: string;
  cpf: string;
  rg: string;
  filiation: string;
  collaborator: string;
  street: string;
  number: string;
  neighborhood: string;
  city: string;
  state: string;
  naturalidade: string;
  beneficio: string;
  olharMeuInss: boolean;
  olharPje: boolean;
  status:
    | 'ARQUIVADO'
    | 'EM ANDAMENTO'
    | 'FINALIZADO'
    | 'REMARCADO'
    | 'CANCELADO'
    | 'CONCEDIDO'
    | 'FAZER EXAMES'
    | 'FAZER ATESTADO'
    | 'PEGAR SENHA'
    | 'FEITO PJE'
    | 'FEITO SAG';
  senhaInss: string;
  dataAtendimento: string;
  observations: string;
  files: unknown[];
}

interface StepRenderProps {
  formData: IProcessos;
  handleInputChange: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => void;
  handleSelectChange?: (value: { value: string[] }) => void;
  handleCheckboxChange?: (name: string, checked: CheckedChangeDetails) => void;
}

const CadastrarProcessosPage = () => {
  const [stepActive, setStepActive] = useState(0);
  const [formData, setFormData] = useState<IProcessos>({
    name: '',
    birthdate: '',
    cpf: '',
    rg: '',
    filiation: '',
    collaborator: '',
    street: '',
    number: '',
    neighborhood: '',
    city: '',
    state: '',
    naturalidade: '',
    beneficio: '',
    olharMeuInss: false,
    olharPje: false,
    status: 'EM ANDAMENTO',
    senhaInss: '',
    dataAtendimento: '',
    observations: '',
    files: [],
  });

  const handleStepChange = (e: { step: number }) => {
    setStepActive(e.step);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSelectChange = (value: { value: string[] }) => {
    setFormData((prev) => ({ ...prev, beneficio: value.value[0] }));
  };

  const handleCheckboxChange = (name: string, checked: CheckedChangeDetails) => {
    setFormData((prev) => ({ ...prev, [name]: checked.checked }));
  };

  const handleSubmit = () => {
    console.log('Objeto para backend:', formData);
  };

  return (
    <Box p={6} bg="#f4f8fb" minH="100vh" margin="0 auto">
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
                  stepActive === index ? 'var(--darkblue)' : stepActive > index ? 'green' : ''
                }
                color={stepActive === index ? 'white' : ''}
              />
              <Steps.Title>{step.title}</Steps.Title>
              <Steps.Separator />
            </Steps.Item>
          ))}
        </Steps.List>

        {steps.map((step, index) => (
          <Steps.Content key={index} index={index} minHeight="50vh">
            {step.render({
              formData,
              handleInputChange,
              handleSelectChange,
              handleCheckboxChange,
            })}
          </Steps.Content>
        ))}
        <Steps.CompletedContent>
          <Flex justifyContent="center" alignItems="center" flexDir="column" fontSize="3xl">
            <LuCheckCheck size={48} />O processo foi salvo!
          </Flex>
        </Steps.CompletedContent>

        <ButtonGroup size="lg" variant="solid" justifyContent="space-between">
          <Steps.PrevTrigger asChild>
            <Button bgColor="var(--primary)" w="100px">
              Voltar
            </Button>
          </Steps.PrevTrigger>
          {stepActive !== steps.length && (
            <Steps.NextTrigger asChild>
              <Button bgColor="var(--primary)" w="100px" onClick={handleSubmit}>
                {stepActive < steps.length - 1
                  ? 'Próximo'
                  : stepActive === steps.length - 1
                    ? 'Salvar'
                    : 'Finalizado'}
              </Button>
            </Steps.NextTrigger>
          )}
        </ButtonGroup>
      </Steps.Root>
    </Box>
  );
};

export default CadastrarProcessosPage;
const beneficios = createListCollection({
  items: [
    { label: 'LOAS/87', value: 'loas-87' },
    { label: 'LOAS/88', value: 'loas-88' },
    { label: 'Pensão por morte urbana ou rural', value: 'pensao-morte' },
    { label: 'Aposentadorias', value: 'aposentadorias' },
    { label: 'Auxílio doença', value: 'auxilio-doenca' },
  ],
});

const status = createListCollection({
  items: [
    { label: 'ARQUIVADO', value: 'arquivado' },
    { label: 'EM ANDAMENTO', value: 'em-andamento' },
    { label: 'FINALIZADO', value: 'finalizado' },
    { label: 'REMARCADO', value: 'remarcado' },
    { label: 'CANCELADO', value: 'cancelado' },
    { label: 'CONCEDIDO', value: 'concedido' },
    { label: 'FAZER EXAMES', value: 'fazer-exames' },
    { label: 'FAZER ATESTADO', value: 'fazer-atestado' },
    { label: 'PEGAR SENHA', value: 'pegar-senha' },
    { label: 'FEITO PJE', value: 'feito-pje' },
    { label: 'FEITO SAG', value: 'feito-sag' },
  ],
});

const steps: {
  title: string;
  render: (props: StepRenderProps) => JSX.Element;
}[] = [
  {
    title: 'Informações do cliente',
    render: ({ formData, handleInputChange }: StepRenderProps) => (
      <Fieldset.Root minW="full" flex={1}>
        <Fieldset.Content display="flex" flexDir="row">
          <Field.Root mt={2} required minW="70%">
            <Field.Label fontWeight="bold">Nome completo</Field.Label>
            <Input p="12px" name="name" value={formData.name} onChange={handleInputChange} />
          </Field.Root>

          <Field.Root mt={2} required>
            <Field.Label fontWeight="bold">Data de nascimento</Field.Label>
            <Input
              p="12px"
              name="birthdate"
              type="date"
              value={formData.birthdate}
              onChange={handleInputChange}
            />
          </Field.Root>
        </Fieldset.Content>
        <Fieldset.Content display="grid" gridTemplateColumns="1fr 1fr">
          <Field.Root mt={2} required>
            <Field.Label fontWeight="bold">CPF</Field.Label>
            <Input p="12px" name="cpf" value={formData.cpf} onChange={handleInputChange} />
          </Field.Root>

          <Field.Root mt={2} required>
            <Field.Label fontWeight="bold">RG</Field.Label>
            <Input p="12px" name="rg" value={formData.rg} onChange={handleInputChange} />
          </Field.Root>

          <Field.Root mt={2}>
            <Field.Label fontWeight="bold">Filiação</Field.Label>
            <Input
              p="12px"
              name="filiation"
              value={formData.filiation}
              onChange={handleInputChange}
            />
          </Field.Root>

          <Field.Root mt={2}>
            <Field.Label fontWeight="bold">Colaborador</Field.Label>
            <Input
              p="12px"
              name="collaborator"
              value={formData.collaborator}
              onChange={handleInputChange}
            />
          </Field.Root>
        </Fieldset.Content>
        <Fieldset.Content display="grid" gridTemplateColumns="1fr 1fr 1fr">
          <Field.Root mt={2}>
            <Field.Label fontWeight="bold">Logradouro</Field.Label>
            <Input p="12px" name="street" value={formData.street} onChange={handleInputChange} />
          </Field.Root>
          <Field.Root mt={2}>
            <Field.Label fontWeight="bold">Número</Field.Label>
            <Input p="12px" name="number" value={formData.number} onChange={handleInputChange} />
          </Field.Root>
          <Field.Root mt={2}>
            <Field.Label fontWeight="bold">Bairro</Field.Label>
            <Input
              p="12px"
              name="neighborhood"
              value={formData.neighborhood}
              onChange={handleInputChange}
            />
          </Field.Root>

          <Field.Root mt={2}>
            <Field.Label fontWeight="bold">Cidade</Field.Label>
            <Input p="12px" name="city" value={formData.city} onChange={handleInputChange} />
          </Field.Root>
          <Field.Root mt={2}>
            <Field.Label fontWeight="bold">Estado</Field.Label>
            <Input p="12px" name="state" value={formData.state} onChange={handleInputChange} />
          </Field.Root>
          <Field.Root mt={2}>
            <Field.Label fontWeight="bold">Naturalidade</Field.Label>
            <Input
              p="12px"
              name="naturalidade"
              value={formData.naturalidade}
              onChange={handleInputChange}
            />
          </Field.Root>
        </Fieldset.Content>
      </Fieldset.Root>
    ),
  },
  {
    title: 'Informações do processo',
    render: ({
      formData,
      handleInputChange,
      handleSelectChange,
      handleCheckboxChange,
    }: StepRenderProps) => (
      <Fieldset.Root minW="full" flex={1}>
        <Fieldset.Content display="flex" gap="20px" flexDir="column">
          <Select.Root collection={beneficios} size="md" onValueChange={handleSelectChange}>
            <Select.HiddenSelect />
            <Select.Label fontWeight="bold">Benefício</Select.Label>
            <Select.Control>
              <Select.Trigger p={2}>
                <Select.ValueText placeholder="Selecione o benefício" />
              </Select.Trigger>
              <Select.IndicatorGroup p={2}>
                <Select.Indicator />
              </Select.IndicatorGroup>
            </Select.Control>
            <Portal>
              <Select.Positioner>
                <Select.Content>
                  {beneficios.items.map((beneficio) => (
                    <Select.Item p={2} item={beneficio} key={beneficio.value}>
                      {beneficio.label}
                      <Select.ItemIndicator />
                    </Select.Item>
                  ))}
                </Select.Content>
              </Select.Positioner>
            </Portal>
          </Select.Root>

          <Select.Root collection={status} size="md" onValueChange={handleSelectChange}>
            <Select.HiddenSelect />
            <Select.Label fontWeight="bold">Situação</Select.Label>
            <Select.Control>
              <Select.Trigger p={2}>
                <Select.ValueText placeholder="Selecione a situação do processo" />
              </Select.Trigger>
              <Select.IndicatorGroup p={2}>
                <Select.Indicator />
              </Select.IndicatorGroup>
            </Select.Control>
            <Portal>
              <Select.Positioner>
                <Select.Content>
                  {status.items.map((statusItem) => (
                    <Select.Item p={2} item={statusItem} key={statusItem.value}>
                      {statusItem.label}
                      <Select.ItemIndicator />
                    </Select.Item>
                  ))}
                </Select.Content>
              </Select.Positioner>
            </Portal>
          </Select.Root>
          <Flex gap="2rem">
            <Checkbox.Root
              checked={formData.olharMeuInss}
              onCheckedChange={(checked) => handleCheckboxChange?.('olharMeuInss', checked)}
            >
              <Checkbox.HiddenInput />
              <Checkbox.Control />
              <Checkbox.Label>OLHAR MEU INSS/SAG</Checkbox.Label>
            </Checkbox.Root>
            <Checkbox.Root
              checked={formData.olharPje}
              onCheckedChange={(checked) => handleCheckboxChange?.('olharPje', checked)}
            >
              <Checkbox.HiddenInput />
              <Checkbox.Control />
              <Checkbox.Label>OLHAR PJE/CRETA JUSTIÇA FEDERAL</Checkbox.Label>
            </Checkbox.Root>
          </Flex>
          <Flex gap={4}>
            <Field.Root minW="60%">
              <Field.Label fontWeight="bold">Senha MEU INSS</Field.Label>
              <Input
                p={5}
                name="senha-inss"
                value={formData.senhaInss}
                onChange={handleInputChange}
              />
            </Field.Root>
            <Field.Root>
              <Field.Label fontWeight="bold">Data do atendimento</Field.Label>
              <Input
                p={5}
                name="data-atendimento"
                type="date"
                value={formData.dataAtendimento}
                onChange={handleInputChange}
              />
            </Field.Root>
          </Flex>

          <Field.Root required minW="70%">
            <Field.Label fontWeight="bold">Observações</Field.Label>
            <Textarea
              p={5}
              name="observations"
              height={200}
              fontSize={18}
              value={formData.observations}
              onChange={handleInputChange}
            />
          </Field.Root>
        </Fieldset.Content>
      </Fieldset.Root>
    ),
  },
  {
    title: 'Envio de documentos',
    render: ({ formData, handleInputChange }: StepRenderProps) => (
      <Box>
        <Text fontWeight="semibold" mb={2}>
          Documentos necessários
        </Text>
        <List.Root p="0 30px" mb={2} display="grid" gridTemplateColumns="1fr 1fr" gap="8px">
          <List.Item>Certidão de Nascimento/Casamento</List.Item>
          <List.Item>RG</List.Item>
          <List.Item>CPF</List.Item>
          <List.Item>Comprovante de Residência</List.Item>
          <List.Item>Cartão SUS</List.Item>
          <List.Item>Atestado médico/exames/receituários</List.Item>
          <List.Item>Cadastro Único atualizado</List.Item>
          <List.Item>Carteira de Trabalho e Previdência Social</List.Item>
          <List.Item>Ato impugnado/Carta de negado</List.Item>
          <List.Item>Procuração e Contrato de Honorários</List.Item>
          <List.Item>Perfil Profissiográfico Previdenciário - PPP</List.Item>
          <List.Item>
            Documentos rurais: Certidão Inteiro Teor/Certidão Eleitoral/CAR/Contrato Comodato
          </List.Item>
        </List.Root>
        <Text fontWeight="semibold">* Filho menor</Text>
        <List.Root p="0 30px" mb={2}>
          <List.Item>Certidão de Nascimento</List.Item>
          <List.Item>CPF</List.Item>
        </List.Root>
        <FileUpload.Root alignItems="stretch" maxFiles={2}>
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

          <FileUpload.ClearTrigger asChild>
            <Text fontSize="sm" color="fg.muted" display="flex" alignItems="center" gap={2}>
              Limpar arquivos enviados
              <CloseButton size="sm" variant="plain" />
            </Text>
          </FileUpload.ClearTrigger>
          <FileUpload.List />
        </FileUpload.Root>
      </Box>
    ),
  },
];
