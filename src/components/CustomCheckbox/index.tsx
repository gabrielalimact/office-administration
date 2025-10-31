import { Checkbox } from '@chakra-ui/react'

type Props = {
  label: string;
  isChecked: boolean;
  onChange: () => void;
};
const CustomCheckbox = ({ label, isChecked, onChange }: Props) => {
  return (
    <Checkbox.Root checked={isChecked} onCheckedChange={onChange}>
      <Checkbox.HiddenInput />
      <Checkbox.Control />
      <Checkbox.Label>{label}</Checkbox.Label>
    </Checkbox.Root>
  )
}
export default CustomCheckbox
