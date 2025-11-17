import { Box, Button, CloseButton, Dialog, Portal } from '@chakra-ui/react'
import { useState } from 'react'

type ModalProps = {
  hasButton?: boolean
  buttonText?: string
  children?: React.ReactNode
  icon?: React.ReactNode
  title: string
  size?: 'sm' | 'md' | 'lg' | 'xl'
  onClose?: () => void
  open?: boolean
  isActive?: boolean
}
export const Modal = ({
  hasButton = true,
  buttonText = 'Open Modal',
  icon,
  children,
  title,
  size = 'lg',
  onClose,
  open,
  isActive = false
}: ModalProps) => {
  const [isFilterModalOpen, setIsFilterModalOpen] = useState(open)
  return (
    <Dialog.Root
      size={size}
      placement="center"
      motionPreset="slide-in-bottom"
      open={isFilterModalOpen}
      onOpenChange={({ open: isOpen }) => {
        if (!isOpen && onClose) {
          onClose()
          setIsFilterModalOpen(false)
        }
      }}
    >
      <Dialog.Trigger asChild>
        <Box>
          {hasButton ? (
            <Box position="relative" display="inline-block">
              <Button
                variant={isActive ? 'solid' : 'outline'}
                size="sm"
                p={4}
                display="flex"
                alignItems="center"
                gap={2}
                bgColor={isActive ? '#4976e6' : ''}
                onClick={() => setIsFilterModalOpen(true)}
              >
                {icon}
                {buttonText}
              </Button>

              {isActive && (
                <Box
                  position="absolute"
                  top="-4px"
                  right="-4px"
                  w="12px"
                  h="12px"
                  bg="red.500"
                  borderRadius="full"
                />
              )}
            </Box>
          ) : (
            icon
          )}
        </Box>
      </Dialog.Trigger>

      <Portal>
        <Dialog.Backdrop onClick={onClose} />
        <Dialog.Positioner>
          <Dialog.Content padding="6">
            <Dialog.Header display="flex" justifyContent="space-between" alignItems="center" mb={4}>
              <Dialog.Title>{title}</Dialog.Title>
              <Dialog.CloseTrigger asChild>
                <CloseButton size="sm" onClick={onClose} />
              </Dialog.CloseTrigger>
            </Dialog.Header>
            <Dialog.Body>{children}</Dialog.Body>
          </Dialog.Content>
        </Dialog.Positioner>
      </Portal>
    </Dialog.Root>
  )
}
