'use client';
import { Box, Flex, Text } from '@chakra-ui/react';
import Link from 'next/link';
import { useBreadcrumb } from './BreadcrumbContext';
import { IoChevronForward } from 'react-icons/io5';

export default function Breadcrumb() {
  const { breadcrumbs } = useBreadcrumb();

  if (breadcrumbs.length <= 1) return null;

  return (
    <Box mb={4} p={3} borderBottom={'1px solid #c2c2c2ff'}>
      <Flex align="center" gap={2} flexWrap="wrap">
        {breadcrumbs.map((item, index) => (
          <Flex key={item.path} align="center" gap={2}>
            {index === breadcrumbs.length - 1 ? (
              <Flex align="center" gap={2}>
                {item.icon}
                <Text color="gray.900" fontWeight="bold">
                  {item.label}
                </Text>
              </Flex>
            ) : (
              <Link href={item.path} style={{ textDecoration: 'none' }}>
                <Flex align="center" color="blue.700">
                  <Text
                    _hover={{ color: 'blue.800', textDecoration: 'underline' }}
                    cursor="pointer"
                    fontWeight="bold"
                  >
                    {item.label}
                  </Text>
                </Flex>
              </Link>
            )}
            {index < breadcrumbs.length - 1 && <IoChevronForward size={14} color="gray" />}
          </Flex>
        ))}
      </Flex>
    </Box>
  );
}
