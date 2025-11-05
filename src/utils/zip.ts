import { toaster } from '@/components/ui/toaster'
import JSZip from 'jszip'

export const createZipFile = async (files: File[]) => {
  try {
    const zip = new JSZip()

    for (const file of files) {
      zip.file(file.name, file)
    }

    const zipBlob = await zip.generateAsync({ type: 'blob' })

    const zipFile = new File([zipBlob], 'documentos.zip', {
      type: 'application/zip'
    })

    return zipFile
  } catch (error) {
    console.error('Erro ao criar arquivo ZIP:', error)
    toaster.create({
      title: 'Erro na compactação',
      description: 'Não foi possível compactar os arquivos.',
      type: 'error',
      duration: 5000
    })
    return null
  }
}
