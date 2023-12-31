import type { AppProps } from "next/app";
import { ApolloProvider } from "@apollo/client";
import { QueryClientProvider } from "@tanstack/react-query";
import { Circles, Layout, SiteHeader } from "@/components";
import { Provider, ThemeProvider } from "@/providers";
import { apolloClient, queryClient } from "@/utils";
import "@/styles/globals.scss";

export default function App({ Component, pageProps }: AppProps) {
  return (
    <ApolloProvider client={apolloClient}>
      <QueryClientProvider client={queryClient}>
        <ThemeProvider>
          <Provider>
            <SiteHeader />
            <Layout>
              <Component {...pageProps} />
            </Layout>
            <Circles />
          </Provider>
        </ThemeProvider>
      </QueryClientProvider>
    </ApolloProvider>
  );
}
