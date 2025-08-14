'use client'
import { Flex, Text, Image, IconButton } from "@chakra-ui/react";
import { CiMenuBurger } from "react-icons/ci";
import { useState } from "react";
import SideBar from "@/components/SideBar";


const Home = () => {
  const [sidebarVisible, setSidebarVisible] = useState(true);
  const [selectedOption, setSelectedOption] = useState('Início');
  const handleToggleSidebar = () => setSidebarVisible((v) => !v);

  // Conteúdos para cada opção
  const renderContent = () => {
    switch (selectedOption) {
      case 'Início':
        return <Text>Bem-vindo à página inicial!</Text>;
      case 'Processos':
        return <Text>Lista de processos aqui.</Text>;
      case 'Cadastrar processos':
        return <Text>Formulário de cadastro de processos.</Text>;
      case 'Funcionários e relatórios':
        return <Text>Informações de funcionários e relatórios.</Text>;
      case 'Configurações':
        return <Text>Painel de configurações.</Text>;
      default:
        return <Text>Conteúdo Principal</Text>;
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
      <Flex style={{ marginLeft: sidebarVisible ? 260 : 0, padding: 32, flex: 1 }}>
        {renderContent()}
      </Flex>
    </Flex>
  );
};


export default Home;