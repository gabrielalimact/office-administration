import { Box, Button, Field, Fieldset, Flex, Input, Text } from '@chakra-ui/react';
import React, { useState } from 'react';
import { MdOutlineEdit } from "react-icons/md";
import { FaRegSave } from "react-icons/fa";

type UsuarioData = {
  id: number;
  name: string;
  email: string;
  birthdate: string;
  cargo: string;
  
}
const ConfiguracoesPage = () => {
  const [editMode, setEditMode] = useState(false);

  const [usuario, setUsuario] = useState<UsuarioData>({
    id: 1,
    name: "Louise Oliveira",
    email: "louise.oliveira@example.com",
    birthdate: "1990-01-01",
    cargo: "Administrador"
  });

  const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = event.target;
    setUsuario((prev) => ({ ...prev, [name]: value }));
  };

  return (
    <Box>
      <Fieldset.Root minW="full" flex={1}>
        <Fieldset.Content display="flex" flexDir="column">
          <Field.Root mt={2}>
            <Field.Label fontWeight="bold">Nome completo</Field.Label>
            <Input p="12px" name="name" value={usuario.name} onChange={handleInputChange}  disabled={!editMode}/>
          </Field.Root>

          <Field.Root mt={2}>
            <Field.Label fontWeight="bold">Data de nascimento</Field.Label>
            <Input p="12px" name="birthdate" type="date" value={usuario.birthdate} onChange={handleInputChange}  disabled={!editMode}/>
          </Field.Root>

          <Field.Root mt={2}>
            <Field.Label fontWeight="bold">E-mail</Field.Label>
            <Input p="12px" name="email" value={usuario.email} onChange={handleInputChange}  disabled={!editMode}/>
          </Field.Root>

          <Field.Root mt={2}>
            <Field.Label fontWeight="bold">Cargo</Field.Label>
            <Input p="12px" name="cargo" value={usuario.cargo} onChange={handleInputChange}  disabled={!editMode}/>
          </Field.Root>
        </Fieldset.Content>
      </Fieldset.Root>

      <Flex justifyContent="flex-end" mt={3}>
        <Button 
        onClick={() => setEditMode((prev) => !prev)} 
        borderRadius='50px'
        fontWeight='bold'
        width='150px'
        bgColor={editMode ? "green.500" : "var(--darkblue)"}
        >
          {editMode ? <FaRegSave/> : <MdOutlineEdit />}
          {editMode ? `Salvar` : `Editar`}
        </Button>
      </Flex>
    </Box>
  )
};

export default ConfiguracoesPage;
