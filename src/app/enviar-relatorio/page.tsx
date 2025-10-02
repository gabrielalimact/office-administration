'use client';
import { Box, Button, Text } from '@chakra-ui/react';
import { useState, useMemo } from 'react';
import { useUserContext } from '@/components/UserContext';
import dynamic from 'next/dynamic';

const SimpleMDE = dynamic(() => import('react-simplemde-editor'), { ssr: false });
import 'easymde/dist/easymde.min.css';
import { enviarNovoRelatorio } from '@/services/relatorios-service';

export default function EnviarRelatorioPage() {
  const { user } = useUserContext();
  const [conteudo, setConteudo] = useState('');
  const [success, setSuccess] = useState(false);
  const mdeOptions = useMemo(
    () => ({
      placeholder: 'Descreva seu trabalho, atividades, etc...',
    }),
    [],
  );

  if (!user) {
    return <Text>Faça login para enviar um relatório.</Text>;
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    localStorage.setItem(
      `relatorio`,
      JSON.stringify({
        idFuncionario: user?.id,
        conteudo,
      }),
    );

    enviarNovoRelatorio({
      idFuncionario: Number(user?.id),
      conteudo,
    })
      .then(() => {
        setSuccess(true);
        setConteudo('');
        setTimeout(() => setSuccess(false), 3000);
      })
      .catch((error) => {
        console.error('Erro ao enviar relatório:', error);
        alert('Erro ao enviar relatório. Tente novamente.');
      });
  }

  return (
    <Box maxW={700} mx="auto" p={8} bg="white" borderRadius={12} boxShadow="md" mt={8}>
      <Text fontSize="2xl" fontWeight="bold" mb={4}>
        Enviar Relatório de Trabalho
      </Text>
      <Text mb={2} color="gray.600">
        Usuário: <b>{user.nome}</b> ({user.cargo})
      </Text>
      <form onSubmit={handleSubmit}>
        <Box mb={4}>
          <SimpleMDE value={conteudo} onChange={setConteudo} options={mdeOptions} />
        </Box>
        <Button type="submit" fontWeight={700} disabled={!conteudo.trim()}>
          Enviar Relatório
        </Button>
        {success && (
          <Text mt={4} color="green.500">
            Relatório enviado com sucesso!
          </Text>
        )}
      </form>
    </Box>
  );
}
