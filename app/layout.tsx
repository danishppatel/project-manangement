'use client';

import { ThemeProvider, CssBaseline } from '@mui/material';
import theme from './theme';
import { ApolloProvider } from '@apollo/client'
import client from "@/graphql/apollo-client"

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>
        <ThemeProvider theme={theme}>
          <ApolloProvider client={client}>
            <CssBaseline />
            {children}
          </ApolloProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
