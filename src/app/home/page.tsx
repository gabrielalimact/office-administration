'use client'
import { Flex, Icon, IconButton, Text } from "@chakra-ui/react";
import { CiMenuBurger } from "react-icons/ci";
import { JSX, useState } from "react";
import SideBar, { OptionsMenu } from "@/components/SideBar";
import ProcessosPage from "./pages/ProcessosPage";
import CadastrarProcessosPage from "./pages/CadastrarProcessosPage";
import FuncionariosRelatoriosPage from "./pages/FuncionariosRelatoriosPage";
import ConfiguracoesPage from "./pages/ConfiguracoesPage";
import { BsPersonVcard } from "react-icons/bs";
import { FaRegFileAlt } from "react-icons/fa";
import { IoSettingsOutline } from "react-icons/io5";
import { LuFilePlus2 } from "react-icons/lu";

const pagesConfig: Record<string, { icon: JSX.Element; component: JSX.Element }> = {
  "Processos": { icon: <FaRegFileAlt />, component: <ProcessosPage /> },
  "Cadastrar processos": { icon: <LuFilePlus2 />, component: <CadastrarProcessosPage /> },
  "Funcionários e relatórios": { icon: <BsPersonVcard />, component: <FuncionariosRelatoriosPage /> },
  "Configurações": { icon: <IoSettingsOutline />, component: <ConfiguracoesPage /> },
};

const Home = () => {
  const [sidebarVisible, setSidebarVisible] = useState(true);
  const [selectedOption, setSelectedOption] = useState<keyof typeof pagesConfig>("Processos");

  const handleToggleSidebar = () => setSidebarVisible((v) => !v);

  const handleSelectOption = (option: OptionsMenu) => {
    if (pagesConfig[option.label]) {
      setSelectedOption(option.label as keyof typeof pagesConfig);
    }
  };

  const { icon, component } = pagesConfig[selectedOption];

  return (
    <Flex>
      <IconButton
        variant={sidebarVisible ? "ghost" : "surface"}
        color={sidebarVisible ? "white" : "black"}
        _hover={{ bg: "rgba(255, 255, 255, 0.1)", borderColor: "white" }}
        onClick={handleToggleSidebar}
        position="fixed"
        top="20px"
        left="20px"
        zIndex={1000}
        aria-label={sidebarVisible ? "Fechar sidebar" : "Abrir sidebar"}
      >
        <CiMenuBurger />
      </IconButton>

      {sidebarVisible && (
        <SideBar onSelectOption={handleSelectOption} selectedOption={selectedOption} />
      )}

      <Flex flexDirection="column" p={sidebarVisible ? "20px" : "20px 80px"} flex={1}>
        <Flex alignItems="center" gap="8px" borderBottom="1px solid" borderColor="gray" pb="12px" mb="12px">
          <Icon fontSize="2xl" color="var(--darkblue)">
            {icon}
          </Icon>
          <Text fontSize="2xl" fontWeight="bold" color="var(--darkblue)">{selectedOption}</Text>
        </Flex>
        {component}
      </Flex>
    </Flex>
  );
};

export default Home;
