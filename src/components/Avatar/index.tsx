import { Box, Image, Text } from '@chakra-ui/react'
import { useAvatar } from '@/hooks/useAvatar'

interface AvatarProps {
  avatarPath?: string
  userName?: string
  size?: string
  fontSize?: string
  fallbackColor?: string
  fallbackBg?: string
  borderRadius?: string
  showLoading?: boolean
}

export const Avatar = ({
  avatarPath,
  userName = '',
  size = '40px',
  fontSize = 'lg',
  fallbackColor = 'white',
  fallbackBg = '#A8D0F0',
  borderRadius = '50%',
  showLoading = true
}: AvatarProps) => {
  const { avatarUrl, isLoading, error } = useAvatar(avatarPath)

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
      {isLoading && showLoading ? (
        <Text fontSize="sm" color={fallbackColor}>
          ...
        </Text>
      ) : avatarUrl && !error ? (
        <Image src={avatarUrl} alt={userName} width="100%" height="100%" objectFit="cover" />
      ) : (
        <Text fontSize={fontSize} fontWeight="bold" color={fallbackColor}>
          {userName.charAt(0).toUpperCase()}
        </Text>
      )}
    </Box>
  )
}
