'use client'

import React, { useEffect, useState } from 'react'
import { Fieldset, Field, Input, Textarea, Checkbox, Flex, Text, Grid } from '@chakra-ui/react'
import { CheckedChangeDetails } from '@zag-js/checkbox'
import { StepProps } from '@/types/step-forms'
import { getBeneficios, getStatus } from '@/services/processo-service'
import { Beneficio, Status } from '../../../../types/processos'
import { CustomSelect, SelectOption } from '@/components/CustomSelect'

const ProcessoStep: React.FC<StepProps> = ({ data, onDataChange }) => {
  const [listaBeneficios, setListaBeneficios] = useState<SelectOption[]>([])
  const [listaStatus, setListaStatus] = useState<SelectOption[]>([])

  const [selectedStatus, setSelectedStatus] = useState<string[]>([])
  const [selectedBeneficio, setSelectedBeneficio] = useState<string[]>([])

  const fetchData = async () => {
    const beneficiosData = await getBeneficios()
    const formattedBeneficios = beneficiosData.map((beneficio: Beneficio) => ({
      label: beneficio.nome,
      value: beneficio.id
    }))
    setListaBeneficios(formattedBeneficios)

    const statusData = await getStatus()
    const formattedStatus = statusData.map((statusItem: Status) => ({
      label: statusItem.nome,
      value: statusItem.id
    }))
    setListaStatus(formattedStatus)
  }

  useEffect(() => {
    fetchData()
  }, [])

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target

    switch (name) {
      case 'senha-inss':
        onDataChange({ senha_inss: value })
        break
      case 'data-atendimento':
        onDataChange({ data_cadastro: value })
        break
      case 'observations':
        onDataChange({ observacoes: value })
        break
      default:
        break
    }
  }

  const handleBeneficioChange = (value: string[]) => {
    const selectedValue = value[0]
    if (!selectedValue) return

    const parsedId = Number(selectedValue)
    if (Number.isNaN(parsedId)) return
    setSelectedBeneficio(value)
    onDataChange({ beneficio: { id: parsedId } })
  }

  const handleStatusChange = (value: string[]) => {
    const selectedValue = value[0]
    if (!selectedValue) return

    const parsedId = Number(selectedValue)
    if (Number.isNaN(parsedId)) return
    setSelectedStatus(value)
    onDataChange({ status: { id: parsedId } })
  }

  const handleCheckboxChange = (name: string, checked: CheckedChangeDetails) => {
    onDataChange({ [name]: checked.checked })
  }

  return (
    <Fieldset.Root minW="full" flex={1}>
      <Fieldset.Content display="flex" gap={6} flexDir="column">
        <Grid templateColumns="1fr 1fr" gap={4}>
          <CustomSelect
            label="Benefício"
            options={listaBeneficios}
            placeholder="Selecione o tipo de benefício"
            onValueChange={handleBeneficioChange}
            value={selectedBeneficio}
            isRequired
            clearable
          />
          {(!data.beneficio.id || data.beneficio.id === 0) && (
            <Text fontSize="xs" color="red.500" mt={1}>
              Campo obrigatório
            </Text>
          )}
          <CustomSelect
            label="Situação"
            options={listaStatus}
            placeholder="Selecione a situação do processo"
            onValueChange={handleStatusChange}
            value={selectedStatus}
            isRequired
            clearable
          />
          {(!data.status.id || data.status.id === 0) && (
            <Text fontSize="xs" color="red.500" mt={1}>
              Campo obrigatório
            </Text>
          )}
        </Grid>

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
            <Field.Label fontWeight="bold">Data do Cadastro</Field.Label>
            <Input
              p={5}
              name="data-atendimento"
              type="date"
              value={
                data.data_cadastro && data.data_cadastro !== ''
                  ? data.data_cadastro
                  : (() => {
                      const d = new Date()
                      const yyyy = d.getFullYear()
                      const mm = String(d.getMonth() + 1).padStart(2, '0')
                      const dd = String(d.getDate()).padStart(2, '0')
                      return `${yyyy}-${mm}-${dd}`
                    })()
              }
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
  )
}

export default ProcessoStep
