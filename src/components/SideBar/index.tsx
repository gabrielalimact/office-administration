import { Flex, Image, Text, Button } from "@chakra-ui/react";
import { JSX } from "react";
import { IoSettingsOutline} from "react-icons/io5";
import { FaRegFileAlt } from "react-icons/fa";
import { LuFilePlus2 } from "react-icons/lu";
import { BsPersonVcard } from "react-icons/bs";


export type OptionsMenu = {
  icon: JSX.Element;
  label: string;
};

type SideBarProps = {
  onSelectOption: (options: OptionsMenu) => void;
  selectedOption: string;
};

const SideBar = ({ onSelectOption, selectedOption }: SideBarProps) => {
  const optionsMenu: OptionsMenu[] = [
    { icon: <FaRegFileAlt />, label: 'Processos' },
    { icon: <LuFilePlus2 />, label: 'Cadastrar processos' },
    { icon: <BsPersonVcard />, label: 'Funcionários e relatórios' },
    { icon: <IoSettingsOutline />, label: 'Configurações' },
  ];
  return (
    <Flex
      style={{
        position: "relative",
        flexDirection: "column",
        alignItems: "center",
        padding: "20px",
        color: 'white',
        background: "linear-gradient(209deg,rgba(36, 34, 112, 1) 0%, rgba(51, 51, 143, 1) 23%, rgba(207, 249, 255, 1) 100%)",
        boxShadow: "0 4px 8px rgba(0, 0, 0, 0.2)",
        minHeight: "100vh",
      }}
    >
      <Flex style={{
        alignItems: 'center',
        flexDirection: 'column',
        padding: '20px 0'
      }}>
        <Image src='/images/balanca.svg' alt="Logo"
          width={50}
          height={50}
        />
        <Text fontSize="xl" fontWeight='bold'>
          Diego Oliveira Nascimento
        </Text>
        <Text fontSize="lg">
          Advocacia & Consultoria
        </Text>
      </Flex>

      <Flex style={{
        flexDirection: "column",
        gap: "12px",
        marginTop: "24px",
        width: "100%",
      }}>
        {optionsMenu.map((option) => (
          <Button
            key={option.label}
            size="xl"
            width="100%"
            justifyContent="flex-start"
            padding="12px 16px"
            variant={selectedOption === option.label ? "solid" : "ghost"}
            borderRadius="8px"
            _hover={{
              bg: "rgba(255, 255, 255, 0.1)",
            }}
            aria-label={option.label}
            display="flex"
            color="white"
            bg={selectedOption === option.label ? "rgba(255,255,255,0.15)" : undefined}
            onClick={() => onSelectOption(option)}
          >
            <Flex align="center" gap={2}>
              {option.icon}
              <Text>{option.label}</Text>
            </Flex>
          </Button>
        ))}
      </Flex>
    </Flex>
  );
};

export default SideBar;