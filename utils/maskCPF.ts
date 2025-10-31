/**
 * Remove todos os caracteres não numéricos de uma string
 */
export function removeNonNumeric(value: string): string {
  return value.replace(/\D/g, '')
}

/**
 * Aplica máscara de CPF (XXX.XXX.XXX-XX)
 */
export function maskCPF(value: string): string {
  const numericValue = removeNonNumeric(value)
  const limitedValue = numericValue.slice(0, 11)

  return limitedValue
    .replace(/(\d{3})(\d)/, '$1.$2')
    .replace(/(\d{3})(\d)/, '$1.$2')
    .replace(/(\d{3})(\d{1,2})/, '$1-$2')
}

/**
 * Remove a máscara do CPF, retornando apenas números
 */
export function unmaskCPF(value: string): string {
  return removeNonNumeric(value)
}

/**
 * Valida se o CPF é válido (algoritmo oficial)
 */
export function validateCPF(cpf: string): boolean {
  const cleanCPF = unmaskCPF(cpf)

  if (cleanCPF.length !== 11) return false
  if (/^(\d)\1{10}$/.test(cleanCPF)) return false
  let sum = 0
  for (let i = 0; i < 9; i++) {
    sum += parseInt(cleanCPF[i]) * (10 - i)
  }
  let firstDigit = 11 - (sum % 11)
  if (firstDigit >= 10) firstDigit = 0

  if (parseInt(cleanCPF[9]) !== firstDigit) return false
  sum = 0
  for (let i = 0; i < 10; i++) {
    sum += parseInt(cleanCPF[i]) * (11 - i)
  }
  let secondDigit = 11 - (sum % 11)
  if (secondDigit >= 10) secondDigit = 0

  return parseInt(cleanCPF[10]) === secondDigit
}

/**
 * Verifica se o CPF está com formatação válida (XXX.XXX.XXX-XX)
 */
export function isValidCPFFormat(value: string): boolean {
  const cpfRegex = /^\d{3}\.\d{3}\.\d{3}-\d{2}$/
  return cpfRegex.test(value)
}

/**
 * Formata CPF para exibição, validando e aplicando máscara
 */
export function formatCPF(value: string): {
  formatted: string
  isValid: boolean
  error?: string
} {
  if (!value) {
    return {
      formatted: '',
      isValid: false,
      error: 'CPF é obrigatório'
    }
  }

  const masked = maskCPF(value)
  const isValid = validateCPF(masked)

  return {
    formatted: masked,
    isValid,
    error: isValid ? undefined : 'CPF inválido'
  }
}

/**
 * Hook/função para usar em inputs com máscara de CPF
 */
export function useCPFMask() {
  const handleChange = (value: string) => {
    return maskCPF(value)
  }

  const validate = (value: string) => {
    return validateCPF(value)
  }

  const format = (value: string) => {
    return formatCPF(value)
  }

  return {
    mask: handleChange,
    validate,
    format,
    unmask: unmaskCPF
  }
}

export default maskCPF
