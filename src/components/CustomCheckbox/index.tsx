import { Checkbox } from '@chakra-ui/react'

type Props = {
  label: string
  isChecked: boolean
  onChange: () => void
}
const CustomCheckbox = ({ label, isChecked, onChange }: Props) => {
  return (
    <Checkbox.Root checked={isChecked} onCheckedChange={onChange}>
      <Checkbox.HiddenInput />
      <Checkbox.Control
        bgColor={isChecked ? 'blue.500' : ''}
        borderRadius="50%"
        padding={1}
        h={6}
        w={6}
      />
      <Checkbox.Label>{label}</Checkbox.Label>
    </Checkbox.Root>
  )
}
export default CustomCheckbox
