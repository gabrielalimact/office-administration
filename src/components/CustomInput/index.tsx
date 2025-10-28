import { Field, Fieldset, IconButton, Input, InputGroup, InputProps } from '@chakra-ui/react';
import { IoSearchOutline } from 'react-icons/io5';

type Props = {
  label?: string;
  type?: string;
  placeholder?: string;
  value?: string;
  onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onKeyDown?: (e: React.KeyboardEvent<HTMLInputElement>) => void;
  isPassword?: boolean;
  isSearch?: boolean;
} & InputProps;
const CustomInput = ({
  label,
  type = 'text',
  placeholder = '',
  value = '',
  onChange,
  onKeyDown,
  isPassword = false,
  isSearch = false,
  ...rest
}: Props) => {
  return (
    <Field.Root>
      {label && <Field.Label fontWeight="bold">{label}</Field.Label>}

      {isSearch ? (
        <InputGroup
          endElement={
            <IconButton variant="ghost" aria-label="Buscar">
              <IoSearchOutline />
            </IconButton>
          }
        >
          <Input
            placeholder={placeholder}
            p={5}
            borderRadius="4px"
            border={'1px solid #717171ff'}
            {...rest}
          />
        </InputGroup>
      ) : (
        <Input
          {...rest}
          placeholder={placeholder}
          type={isPassword ? 'password' : type}
          value={value}
          onChange={onChange}
          onKeyDown={onKeyDown}
          px={3}
          border={'1px solid #717171ff'}
          borderRadius={'4px'}
        />
      )}
    </Field.Root>
  );
};

export default CustomInput;
