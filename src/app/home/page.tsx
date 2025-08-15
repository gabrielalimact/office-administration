'use client'
import { Flex, Icon, IconButton, Text } from "@chakra-ui/react";
import { CiMenuBurger } from "react-icons/ci";
import { useState } from "react";
import SideBar, { OptionsMenu } from "@/components/SideBar";
import InicioPage from "./pages/InicioPage";
import ProcessosPage from "./pages/ProcessosPage";
import CadastrarProcessosPage from "./pages/CadastrarProcessosPage";
import FuncionariosRelatoriosPage from "./pages/FuncionariosRelatoriosPage";
import ConfiguracoesPage from "./pages/ConfiguracoesPage";
import { MdPersonAdd } from "react-icons/md";
import { BsPersonVcard } from "react-icons/bs";
import { FaRegFileAlt } from "react-icons/fa";
import { IoSettingsOutline } from "react-icons/io5";
import { LuFilePlus2 } from "react-icons/lu";


const Home = () => {
  const [sidebarVisible, setSidebarVisible] = useState(true);
  const [selectedOption, setSelectedOption] = useState('Início');
  const [iconSelected, setIconSelected] = useState(<MdPersonAdd />);
  const handleToggleSidebar = () => setSidebarVisible((v) => !v);

  const handleSelectOption = (option: OptionsMenu) => {
    switch (option.label) {
      case 'Início':
        setSelectedOption('Início');
        setIconSelected(<MdPersonAdd />);
        break;
      case 'Processos':
        setSelectedOption('Processos');
        setIconSelected(<FaRegFileAlt />);
        break;
      case 'Cadastrar processos':
        setSelectedOption('Cadastrar processos');
        setIconSelected(<LuFilePlus2 />);
        break;
      case 'Funcionários e relatórios':
        setSelectedOption('Funcionários e relatórios');
        setIconSelected(<BsPersonVcard />);
        break;
      case 'Configurações':
        setSelectedOption('Configurações');
        setIconSelected(<IoSettingsOutline />);
        break;
    }
  };

  const renderContent = () => {
    switch (selectedOption) {
      case 'Início':
        return <InicioPage />;
      case 'Processos':
        return <ProcessosPage />;
      case 'Cadastrar processos':
        return <CadastrarProcessosPage />;
      case 'Funcionários e relatórios':
        return <FuncionariosRelatoriosPage />;
      case 'Configurações':
        return <ConfiguracoesPage />;
      default:
        return <InicioPage />;
    }
  };

  return (
    <Flex>
      <IconButton
        variant={sidebarVisible ? "ghost" : "surface"}
        color={sidebarVisible ? "white" : "black"}
        _hover={{
          bg: "rgba(255, 255, 255, 0.1)",
          borderColor: "white",
        }}
        onClick={handleToggleSidebar}
        style={{
          position: "fixed",
          top: "20px",
          left: "20px",
          zIndex: 1000,
        }}
        aria-label={sidebarVisible ? "Fechar sidebar" : "Abrir sidebar"}
      >
        <CiMenuBurger />
      </IconButton>
      {sidebarVisible && (
        <SideBar onSelectOption={handleSelectOption} selectedOption={selectedOption} />
      )}
      <Flex style={{ 
        flexDirection: "column",
        padding: sidebarVisible ? "20px" : "20px 80px",
        flex: 1,
        }}>
          <Flex style={{
            alignItems: 'center',
            gap: '8px',
            borderBottom: "1px solid",
            borderColor: "gray",
            paddingBottom: "12px",
            marginBottom: "12px"
          }}>
            <Icon size="2xl" color="var(--darkblue)">
              {iconSelected}
            </Icon>
            <Text fontSize="2xl" fontWeight="bold" color="var(--darkblue)">{selectedOption}</Text>
          </Flex>
          {renderContent()}
      </Flex>
    </Flex>
  );
};


export default Home;