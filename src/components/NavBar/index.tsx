import { Box, Flex, Image, Text, Menu, MenuItem, Portal } from '@chakra-ui/react';
import { useRouter } from 'next/navigation';
import { FaRegUserCircle } from 'react-icons/fa';
import { IoIosArrowDown, IoIosLogOut, IoIosSettings } from 'react-icons/io';

const user = {
  name: 'Gabriela Lima',
  avatar: '/images/advogado.avif',
  cargo: 'Sócia',
};

const NavBar = () => {
  const router = useRouter();
  return (
    <Flex
      style={{
        minHeight: '60px',
        width: '100%',
        padding: '20px',
        backgroundColor: 'white',
        boxShadow: '0 1px 2px rgba(0, 0, 0, 0.1)',
        alignItems: 'center',
        justifyContent: 'space-between',
        cursor: 'pointer',
      }}
      onClick={() => router.push('/home')}
    >
      <Flex
        style={{
          alignItems: 'center',
          flexDirection: 'row',
          gap: 10,
        }}
      >
        <Image src="/images/balanca.svg" alt="Logo" width={10} height={10} />
        <Box>
          <Text fontSize="md" fontWeight="bold">
            Diego Oliveira Nascimento
          </Text>
          <Text fontSize="xs">Advocacia & Consultoria</Text>
        </Box>
      </Flex>
      <Menu.Root>
        <Menu.Trigger asChild>
          <Flex align="center" gap={2} style={{ cursor: 'pointer' }}>
            <Image
              src={user.avatar}
              alt={user.name}
              height={'40px'}
              width={'40px'}
              style={{ borderRadius: '50%' }}
            />
            <Box>
              <Text fontSize="sm" fontWeight="bold">
                {user.name}
              </Text>
              <Text fontSize="xs">{user.cargo}</Text>
            </Box>
            <Box as="span" fontSize="lg" ml={1}>
              <IoIosArrowDown />
            </Box>
          </Flex>
        </Menu.Trigger>
        <Portal>
          <Menu.Positioner>
            <Menu.Content boxShadow="sm" minW="250px">
              <MenuItem
                value="configuracoes"
                p={3}
                cursor={'pointer'}
                onClick={() => router.push('/configuracoes')}
              >
                <IoIosSettings size={18} color="var(--darkblue)" />
                Configurações
              </MenuItem>
              <MenuItem value="sair" p={3} cursor={'pointer'} onClick={() => router.push('/')}>
                <IoIosLogOut size={18} color="red" />
                Sair
              </MenuItem>
            </Menu.Content>
          </Menu.Positioner>
        </Portal>
      </Menu.Root>
    </Flex>
  );
};

export default NavBar;
