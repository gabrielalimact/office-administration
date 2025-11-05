import { useState, useEffect } from 'react'

export const useAvatar = (avatarPath?: string) => {
  const [avatarUrl, setAvatarUrl] = useState<string>('')
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchAvatar = async () => {
      if (!avatarPath) {
        setAvatarUrl('')
        setError(null)
        return
      }

      setIsLoading(true)
      setError(null)

      setAvatarUrl((prevAvatarUrl) => {
        if (prevAvatarUrl && prevAvatarUrl.startsWith('blob:')) {
          URL.revokeObjectURL(prevAvatarUrl)
        }
        return ''
      })

      try {
        const response = await fetch(`${avatarPath}`)

        if (response.ok) {
          const blob = await response.blob()
          const newAvatarUrl = URL.createObjectURL(blob)
          setAvatarUrl(newAvatarUrl)
        } else {
          setError(`Erro ao carregar avatar: ${response.status}`)
        }
      } catch (err) {
        console.error('Erro ao carregar avatar:', err)
        setError('Erro de conexão ao carregar avatar')
      } finally {
        setIsLoading(false)
      }
    }

    fetchAvatar()
  }, [avatarPath])

  useEffect(() => {
    return () => {
      if (avatarUrl && avatarUrl.startsWith('blob:')) {
        URL.revokeObjectURL(avatarUrl)
      }
    }
  }, [avatarUrl])

  return {
    avatarUrl,
    isLoading,
    error,
    clearAvatar: () => {
      if (avatarUrl && avatarUrl.startsWith('blob:')) {
        URL.revokeObjectURL(avatarUrl)
      }
      setAvatarUrl('')
    }
  }
}
