export default function formatDate(value: string | Date): string {
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
