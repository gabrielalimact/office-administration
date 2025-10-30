'use client'
import { createContext, useContext, useState, ReactNode } from 'react'
import { Flex, Spinner, Box } from '@chakra-ui/react'

interface LoadingContextProps {
  isLoading: boolean;
  setLoading: (value: boolean) => void;
}

const LoadingContext = createContext<LoadingContextProps | undefined>(undefined)

export function useLoading() {
  const ctx = useContext(LoadingContext)
  if (!ctx) throw new Error('useLoading must be used within LoadingProvider')
  return ctx
}

export function LoadingProvider({ children }: { children: ReactNode }) {
  const [isLoading, setLoading] = useState(false)

  return (
    <LoadingContext.Provider value={{ isLoading, setLoading }}>
      {isLoading && (
        <Flex
          position="fixed"
          top={0}
          left={0}
          w="100vw"
          h="100vh"
          bg="rgba(255,255,255,0.7)"
          zIndex={2000}
          align="center"
          justify="center"
        >
          <Box>
            <Spinner size="xl" color="blue.500" />
          </Box>
        </Flex>
      )}
      {children}
    </LoadingContext.Provider>
  )
}
