import { Flex, Text } from '@chakra-ui/react';
import { useState } from 'react';
import { useUserContext } from '../UserContext';
import { FaRegFileAlt, FaUsers } from 'react-icons/fa';
import { LuFilePlus2 } from 'react-icons/lu';
import { BsPersonVcard } from 'react-icons/bs';
import Link from 'next/link';
import { MdOutlineSpaceDashboard } from 'react-icons/md';
import { HiUserPlus } from 'react-icons/hi2';
import { FaFilePen } from 'react-icons/fa6';

const optionsMenu = [
  { icon: <MdOutlineSpaceDashboard size={24} />, label: 'Painel', href: '/home' },
  { icon: <FaUsers size={24} />, label: 'Clientes', href: '/clientes' },
  { icon: <FaRegFileAlt size={24} />, label: 'Processos', href: '/processos' },
  {
    icon: <LuFilePlus2 size={24} />,
    label: 'Cadastrar processos',
    href: '/cadastrar-processos',
  },
  {
    icon: <BsPersonVcard size={24} />,
    label: 'Funcionários e relatórios',
    href: '/funcionarios-relatorios',
  },
  {
    icon: <HiUserPlus size={24} />,
    label: 'Adicionar funcionário',
    href: '/adicionar-funcionario',
  },
  {
    icon: <FaFilePen size={22} />,
    label: 'Enviar relatório',
    href: '/enviar-relatorio',
  },
];

const SideBar = () => {
  const [expanded, setExpanded] = useState(false);
  const { user } = useUserContext();
  const isSocio = user?.cargo === 'SÓCIO(A)';
  const filteredMenu = optionsMenu.filter(
    (option) =>
      isSocio ||
      (option.href !== '/funcionarios-relatorios' && option.href !== '/adicionar-funcionario'),
  );
  return (
    <Flex
      onMouseEnter={() => setExpanded(true)}
      onMouseLeave={() => setExpanded(false)}
      style={{
        position: 'relative',
        flexDirection: 'column',
        alignItems: expanded ? 'center' : 'flex-start',
        padding: expanded ? '20px' : '20px 8px',
        color: 'white',
        background:
          'linear-gradient(209deg,rgba(36, 34, 112, 1) 0%, rgba(51, 51, 143, 1) 23%, rgba(207, 249, 255, 1) 100%)',
        boxShadow: '0 4px 8px rgba(0, 0, 0, 0.2)',
        minHeight: '100vh',
        width: expanded ? 300 : 64,
        transition: 'width 0.2s',
        zIndex: 100,
      }}
    >
      <Flex
        style={{
          flexDirection: 'column',
          gap: '12px',
          marginTop: expanded ? '24px' : '8px',
          width: '100%',
        }}
      >
        {filteredMenu.map((option) => (
          <Link key={option.label} href={option.href} style={{ textDecoration: 'none' }}>
            <Flex
              align="center"
              gap={expanded ? 2 : 0}
              width="100%"
              justify={expanded ? 'flex-start' : 'center'}
              borderRadius="50px"
              padding={expanded ? '12px 16px' : '12px 0'}
              _hover={{ background: 'rgba(255,255,255,0.18)' }}
              style={{ cursor: 'pointer', marginBottom: 2, background: 'none' }}
            >
              {option.icon}
              {expanded && <Text>{option.label}</Text>}
            </Flex>
          </Link>
        ))}
      </Flex>
    </Flex>
  );
};

export default SideBar;
