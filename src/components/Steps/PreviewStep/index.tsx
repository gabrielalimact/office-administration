'use client';

import React, { useEffect, useState } from 'react';
import { Box, Text, Flex, Card, Badge, List, Fieldset, Field } from '@chakra-ui/react';
import { StepProps } from '@/types/step-forms';
import maskCPF from '../../../../utils/maskCPF';
import { getBeneficios, getStatus } from '@/services/processo-service';

const PreviewStep: React.FC<StepProps> = ({ data }) => {
  const [listaBeneficios, setListaBeneficios] = useState<{ label: string; value: number }[]>([]);
  const [listaStatus, setListaStatus] = useState<{ label: string; value: number }[]>([]);


    const fetchData = async () => {
      const beneficiosData = await getBeneficios();
      const formattedBeneficios = beneficiosData.map((beneficio: any) => ({
        label: beneficio.nome,
        value: beneficio.id,
      }));
      setListaBeneficios(formattedBeneficios);
  
      const statusData = await getStatus();
      const formattedStatus = statusData.map((statusItem: any) => ({
        label: statusItem.nome,
        value: statusItem.id,
      }));
      setListaStatus(formattedStatus);
    };
  const getBeneficioLabel = (id: number) => {
    const beneficio = listaBeneficios.find((b) => b.value === id);
    console.log(listaBeneficios, id, beneficio)
    return beneficio ? beneficio.label : 'Não selecionado';
  };

  const getStatusLabel = (id: number) => {
    const statusItem = listaStatus.find((s) => s.value === id);
    return statusItem ? statusItem.label : 'Não selecionado';
  };

  const formatFileSize = (size: number) => {
    return (size / 1024 / 1024).toFixed(2) + ' MB';
  };

  useEffect(() => {
    fetchData();
  }, []);

  return (
    <Box>
      <Text fontSize="xl" fontWeight="bold" mb={6} textAlign="center">
        Revisar Informações do Processo
      </Text>

      <Flex direction="column" gap={6}>
        {/* Informações do Cliente */}
        <Card.Root p={6}>
          <Card.Header mb={3} borderBottom={'1px solid'} borderColor="gray.200">
            <Card.Title fontSize="lg" color="blue.600">
              👤 Informações do Cliente
            </Card.Title>
          </Card.Header>
          <Card.Body>
            <Fieldset.Root>
              <Fieldset.Content display="grid" gridTemplateColumns="1fr 1fr" gap={2}>
                <Field.Root>
                  <Field.Label fontWeight="semibold">Nome Completo</Field.Label>
                  <Text>{data.cliente.nome || '-'}</Text>
                </Field.Root>

                <Field.Root>
                  <Field.Label fontWeight="semibold">Data de Nascimento</Field.Label>
                  <Text>{data.cliente.data_nascimento || '-'}</Text>
                </Field.Root>

                <Field.Root>
                  <Field.Label fontWeight="semibold">CPF</Field.Label>
                  <Text>{data.cliente.cpf ? maskCPF(data.cliente.cpf) : '-'}</Text>
                </Field.Root>

                <Field.Root>
                  <Field.Label fontWeight="semibold">RG</Field.Label>
                  <Text>{data.cliente.rg || '-'}</Text>
                </Field.Root>

                <Field.Root>
                  <Field.Label fontWeight="semibold">Filiação</Field.Label>
                  <Text>{data.cliente.filiacao || '-'}</Text>
                </Field.Root>

                <Field.Root>
                  <Field.Label fontWeight="semibold">Naturalidade</Field.Label>
                  <Text>{data.cliente.naturalidade || '-'}</Text>
                </Field.Root>
              </Fieldset.Content>

              <Text
                fontSize="md"
                fontWeight="semibold"
                mt={4}
                mb={3}
                color="blue.600"
                borderBottom={'1px solid'}
                borderColor="gray.200"
              >
                📍 Endereço
              </Text>
              <Fieldset.Content display="grid" gridTemplateColumns="1fr 1fr 1fr" gap={2}>
                <Field.Root>
                  <Field.Label fontWeight="semibold">CEP</Field.Label>
                  <Text>{data.cliente.endereco.cep || '-'}</Text>
                </Field.Root>

                <Field.Root>
                  <Field.Label fontWeight="semibold">Logradouro</Field.Label>
                  <Text>{data.cliente.endereco.logradouro || '-'}</Text>
                </Field.Root>

                <Field.Root>
                  <Field.Label fontWeight="semibold">Número</Field.Label>
                  <Text>{data.cliente.endereco.numero || '-'}</Text>
                </Field.Root>

                <Field.Root>
                  <Field.Label fontWeight="semibold">Bairro</Field.Label>
                  <Text>{data.cliente.endereco.bairro || '-'}</Text>
                </Field.Root>

                <Field.Root>
                  <Field.Label fontWeight="semibold">Cidade</Field.Label>
                  <Text>{data.cliente.endereco.cidade || '-'}</Text>
                </Field.Root>

                <Field.Root>
                  <Field.Label fontWeight="semibold">Estado</Field.Label>
                  <Text>{data.cliente.endereco.estado || '-'}</Text>
                </Field.Root>
              </Fieldset.Content>
            </Fieldset.Root>
          </Card.Body>
        </Card.Root>

        {/* Informações do Processo */}
        <Card.Root p={6}>
          <Card.Header mb={3} borderBottom={'1px solid'} borderColor="gray.200">
            <Card.Title fontSize="lg" color="green.600">
              📋 Informações do Processo
            </Card.Title>
          </Card.Header>
          <Card.Body>
            <Fieldset.Root>
              <Fieldset.Content display="grid" gridTemplateColumns="1fr 1fr" gap={4}>
                <Field.Root>
                  <Field.Label fontWeight="semibold">Benefício</Field.Label>
                  <Badge colorScheme="blue" size="md" px={2}>
                    {getBeneficioLabel(data.beneficio.id)}
                  </Badge>
                </Field.Root>

                <Field.Root>
                  <Field.Label fontWeight="semibold">Status</Field.Label>
                  <Badge colorScheme="blue" size="md" px={2}>
                    {getStatusLabel(data.status.id)}
                  </Badge>
                </Field.Root>

                <Field.Root>
                  <Field.Label fontWeight="semibold">Data do Atendimento</Field.Label>
                  <Text>{data.data_atendimento || '-'}</Text>
                </Field.Root>

                <Field.Root>
                  <Field.Label fontWeight="semibold">Senha MEU INSS</Field.Label>
                  <Text>{data.senha_inss ? '••••••••' : '-'}</Text>
                </Field.Root>
              </Fieldset.Content>

              <Flex gap={4} mt={4}>
                <Field.Root>
                  <Field.Label fontWeight="semibold">Verificações</Field.Label>
                  <Flex gap={2}>
                    <Badge colorScheme={data.olhar_inss ? 'green' : 'gray'} size="md" px={2}>
                      {data.olhar_inss ? '✓' : '✗'} OLHAR MEU INSS/SAG
                    </Badge>
                    <Badge colorScheme={data.olhar_pje_creta ? 'green' : 'gray'} size="md" px={2}>
                      {data.olhar_pje_creta ? '✓' : '✗'} OLHAR PJE/CRETA
                    </Badge>
                  </Flex>
                </Field.Root>
              </Flex>

              {data.observacoes && (
                <Field.Root mt={4}>
                  <Field.Label fontWeight="semibold">Observações</Field.Label>
                  <Box
                    p={3}
                    bg="gray.50"
                    borderRadius="md"
                    border="1px solid"
                    borderColor="gray.200"
                    maxHeight="100px"
                    overflowY="auto"
                  >
                    <Text fontSize="sm">{data.observacoes}</Text>
                  </Box>
                </Field.Root>
              )}
            </Fieldset.Root>
          </Card.Body>
        </Card.Root>

        <Card.Root p={6}>
          <Card.Header mb={3} borderBottom={'1px solid'} borderColor="gray.200">
            <Card.Title fontSize="lg" color="purple.600">
              📎 Documentos Anexados
            </Card.Title>
          </Card.Header>
          <Card.Body>
            {data.files && data.files.length > 0 ? (
              <List.Root>
                {data.files.map((file, index) => (
                  <List.Item
                    key={index}
                    display="flex"
                    justifyContent="space-between"
                    alignItems="center"
                    py={2}
                  >
                    <Flex alignItems="center" gap={2}>
                      <Text fontSize="sm">📄</Text>
                      <Text fontSize="sm" fontWeight="medium">
                        {file.name}
                      </Text>
                    </Flex>
                    <Badge size="md" colorScheme="blue" px={2}>
                      {formatFileSize(file.size)}
                    </Badge>
                  </List.Item>
                ))}
              </List.Root>
            ) : (
              <Text fontSize="sm" color="gray.500" fontStyle="italic">
                Nenhum documento anexado
              </Text>
            )}

            {data.files && data.files.length > 1 && (
              <Box mt={4} p={3} bg="blue.50" borderRadius="md" border="1px solid blue.200">
                <Text fontSize="sm" fontWeight="semibold" color="blue.800">
                  📁 Compactação automática
                </Text>
                <Text fontSize="xs" color="blue.700">
                  Os {data.files.length} arquivos serão compactados em um ZIP ao salvar o processo.
                </Text>
              </Box>
            )}
          </Card.Body>
        </Card.Root>
      </Flex>
    </Box>
  );
};

export default PreviewStep;
