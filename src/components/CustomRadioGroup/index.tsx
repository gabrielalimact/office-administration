import { RadioGroup, HStack, UseRadioGroupProps } from '@chakra-ui/react';
type Item = {
  label: string;
  value: string;
};

type Props = {
  items: Item[];
  onChange: (value: string) => void;
  value?: string;
} & UseRadioGroupProps;

const CustomRadioGroup = ({ items, onChange, value, ...rest }: Props) => {
  const handleValueChange = (details: { value: string | null }) => {
    if (details.value) {
      onChange(details.value);
    }
  };

  return (
    <RadioGroup.Root mt={4} onValueChange={handleValueChange} value={value} {...rest}>
      <HStack gap="6">
        {items.map((item) => (
          <RadioGroup.Item key={item.value} value={item.value}>
            <RadioGroup.ItemHiddenInput />
            <RadioGroup.ItemIndicator />
            <RadioGroup.ItemText>{item.label}</RadioGroup.ItemText>
          </RadioGroup.Item>
        ))}
      </HStack>
    </RadioGroup.Root>
  );
};

export default CustomRadioGroup;
