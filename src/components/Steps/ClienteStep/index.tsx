'use client'

import React from 'react'
import { Fieldset, Field, Input, Text } from '@chakra-ui/react'
import { StepProps } from '@/types/step-forms'
import maskCPF from '../../../../utils/maskCPF'

const ClienteStep: React.FC<StepProps> = ({ data, onDataChange }) => {
  const isValidCPF = (cpf: string) => {
    const cleanCPF = cpf.replace(/\D/g, '')
    return cleanCPF.length === 11
  }

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target

    switch (name) {
      case 'name':
        onDataChange({
          cliente: { ...data.cliente, nome: value }
        })
        break
      case 'birthdate':
        onDataChange({
          cliente: { ...data.cliente, data_nascimento: value }
        })
        break
      case 'cpf':
        const digits = value.replace(/\D/g, '').slice(0, 11)
        onDataChange({
          cliente: { ...data.cliente, cpf: digits }
        })
        break
      case 'rg':
        onDataChange({
          cliente: { ...data.cliente, rg: value }
        })
        break
      case 'filiation':
        onDataChange({
          cliente: { ...data.cliente, filiacao: value }
        })
        break
      case 'naturalidade':
        onDataChange({
          cliente: { ...data.cliente, naturalidade: value }
        })
        break
      // Campos de endereço
      case 'cep':
        onDataChange({
          cliente: {
            ...data.cliente,
            endereco: { ...data.cliente.endereco, cep: value }
          }
        })
        break
      case 'street':
        onDataChange({
          cliente: {
            ...data.cliente,
            endereco: { ...data.cliente.endereco, logradouro: value }
          }
        })
        break
      case 'number':
        onDataChange({
          cliente: {
            ...data.cliente,
            endereco: { ...data.cliente.endereco, numero: value }
          }
        })
        break
      case 'neighborhood':
        onDataChange({
          cliente: {
            ...data.cliente,
            endereco: { ...data.cliente.endereco, bairro: value }
          }
        })
        break
      case 'city':
        onDataChange({
          cliente: {
            ...data.cliente,
            endereco: { ...data.cliente.endereco, cidade: value }
          }
        })
        break
      case 'state':
        onDataChange({
          cliente: {
            ...data.cliente,
            endereco: { ...data.cliente.endereco, estado: value }
          }
        })
        break
      default:
        break
    }
  }

  return (
    <Fieldset.Root minW="full" flex={1} gap={2}>
      <Fieldset.Content display="flex" flexDir="row">
        <Field.Root required minW="70%">
          <Field.Label fontWeight="bold">
            Nome completo{' '}
            <Text as="span" color="red.500">
              *
            </Text>
          </Field.Label>
          <Input
            p="12px"
            name="name"
            value={data.cliente.nome}
            onChange={handleInputChange}
            borderColor={!data.cliente.nome.trim() ? 'red.300' : undefined}
            _focus={{
              borderColor: !data.cliente.nome.trim() ? 'red.500' : 'blue.500'
            }}
          />
          {!data.cliente.nome.trim() && (
            <Text fontSize="xs" color="red.500" mt={1}>
              Campo obrigatório
            </Text>
          )}
        </Field.Root>

        <Field.Root required>
          <Field.Label fontWeight="bold">Data de nascimento</Field.Label>
          <Input
            p="12px"
            name="birthdate"
            type="date"
            value={data.cliente.data_nascimento}
            onChange={handleInputChange}
          />
        </Field.Root>
      </Fieldset.Content>

      <Fieldset.Content display="grid" gridTemplateColumns="1fr 1fr 1fr">
        <Field.Root mt={2} required>
          <Field.Label fontWeight="bold">
            CPF{' '}
            <Text as="span" color="red.500">
              *
            </Text>
          </Field.Label>
          <Input
            p="12px"
            name="cpf"
            value={maskCPF(data.cliente.cpf)}
            onChange={handleInputChange}
            borderColor={
              !data.cliente.cpf.trim() || !isValidCPF(data.cliente.cpf) ? 'red.300' : undefined
            }
            _focus={{
              borderColor:
                !data.cliente.cpf.trim() || !isValidCPF(data.cliente.cpf) ? 'red.500' : 'blue.500'
            }}
          />
          {!data.cliente.cpf.trim() ? (
            <Text fontSize="xs" color="red.500" mt={1}>
              Campo obrigatório
            </Text>
          ) : !isValidCPF(data.cliente.cpf) ? (
            <Text fontSize="xs" color="red.500" mt={1}>
              CPF deve ter 11 dígitos
            </Text>
          ) : null}
        </Field.Root>

        <Field.Root mt={2} required>
          <Field.Label fontWeight="bold">RG</Field.Label>
          <Input p="12px" name="rg" value={data.cliente.rg} onChange={handleInputChange} />
        </Field.Root>

        <Field.Root mt={2}>
          <Field.Label fontWeight="bold">Filiação</Field.Label>
          <Input
            p="12px"
            name="filiation"
            value={data.cliente.filiacao}
            onChange={handleInputChange}
          />
        </Field.Root>

        <Field.Root mt={2}>
          <Field.Label fontWeight="bold">Naturalidade</Field.Label>
          <Input
            p="12px"
            name="naturalidade"
            value={data.cliente.naturalidade}
            onChange={handleInputChange}
          />
        </Field.Root>
      </Fieldset.Content>

      <Fieldset.Content display="grid" gridTemplateColumns="1fr 1fr 1fr">
        <Field.Root mt={2}>
          <Field.Label fontWeight="bold">CEP</Field.Label>
          <Input
            p="12px"
            name="cep"
            value={data.cliente.endereco.cep}
            onChange={handleInputChange}
          />
        </Field.Root>

        <Field.Root mt={2}>
          <Field.Label fontWeight="bold">Logradouro</Field.Label>
          <Input
            p="12px"
            name="street"
            value={data.cliente.endereco.logradouro}
            onChange={handleInputChange}
          />
        </Field.Root>

        <Field.Root mt={2}>
          <Field.Label fontWeight="bold">Número</Field.Label>
          <Input
            p="12px"
            name="number"
            value={data.cliente.endereco.numero}
            onChange={handleInputChange}
          />
        </Field.Root>

        <Field.Root mt={2}>
          <Field.Label fontWeight="bold">Bairro</Field.Label>
          <Input
            p="12px"
            name="neighborhood"
            value={data.cliente.endereco.bairro}
            onChange={handleInputChange}
          />
        </Field.Root>

        <Field.Root mt={2}>
          <Field.Label fontWeight="bold">Cidade</Field.Label>
          <Input
            p="12px"
            name="city"
            value={data.cliente.endereco.cidade}
            onChange={handleInputChange}
          />
        </Field.Root>

        <Field.Root mt={2}>
          <Field.Label fontWeight="bold">Estado</Field.Label>
          <Input
            p="12px"
            name="state"
            value={data.cliente.endereco.estado}
            onChange={handleInputChange}
          />
        </Field.Root>
      </Fieldset.Content>
    </Fieldset.Root>
  )
}

export default ClienteStep
