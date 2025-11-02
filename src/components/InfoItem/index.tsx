import { ElementType } from 'react'
import { Flex, Icon, Box, Text } from '@chakra-ui/react'

interface InfoItemProps {
  icon: ElementType
  label: string
  value: string | number | undefined
}

export const InfoItem = ({ icon, label, value }: InfoItemProps) => (
  <Flex align="center" gap={3}>
    <Icon as={icon} color="gray.500" />
    <Box>
      <Text fontSize="xs" color="gray.500">
        {label}
      </Text>
      <Text fontWeight="medium">{value || '-'}</Text>
    </Box>
  </Flex>
)

export default InfoItem
