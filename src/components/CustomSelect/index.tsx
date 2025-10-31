'use client'
import { Select, Portal, createListCollection } from '@chakra-ui/react'
import { useState } from 'react'

export interface SelectOption {
  label: string;
  value: string;
}

interface CustomSelectProps {
  label: string;
  placeholder: string;
  options: SelectOption[];
  onValueChange: (value: string[]) => void;
  value?: string[];
  isRequired?: boolean;
  disabled?: boolean;
  clearable?: boolean;
  multiple?: boolean;
  size?: 'sm' | 'md' | 'lg';
  variant?: 'outline' | 'filled' | 'flushed';
  defaultValue?: string[]; // Adicionar valor padrão
}

export const CustomSelect = ({
  label,
  placeholder,
  options,
  onValueChange,
  value = [],
  isRequired = false,
  disabled = false,
  clearable = true,
  multiple = false,
  size = 'md',
  variant = 'outline',
  defaultValue = []
}: CustomSelectProps) => {
  const [isEmpty, setIsEmpty] = useState(options.length === 0)
  const collection = createListCollection({
    items: options
  })
  const handleValueChange = (details: { value: string[] }) => {
    onValueChange(details.value)
  }
  const currentValue = value.length > 0 ? value : defaultValue

  const getSelectStyles = () => {
    const baseStyles = {
      padding: size === 'sm' ? 1 : size === 'lg' ? 3 : 2
    }

    const variantStyles = {
      outline: {
        border: '1px solid #d1d5db',
        borderRadius: 'md',
        _focus: {
          borderColor: '#3182ce',
          boxShadow: '0 0 0 1px #3182ce'
        }
      },
      filled: {
        backgroundColor: '#f7fafc',
        border: '1px solid transparent',
        borderRadius: 'md',
        _focus: {
          backgroundColor: 'white',
          borderColor: '#3182ce'
        }
      },
      flushed: {
        borderRadius: 0,
        borderLeft: 'none',
        borderRight: 'none',
        borderTop: 'none',
        borderBottom: '2px solid #e2e8f0',
        _focus: {
          borderBottomColor: '#3182ce'
        }
      }
    }

    return { ...baseStyles, ...variantStyles[variant] }
  }

  return (
    <Select.Root
      collection={collection}
      onValueChange={handleValueChange}
      value={currentValue}
      multiple={multiple}
      disabled={isEmpty || disabled}
    >
      <Select.HiddenSelect />
      <Select.Label fontWeight="bold" fontSize={size === 'sm' ? 'sm' : 'md'}>
        {label}
        {isRequired && <span style={{ color: 'red', marginLeft: '4px' }}>*</span>}
      </Select.Label>
      <Select.Control>
        <Select.Trigger style={getSelectStyles()}>
          <Select.ValueText placeholder={placeholder} px={4} />
        </Select.Trigger>
        <Select.IndicatorGroup p={size === 'sm' ? 1 : 2}>
          {clearable && <Select.ClearTrigger />}
          <Select.Indicator />
        </Select.IndicatorGroup>
      </Select.Control>
      <Portal>
        <Select.Positioner>
          <Select.Content
            borderRadius="md"
            boxShadow="lg"
            bg="white"
            border="1px solid #e2e8f0"
            maxH="200px"
            overflowY="auto"
          >
            {options.map((option) => (
              <Select.Item
                key={option.value}
                item={option}
                p={size === 'sm' ? 2 : 3}
                cursor="pointer"
                _hover={{ bg: 'gray.50' }}
                _selected={{ bg: 'blue.50', color: 'blue.600' }}
              >
                {option.label}
                <Select.ItemIndicator />
              </Select.Item>
            ))}
          </Select.Content>
        </Select.Positioner>
      </Portal>
    </Select.Root>
  )
}
