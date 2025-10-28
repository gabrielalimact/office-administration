'use client';

import React from 'react';
import { Box, Text, List, FileUpload, Icon, CloseButton } from '@chakra-ui/react';
import { LuUpload } from 'react-icons/lu';
import { StepProps } from '@/types/step-forms';

const DocumentosStep: React.FC<StepProps> = ({ onDataChange }) => {
  const handleFileChange = (files: File[]) => {
    onDataChange({
      files: files,
    });
  };

  return (
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
      <List.Root p="0 30px" mb={4}>
        <List.Item>Certidão de Nascimento</List.Item>
        <List.Item>CPF</List.Item>
      </List.Root>

      <Box p={4} bg="blue.50" borderRadius="md" mb={4}>
        <Text fontSize="sm" color="blue.800" fontWeight="semibold">
          📁 Upload de Documentos
        </Text>
        <Text fontSize="sm" color="blue.700">
          Selecione todos os documentos necessários. A compactação será feita automaticamente ao
          salvar o processo.
        </Text>
      </Box>

      <FileUpload.Root
        alignItems="stretch"
        onFileChange={(details) => handleFileChange(details.acceptedFiles)}
        maxFiles={10}
      >
        <FileUpload.HiddenInput />
        <FileUpload.Dropzone>
          <Icon size="md" color="fg.muted">
            <LuUpload />
          </Icon>
          <FileUpload.DropzoneContent>
            <Box>Clique aqui para anexar os arquivos</Box>
            <Box color="fg.muted">.png, .jpg, .pdf (sem limite de arquivos)</Box>
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
  );
};

export default DocumentosStep;
