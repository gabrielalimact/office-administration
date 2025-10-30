'use client';
import { Box, Button, Text, Input, VStack, HStack } from '@chakra-ui/react';
import { useState, useMemo, useRef } from 'react';
import { useUserContext } from '@/components/UserContext';
import dynamic from 'next/dynamic';
import Breadcrumb from '@/components/Breadcrumb';
import { FaBold } from 'react-icons/fa';

const SimpleMDE = dynamic(() => import('react-simplemde-editor'), { ssr: false });
import 'easymde/dist/easymde.min.css';
import { enviarNovoRelatorio } from '@/services/relatorios-service';
import CustomInput from '@/components/CustomInput';

export default function EnviarRelatorioPage() {
  const { user } = useUserContext();
  const [conteudo, setConteudo] = useState('');
  const [titulo, setTitulo] = useState('');
  const [negritoActive, setNegritoActive] = useState(false);
  const [success, setSuccess] = useState(false);

  const mdeOptions = useMemo(
    () => ({
      placeholder: 'Descreva seu trabalho, atividades, etc...',
      toolbar: false,
      spellChecker: false,
      status: false,
    }),
    [],
  );

  if (!user) {
    return <Text>Faça login para enviar um relatório.</Text>;
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();

    const relatorioData = {
      idFuncionario: Number(user?.id),
      titulo,
      conteudo,
    };

    localStorage.setItem(`relatorio`, JSON.stringify(relatorioData));

    enviarNovoRelatorio(relatorioData)
      .then(() => {
        setSuccess(true);
        setTitulo('');
        setConteudo('');
        setTimeout(() => setSuccess(false), 3000);
      })
      .catch((error) => {
        console.error('Erro ao enviar relatório:', error);
        alert('Erro ao enviar relatório. Tente novamente.');
      });
  }
  const handleNegritoClick = () => {
    const novoEstado = !negritoActive;
    setNegritoActive(novoEstado);

    if (novoEstado) {
      const textarea = document.querySelector('.CodeMirror textarea') as HTMLTextAreaElement;
      if (textarea) {
        const start = textarea.selectionStart;
        const end = textarea.selectionEnd;
        const selectedText = conteudo.substring(start, end);
        const beforeText = conteudo.substring(0, start);
        const afterText = conteudo.substring(end);

        if (selectedText) {
          const newText = `${beforeText}**${selectedText}**${afterText}`;
          setConteudo(newText);
        } else {
          const newText = `${beforeText}****${afterText}`;
          setConteudo(newText);
        }
      }
    }
  }

  return (
    <Box maxW={700} mx="auto" p={8} bg="white" borderRadius={12} boxShadow="md" mt={8}>
      <Breadcrumb />
      <Text fontSize="2xl" fontWeight="bold" mb={4}>
        Enviar Relatório de Trabalho
      </Text>
      <Text mb={2} color="gray.600">
        Usuário: <b>{user.nome}</b> ({user.cargo})
      </Text>
      <form onSubmit={handleSubmit}>
        <VStack gap={4} align="stretch">
          {/* Campo de Título */}
          <Box>
            <Text mb={2} fontWeight="semibold" color="gray.700">
              Título do Relatório *
            </Text>
            <CustomInput
              value={titulo}
              onChange={(e) => setTitulo(e.target.value)}
              placeholder="Digite o título do relatório..."
              required
            />
          </Box>

          <Box>
            <Text mb={2} fontWeight="semibold" color="gray.700">
              Conteúdo do Relatório *
            </Text>
            <HStack mb={2} gap={2}>
              <Button
                size="sm"
                px={2}
                onClick={() => {
                  handleNegritoClick();
                }}
                variant="outline"
                style={{
                  backgroundColor: negritoActive ? 'black' : 'transparent',
                  color: negritoActive ? 'white' : 'black',
                }}
              >
                <FaBold style={{ marginRight: '8px' }} />
                Negrito
              </Button>
              <Text fontSize="sm" color="gray.500">
                Cmd+B para negrito | **texto** para formatação manual
              </Text>
            </HStack>
          </Box>

          <Box className="mde-container">
            <SimpleMDE value={conteudo} onChange={setConteudo} options={mdeOptions} />
          </Box>

          <Button
            type="submit"
            fontWeight={700}
            disabled={!conteudo.trim() || !titulo.trim()}
            colorScheme="blue"
          >
            Enviar Relatório
          </Button>
        </VStack>

        {success && (
          <Text mt={4} color="green.500" textAlign="center">
            Relatório enviado com sucesso!
          </Text>
        )}
      </form>
    </Box>
  );
}
