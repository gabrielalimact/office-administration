import { Input, Field } from '@chakra-ui/react'
import { useState, useEffect } from 'react'
import { maskCPF, validateCPF, unmaskCPF } from '../../../utils/maskCPF'

interface CPFInputProps {
  label?: string;
  placeholder?: string;
  value?: string;
  onChange?: (value: string, isValid: boolean) => void;
  onValidation?: (isValid: boolean, error?: string) => void;
  variant?: 'outline' | 'flushed' | 'subtle';
  size?: 'xs' | 'sm' | 'md' | 'lg';
  required?: boolean;
  disabled?: boolean;
}

export function CPFInput({
  label = 'CPF',
  placeholder = 'Digite o CPF',
  value = '',
  onChange,
  onValidation,
  variant = 'outline',
  size = 'md',
  required = false,
  disabled = false,
}: CPFInputProps) {
  const [inputValue, setInputValue] = useState(maskCPF(value))
  const [error, setError] = useState<string | undefined>()

  // Atualiza o valor quando a prop value muda
  useEffect(() => {
    setInputValue(maskCPF(value))
  }, [value])

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const rawValue = e.target.value
    const maskedValue = maskCPF(rawValue)
    const unmaskedValue = unmaskCPF(maskedValue)

    setInputValue(maskedValue)

    // Validação
    let valid = false
    let errorMessage: string | undefined

    if (maskedValue.length === 0) {
      if (required) {
        errorMessage = 'CPF é obrigatório'
      }
    } else if (maskedValue.length < 14) {
      errorMessage = 'CPF incompleto'
    } else {
      valid = validateCPF(maskedValue)
      if (!valid) {
        errorMessage = 'CPF inválido'
      }
    }

    setError(errorMessage)

    // Chama os callbacks
    onChange?.(unmaskedValue, valid)
    onValidation?.(valid, errorMessage)
  }

  const handleBlur = () => {
    // Validação final no blur
    if (inputValue.length > 0 && inputValue.length < 14) {
      setError('CPF incompleto')
      onValidation?.(false, 'CPF incompleto')
    }
  }

  return (
    <Field.Root invalid={!!error} required={required}>
      {label && <Field.Label>{label}</Field.Label>}
      <Input
        type="text"
        placeholder={placeholder}
        value={inputValue}
        onChange={handleChange}
        onBlur={handleBlur}
        variant={variant}
        size={size}
        disabled={disabled}
        maxLength={14}
      />
      {error && <Field.ErrorText>{error}</Field.ErrorText>}
    </Field.Root>
  )
}

export default CPFInput
