'use client'
import { Flex, IconButton } from "@chakra-ui/react";
import { CiMenuBurger } from "react-icons/ci";
import { useState } from "react";
import SideBar from "@/components/SideBar";
import InicioPage from "./pages/InicioPage";
import ProcessosPage from "./pages/ProcessosPage";
import CadastrarProcessosPage from "./pages/CadastrarProcessosPage";
import FuncionariosRelatoriosPage from "./pages/FuncionariosRelatoriosPage";
import ConfiguracoesPage from "./pages/ConfiguracoesPage";


const Home = () => {
  const [sidebarVisible, setSidebarVisible] = useState(true);
  const [selectedOption, setSelectedOption] = useState('Início');
  const handleToggleSidebar = () => setSidebarVisible((v) => !v);

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
        <SideBar onSelectOption={setSelectedOption} selectedOption={selectedOption} />
      )}
      <Flex style={{ 
        flexDirection: "column",
        padding: sidebarVisible ? "20px" : "20px 80px",
        flex: 1,
        }}>
        {renderContent()}
      </Flex>
    </Flex>
  );
};


export default Home;