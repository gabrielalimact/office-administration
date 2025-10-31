import { Box, Flex, Text, Image } from '@chakra-ui/react'
import { useEffect, useState } from 'react'
import { useUserContext } from '../UserContext'
import { FaRegFileAlt, FaUsers } from 'react-icons/fa'
import { LuFilePlus2 } from 'react-icons/lu'
import { BsPersonVcard } from 'react-icons/bs'
import Link from 'next/link'
import { MdOutlineSpaceDashboard } from 'react-icons/md'
import { HiUserPlus } from 'react-icons/hi2'
import { FaFilePen } from 'react-icons/fa6'
import { useRouter } from 'next/navigation'
import { IoIosLogOut } from 'react-icons/io'
import { Avatar } from '../Avatar'

if (typeof document !== 'undefined') {
  const style = document.createElement('style')
  style.textContent = `
    @keyframes fadeIn {
      from { opacity: 0; transform: translateY(-50%) translateX(-10px); }
      to { opacity: 1; transform: translateY(-50%) translateX(0); }
    }
  `
  document.head.appendChild(style)
}

const optionsMenu = [
  { icon: <MdOutlineSpaceDashboard size={24} />, label: 'Painel', href: '/home' },
  { icon: <FaUsers size={24} />, label: 'Clientes', href: '/clientes' },
  { icon: <FaRegFileAlt size={24} />, label: 'Processos', href: '/processos' },
  {
    icon: <LuFilePlus2 size={24} />,
    label: 'Cadastrar processos',
    href: '/cadastrar-processos'
  },
  {
    icon: <BsPersonVcard size={24} />,
    label: 'Funcionários',
    href: '/funcionarios-relatorios'
  },
  {
    icon: <HiUserPlus size={24} />,
    label: 'Adicionar funcionário',
    href: '/adicionar-funcionario'
  },
  {
    icon: <FaFilePen size={22} />,
    label: 'Enviar relatório',
    href: '/enviar-relatorio'
  }
]

const SideBar = () => {
  const [expanded, setExpanded] = useState(false)
  const [hasMounted, setHasMounted] = useState(false)
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null)

  const { user } = useUserContext()
  const router = useRouter()
  const isSocio = user?.cargo === 'socio'

  const filteredMenu = optionsMenu.filter(
    (option) =>
      isSocio ||
      (option.href !== '/funcionarios-relatorios' && option.href !== '/adicionar-funcionario')
  )

  useEffect(() => {
    setHasMounted(true)
  }, [])

  const handleExpand = () => {
    setExpanded(!expanded)
  }

  if (!hasMounted) {
    return null
  }
  return (
    <Flex
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        flexDirection: 'column',
        alignItems: expanded ? 'center' : 'flex-start',
        padding: expanded ? '20px' : '20px 8px',
        color: '#707488ff',
        backgroundColor: 'rgba(247, 247, 250, 0.85)',
        backdropFilter: 'blur(20px) saturate(180%)',
        WebkitBackdropFilter: 'blur(20px) saturate(180%)',
        backgroundImage: `
          radial-gradient(circle at 1px 1px, rgba(112, 136, 128, 0.15) 1px, transparent 0),
          linear-gradient(135deg, rgba(247, 247, 250, 0.9) 0%, rgba(230, 230, 235, 0.8) 100%)
        `,
        backgroundSize: '20px 20px, 100% 100%',
        height: '100vh',
        width: expanded ? 300 : 64,
        transition: 'width 0.2s',
        zIndex: 100,
        borderColor: 'rgba(0, 0, 0, 0.18)',
        borderRight: '1px solid rgba(0, 0, 0, 0.18)'
      }}
    >
      <Flex
        style={{
          flexDirection: 'column',
          gap: '12px',
          marginTop: expanded ? '24px' : '8px',
          width: '100%',
          height: '100%',
          flex: 1
        }}
      >
        <Flex
          style={{
            justifyContent: expanded ? 'flex-start' : 'center',
            alignItems: 'center',
            flexDirection: 'row',
            gap: 10,
            cursor: 'pointer'
          }}
          onClick={() => router.push('/home')}
        >
          <Image src="/images/balanca.svg" alt="Logo" width={10} height={10} />
          {expanded && (
            <Box>
              <Text fontSize="md" fontWeight="bold">
                Diego Oliveira Nascimento
              </Text>
              <Text fontSize="xs">Advocacia & Consultoria</Text>
            </Box>
          )}
        </Flex>
        <Flex direction="column" mt={8} gap={1} flex={1} justifyContent={'space-between'}>
          <Flex direction="column">
            {filteredMenu.map((option, index) => (
              <Box key={option.label} position="relative">
                <Link href={option.href} style={{ textDecoration: 'none' }}>
                  <Flex
                    align="center"
                    gap={expanded ? 2 : 0}
                    width="100%"
                    justify={expanded ? 'flex-start' : 'center'}
                    borderRadius="50px"
                    padding={expanded ? '12px 16px' : '12px 0'}
                    _hover={{ background: 'rgba(255,255,255,0.18)' }}
                    style={{
                      cursor: 'pointer',
                      marginBottom: 2,
                      background: 'none',
                      scale: hoveredIndex === index ? '1.3' : '1',
                      transition: 'all 0.2s'
                    }}
                    onMouseOver={() => setHoveredIndex(index)}
                    onMouseLeave={() => setHoveredIndex(null)}
                  >
                    {option.icon}
                    {expanded && <Text>{option.label}</Text>}
                  </Flex>
                </Link>

                {!expanded && hoveredIndex === index && (
                  <Box
                    position="absolute"
                    left="70px"
                    top="50%"
                    transform="translateY(-50%)"
                    zIndex={1000}
                    bg="rgba(32, 32, 32, 0.95)"
                    color="white"
                    px={3}
                    py={2}
                    borderRadius="8px"
                    fontSize="sm"
                    fontWeight="medium"
                    whiteSpace="nowrap"
                    boxShadow="0 4px 12px rgba(0, 0, 0, 0.3)"
                    _before={{
                      content: '""',
                      position: 'absolute',
                      left: '-6px',
                      top: '50%',
                      transform: 'translateY(-50%)',
                      width: 0,
                      height: 0,
                      borderTop: '6px solid transparent',
                      borderBottom: '6px solid transparent',
                      borderRight: '6px solid rgba(32, 32, 32, 0.95)'
                    }}
                    style={{
                      animation: 'fadeIn 0.2s ease-in-out'
                    }}
                  >
                    {option.label}
                  </Box>
                )}
              </Box>
            ))}
          </Flex>

          <Flex
            gap={8}
            flexDirection={'column'}
            width="100%"
            align="center"
            style={{ cursor: 'pointer' }}
            padding={expanded ? '12px 16px' : '12px 0'}
          >
            <Flex gap={4} onClick={() => router.push('/configuracoes')}>
              <Avatar
                avatarPath={user?.avatar}
                userName={user?.nome}
                size="40px"
                fontSize="lg"
                fallbackColor="white"
                fallbackBg="#A8D0F0"
              />
              {expanded && (
                <Box>
                  <Text fontSize="sm" fontWeight="bold">
                    {user?.nome}
                  </Text>
                  <Text fontSize="xs">
                    {user?.cargo === 'socio' ? 'Sócio(a)' : 'Funcionário(a)'}
                  </Text>
                </Box>
              )}
            </Flex>

            <Flex gap={2} onClick={() => router.push('/')}>
              <IoIosLogOut size={24} />

              {expanded && <Text>Sair</Text>}
            </Flex>
          </Flex>
        </Flex>
      </Flex>
    </Flex>
  )
}

export default SideBar
