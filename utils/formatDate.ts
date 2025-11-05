export function formatDate(value: string | Date): string {
  const pad = (n: number) => n.toString().padStart(2, '0')

  if (value instanceof Date) {
    if (isNaN(value.getTime())) return ''
    const day = pad(value.getDate())
    const month = pad(value.getMonth() + 1)
    const year = value.getFullYear()
    return `${day}/${month}/${year}`
  }

  if (typeof value !== 'string') return ''

  const isoMatch = value.match(/^(\d{4})-(\d{2})-(\d{2})$/)
  if (isoMatch) {
    const [, y, m, d] = isoMatch
    return `${d}/${m}/${y}`
  }

  const parsed = new Date(value)
  if (!isNaN(parsed.getTime())) {
    return formatDate(parsed)
  }

  return ''
}

export function formatDateHour(value: string | Date): string {
  const pad = (n: number) => n.toString().padStart(2, '0')

  let date: Date
  if (value instanceof Date) {
    date = value
  } else {
    date = new Date(value)
  }

  if (isNaN(date.getTime())) return ''

  const day = pad(date.getDate())
  const month = pad(date.getMonth() + 1)
  const year = date.getFullYear()
  const hours = pad(date.getHours())
  const minutes = pad(date.getMinutes())

  return `às ${hours}:${minutes} de ${day}/${month}/${year}`
}
