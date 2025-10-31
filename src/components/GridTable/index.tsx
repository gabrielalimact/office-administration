import { Box, Text } from '@chakra-ui/react'
import { ReactNode } from 'react'

interface GridTableColumn {
  key: string
  label: string
  width?: string
  align?: 'left' | 'center' | 'right'
}

interface GridTableProps<T = Record<string, unknown>> {
  columns: GridTableColumn[]
  data: T[]
  onRowClick?: (item: T) => void
  renderCell?: (item: T, column: GridTableColumn) => ReactNode
  emptyMessage?: string
}

export function GridTable<T = Record<string, unknown>>({
  columns,
  data,
  onRowClick,
  renderCell,
  emptyMessage = 'Nenhum item encontrado'
}: GridTableProps<T>) {
  const gridTemplateColumns = columns.map((col) => col.width || '1fr').join(' ')

  return (
    <Box borderRadius="4px" bg="white" overflow="hidden" border="1px solid" borderColor="gray.200">
      <Box
        display="grid"
        gridTemplateColumns={gridTemplateColumns}
        bgColor="#4976e6"
        borderBottom="1px solid"
        borderColor="gray.400"
        minHeight="50px"
        alignItems="center"
        px={4}
        gap={5}
      >
        {columns.map((column) => (
          <Text
            key={column.key}
            fontSize="sm"
            fontWeight="bold"
            color="whiteAlpha.900"
            textAlign={column.align || 'left'}
          >
            {column.label.toUpperCase()}
          </Text>
        ))}
      </Box>

      {data.length === 0 ? (
        <Box p={8} textAlign="center" color="gray.500">
          {emptyMessage}
        </Box>
      ) : (
        data.map((item, index) => (
          <Box
            key={(item as { id?: string | number }).id || index}
            display="grid"
            gap={5}
            gridTemplateColumns={gridTemplateColumns}
            minHeight="50px"
            alignItems="center"
            px={4}
            borderBottom={index < data.length - 1 ? '1px solid' : 'none'}
            borderColor="gray.300"
            cursor={onRowClick ? 'pointer' : 'default'}
            transition="background-color 0.2s"
            _hover={
              onRowClick
                ? {
                    bg: 'gray.50'
                  }
                : {}
            }
            onClick={() => onRowClick?.(item)}
          >
            {columns.map((column) => (
              <Box
                key={column.key}
                display="flex"
                alignItems="center"
                textAlign={column.align || 'left'}
                justifyContent={
                  column.align === 'center'
                    ? 'center'
                    : column.align === 'right'
                      ? 'flex-end'
                      : 'flex-start'
                }
                fontSize={'sm'}
              >
                {renderCell ? (
                  renderCell(item, column)
                ) : (
                  <Text color="gray.700">
                    {String((item as Record<string, unknown>)[column.key] || '')}
                  </Text>
                )}
              </Box>
            ))}
          </Box>
        ))
      )}
    </Box>
  )
}

export default GridTable
