import { SessionProvider } from "next-auth/react";
import { Global } from "@emotion/react";
import { Layout } from "../src/components/layout";
import type { AppProps } from "next/app";
import { GlobalStyles } from "../styles/globalStyles";
import { RecoilRoot } from "recoil";
import { SWRConfig } from "swr";

export default function App({
  Component,
  pageProps: { session, ...pageProps },
}: AppProps) {
  return (
    <RecoilRoot>
      <SessionProvider session={session}>
        <SWRConfig
          value={{
            fetcher: (url: string) =>
              fetch(url).then((response) => response.json()),
          }}
        >
          <>
            <Global styles={GlobalStyles} />
            <Layout>
              <Component {...pageProps} />
            </Layout>
          </>
        </SWRConfig>
      </SessionProvider>
    </RecoilRoot>
  );
}
