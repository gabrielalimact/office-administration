'use client'

import { useState, useMemo } from 'react'
import { Box, Flex, Text, Stack, Badge, Button } from '@chakra-ui/react'
import { LuCalendarDays, LuFileArchive, LuDownload, LuUser, LuPencil } from 'react-icons/lu'
import { Tooltip } from '@/components/ui/tooltip'
import { toaster } from '@/components/ui/toaster'
import { downloadArquivoProcesso } from '@/services/processo-service'
import { Cliente } from '../../../types/cliente'
import { formatDate, formatDateHour } from '../../../utils/formatDate'
import { InfoItem } from '../InfoItem'
import { getStatusColors } from '../../utils/statusColors'
import { ModalEditarProcesso } from '../ModalEditarProcesso'
import { ArquivosDocumentos } from '../../../types/processos'
import { capitalizeFirstLetters } from '../../../utils/string'

interface ProcessoCardProps {
  proc: Cliente['processos'][0]
  onUpdate: (processo: Cliente['processos'][0]) => void
}

export const ProcessoCard = ({ proc, onUpdate }: ProcessoCardProps) => {
  const [modalEditarAberto, setModalEditarAberto] = useState(false)

  const { bg, color } = useMemo(
    () => getStatusColors(proc.status?.nome, proc.arquivado),
    [proc.status?.nome, proc.arquivado]
  )

  const handleDownload = async (doc: ArquivosDocumentos) => {
    try {
      await downloadArquivoProcesso(doc.id, doc.nome_original)
      toaster.create({
        title: 'Download feito com sucesso',
        description: `O arquivo "${doc.nome_arquivo}" foi baixado com sucesso.`,
        type: 'success'
      })
    } catch {
      toaster.create({
        title: 'Erro ao baixar arquivo',
        description: `Não foi possível baixar "${doc.nome_arquivo}".`,
        type: 'error'
      })
    }
  }

  return (
    <>
      <Box
        key={proc.id}
        mb={6}
        p={8}
        borderWidth={1}
        borderRadius="lg"
        bg="white"
        boxShadow="md"
        _hover={{ boxShadow: 'lg' }}
        transition="0.2s"
      >
        {/* Cabeçalho */}
        <Flex
          justify="space-between"
          align={{ base: 'flex-start', md: 'center' }}
          direction={{ base: 'column', md: 'row' }}
          gap={3}
        >
          <Text fontSize={{ base: 'lg', md: 'xl' }} fontWeight="bold" color="var(--primary)">
            Processo #{proc.id}
          </Text>

          <Flex align="center" gap={3}>
            <Badge
              bg={bg}
              color={color}
              px={3}
              py={1}
              borderRadius="sm"
              fontWeight="bold"
              textTransform="capitalize"
            >
              {proc.status?.nome || 'SEM STATUS'}
            </Badge>

            <Tooltip content="Editar processo">
              <Button
                size="sm"
                variant="ghost"
                onClick={() => setModalEditarAberto(true)}
                color="gray.600"
                _hover={{ color: 'var(--primary)', bg: 'gray.50' }}
              >
                <LuPencil />
              </Button>
            </Tooltip>
          </Flex>
        </Flex>

        <Box my={4} bgColor="gray.100" h="1px" />

        {/* Dados principais */}
        <Stack direction={{ base: 'column', md: 'row' }} gap={8} flexWrap="wrap">
          <InfoItem
            icon={LuCalendarDays}
            label="Cadastro"
            value={proc.data_cadastro ? formatDate(proc.data_cadastro) : '-'}
          />
          <InfoItem
            icon={LuCalendarDays}
            label="Última atualização"
            value={formatDate(proc.data_ultima_atualizacao)}
          />
          <InfoItem
            icon={LuCalendarDays}
            label="Data do Protocolo"
            value={formatDate(proc.data_protocolo || '-')}
          />
          <InfoItem
            icon={LuUser}
            label="Responsável"
            value={capitalizeFirstLetters(proc.colaborador_responsavel || '-')}
          />
          <InfoItem icon={LuFileArchive} label="Benefício" value={proc.beneficio?.nome} />
        </Stack>

        <Box my={4} bgColor="gray.100" h="1px" />

        <Stack direction={{ base: 'column', md: 'row' }} gap={6} wrap="wrap">
          {[
            { label: 'Olhar INSS', value: proc.olhar_inss ? 'Sim' : 'Não' },
            { label: 'Senha INSS', value: proc.olhar_inss ? proc.senha_inss : '-' },
            { label: 'PJE/CRETA', value: proc.olhar_pje_creta ? 'Sim' : 'Não' },
            { label: 'Situação', value: proc.status ? proc.status.nome : '-' },
            {
              label: 'Agendamento',
              value: proc.tipo_agendamento ? proc.tipo_agendamento.nome : 'Nenhum'
            },
            {
              label: 'Data do agendamento',
              value: proc.data_agendamento ? formatDateHour(proc.data_agendamento) : '-'
            }
          ].map(({ label, value }) => (
            <Box key={label}>
              <Text fontSize="sm" fontWeight="bold" color="gray.600">
                {label}:
              </Text>
              <Text>{value}</Text>
            </Box>
          ))}
        </Stack>

        {/* Observações */}
        {proc.observacoes && (
          <Box mt={4}>
            <Text fontSize="sm" fontWeight="bold" color="gray.600" mb={1}>
              Observações
            </Text>
            <Box bg="gray.50" p={3} borderRadius="sm">
              <Text fontSize="sm">{proc.observacoes}</Text>
            </Box>
          </Box>
        )}

        {/* Documentos */}
        {proc.documentos.length > 0 && (
          <Box mt={4}>
            <Text fontSize="sm" fontWeight="bold" color="gray.600" mb={2}>
              Documentos
            </Text>
            {proc.documentos.map((doc) => (
              <Flex
                key={doc.id}
                align={{ base: 'flex-start', md: 'center' }}
                direction={{ base: 'column', md: 'row' }}
                justify="space-between"
                bg="gray.50"
                p={3}
                borderRadius="sm"
                mb={2}
              >
                <Box>
                  <Text fontWeight="medium">{doc.nome_original}</Text>
                  <Text fontSize="xs" color="gray.500">
                    {(doc.tamanho / 1024 / 1024).toFixed(2)} MB
                  </Text>
                  <Text fontSize="sm" color="gray.500">
                    Enviado {formatDateHour(doc.data_upload)}
                  </Text>
                </Box>
                <Tooltip content="Baixar documento">
                  <Button
                    onClick={() => handleDownload(doc)}
                    variant="ghost"
                    size="sm"
                    w={{ base: 'full', md: 'auto' }}
                  >
                    <LuDownload /> Baixar
                  </Button>
                </Tooltip>
              </Flex>
            ))}
          </Box>
        )}
      </Box>

      {/* Modal de Edição */}
      {modalEditarAberto && (
        <ModalEditarProcesso
          proc={proc}
          onClose={() => setModalEditarAberto(false)}
          onUpdate={onUpdate}
        />
      )}
    </>
  )
}

export default ProcessoCard
