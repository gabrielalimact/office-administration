import { Button, CloseButton, Dialog, Portal } from '@chakra-ui/react'

type ModalProps = {
  hasButton?: boolean;
  buttonText?: string;
  children?: React.ReactNode;
  icon?: React.ReactNode;
  title: string;
  size?: 'sm' | 'md' | 'lg' | 'xl';
};
export const Modal = ({
  hasButton = true,
  buttonText = 'Open Modal',
  icon,
  children,
  title,
  size = 'lg',
}: ModalProps) => {
  return (
    <Dialog.Root size={size} placement="center" motionPreset="slide-in-bottom">
      <Dialog.Trigger asChild>
        {hasButton ? (
          <Button variant="outline" size="sm">
            {buttonText}
          </Button>
        ) : (
          icon
        )}
      </Dialog.Trigger>
      <Portal>
        <Dialog.Backdrop />
        <Dialog.Positioner>
          <Dialog.Content padding="6">
            <Dialog.Header display="flex" justifyContent="space-between" alignItems="center" mb={4}>
              <Dialog.Title>{title}</Dialog.Title>
              <Dialog.CloseTrigger asChild>
                <CloseButton size="sm" />
              </Dialog.CloseTrigger>
            </Dialog.Header>
            <Dialog.Body>{children}</Dialog.Body>
          </Dialog.Content>
        </Dialog.Positioner>
      </Portal>
    </Dialog.Root>
  )
}
