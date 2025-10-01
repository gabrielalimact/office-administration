'use client';
import { Provider } from '@/components/ui/provider';
import { LoadingProvider } from '@/components/LoadingContext';
import SideBar from '@/components/SideBar';
import { Flex, Box } from '@chakra-ui/react';
import { Montserrat } from 'next/font/google';
import './globals.css';
import NavBar from '@/components/NavBar';
import { usePathname } from 'next/navigation';
import { UserProvider } from '@/components/UserContext';

const montserratSans = Montserrat({
  variable: '--font-montserrat-sans',
  subsets: ['latin'],
});
export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const pathname = usePathname();
  const showLayout = pathname !== '/';
  return (
    <html lang="pt-br" suppressHydrationWarning>
      <head>
        <link rel="icon" href="/images/balanca.svg" />
        <title>Diego O. Nascimento</title>
        <meta name="description" content="Sistema de Administração de Escritório" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
      </head>
      <body className={`${montserratSans.variable}`}>
        <UserProvider>
          <Provider>
            <LoadingProvider>
              {showLayout ? (
                <Flex direction="row" minHeight="100vh">
                  <SideBar />
                  <Box flex={1} minHeight="100vh" display="flex" flexDirection="column">
                    <NavBar />
                    <Box flex={1}>{children}</Box>
                  </Box>
                </Flex>
              ) : (
                children
              )}
            </LoadingProvider>
          </Provider>
        </UserProvider>
      </body>
    </html>
  );
}
