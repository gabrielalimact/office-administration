'use client';

import React from 'react';
import {
  Fieldset,
  Field,
  Input,
  Textarea,
  Select,
  createListCollection,
  Checkbox,
  Flex,
  Portal,
  Text,
  Box,
} from '@chakra-ui/react';
import { CheckedChangeDetails } from '@zag-js/checkbox';
import { StepProps } from '@/types/step-forms';

const beneficios = createListCollection({
  items: [
    { label: 'LOAS/87', value: 6 },
    { label: 'LOAS/88', value: 7 },
    { label: 'Pensão por morte urbana ou rural', value: 8 },
    { label: 'Aposentadorias', value: 9 },
    { label: 'Auxílio doença', value: 10 },
  ],
});

const status = createListCollection({
  items: [
    { label: 'PERÍCIA', value: 5 },
    { label: 'AVALIAÇÃO', value: 6 },
    { label: 'AUDIENCIA', value: 7 },
    { label: 'PERICIA MEDICA INICIAL', value: 8 },
  ],
});

const ProcessoStep: React.FC<StepProps> = ({ data, onDataChange }) => {
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;

    switch (name) {
      case 'senha-inss':
        onDataChange({ senha_inss: value });
        break;
      case 'data-atendimento':
        onDataChange({ data_atendimento: value });
        break;
      case 'observations':
        onDataChange({ observacoes: value });
        break;
      default:
        break;
    }
  };

  const handleSelectChange = (value: { value: string[] }) => {
    const selectedValue = value.value[0];
    if (!selectedValue) return;

    const parsedId = Number(selectedValue);
    if (Number.isNaN(parsedId)) return;

    const isBeneficio = beneficios.items.some((item) => item.value === parsedId);
    if (isBeneficio) {
      onDataChange({ beneficio: { id: parsedId } });
      return;
    }

    const isStatus = status.items.some((item) => item.value === parsedId);
    if (isStatus) {
      onDataChange({ status: { id: parsedId } });
      return;
    }
  };

  const handleCheckboxChange = (name: string, checked: CheckedChangeDetails) => {
    onDataChange({ [name]: checked.checked });
  };

  return (
    <Fieldset.Root minW="full" flex={1}>
      <Fieldset.Content display="flex" gap="20px" flexDir="column">
        <Box>
          <Select.Root collection={beneficios} size="md" onValueChange={handleSelectChange}>
            <Select.HiddenSelect />
            <Select.Label fontWeight="bold">
              Benefício{' '}
              <Text as="span" color="red.500">
                *
              </Text>
            </Select.Label>
            <Select.Control>
              <Select.Trigger
                p={2}
                borderColor={!data.beneficio.id || data.beneficio.id === 0 ? 'red.300' : undefined}
                _focus={{
                  borderColor:
                    !data.beneficio.id || data.beneficio.id === 0 ? 'red.500' : 'blue.500',
                }}
              >
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
          {(!data.beneficio.id || data.beneficio.id === 0) && (
            <Text fontSize="xs" color="red.500" mt={1}>
              Campo obrigatório
            </Text>
          )}
        </Box>

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
            checked={data.olhar_inss}
            onCheckedChange={(checked) => handleCheckboxChange('olhar_inss', checked)}
          >
            <Checkbox.HiddenInput />
            <Checkbox.Control />
            <Checkbox.Label>OLHAR MEU INSS/SAG</Checkbox.Label>
          </Checkbox.Root>
          <Checkbox.Root
            checked={data.olhar_pje_creta}
            onCheckedChange={(checked) => handleCheckboxChange('olhar_pje_creta', checked)}
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
              value={data.senha_inss || ''}
              onChange={handleInputChange}
            />
          </Field.Root>
          <Field.Root>
            <Field.Label fontWeight="bold">Data do atendimento</Field.Label>
            <Input
              p={5}
              name="data-atendimento"
              type="date"
              value={data.data_atendimento}
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
            value={data.observacoes || ''}
            onChange={handleInputChange}
          />
        </Field.Root>
      </Fieldset.Content>
    </Fieldset.Root>
  );
};

export default ProcessoStep;
