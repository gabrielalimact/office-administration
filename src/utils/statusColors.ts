export const getStatusColors = (status?: string, arquivado?: boolean) => {
  if (arquivado) return { bg: 'gray.100', color: 'gray.700' }

  switch (status) {
    case 'AUDIENCIA':
      return { bg: 'orange.100', color: 'orange.800' }
    case 'PERÍCIA':
      return { bg: 'blue.100', color: 'blue.800' }
    default:
      return { bg: 'green.100', color: 'green.800' }
  }
}
