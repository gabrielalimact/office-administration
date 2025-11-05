import { Box, Text } from '@chakra-ui/react'

interface AvatarProps {
  userName?: string
  size?: string
  fontSize?: string
  fallbackColor?: string
  fallbackBg?: string
  borderRadius?: string
}

export const Avatar = ({
  userName = '',
  size = '40px',
  fontSize = 'lg',
  fallbackColor = 'white',
  fallbackBg = '#A8D0F0',
  borderRadius = '50%'
}: AvatarProps) => {
  return (
    <Box
      width={size}
      height={size}
      borderRadius={borderRadius}
      backgroundColor={fallbackBg}
      display="flex"
      alignItems="center"
      justifyContent="center"
      overflow="hidden"
    >
      <Text fontSize={fontSize} fontWeight="bold" color={fallbackColor}>
        {userName.charAt(0).toUpperCase()}
      </Text>
    </Box>
  )
}
