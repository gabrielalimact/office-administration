'use client'
import { Box, Flex, Text } from '@chakra-ui/react'
import Link from 'next/link'
import { useBreadcrumb } from './BreadcrumbContext'
import { IoChevronForward, IoHome } from 'react-icons/io5'
import { capitalizeFirstLetter } from '../../utils/string'

export default function Breadcrumb() {
  const { breadcrumbs } = useBreadcrumb()

  if (breadcrumbs.length <= 1) return null

  return (
    <Box mb={4} p={3} borderBottom={'1px solid #c2c2c2ff'}>
      <Flex align="center" gap={2} flexWrap="wrap">
        <IoHome size={16} color="#4A90E2" />

        {breadcrumbs.map((item, index) => (
          <Flex key={item.path} align="center" gap={2}>
            {index === breadcrumbs.length - 1 ? (
              <Text color="gray.600" fontSize="sm">
                {capitalizeFirstLetter(item.label)}
              </Text>
            ) : (
              <Link href={item.path} style={{ textDecoration: 'none' }}>
                <Text
                  color="#4A90E2"
                  fontWeight="bold"
                  fontSize="sm"
                  _hover={{ textDecoration: 'underline' }}
                  cursor="pointer"
                >
                  {capitalizeFirstLetter(item.label)}
                </Text>
              </Link>
            )}
            {index < breadcrumbs.length - 1 && <IoChevronForward size={12} color="#666" />}
          </Flex>
        ))}
      </Flex>
    </Box>
  )
}
