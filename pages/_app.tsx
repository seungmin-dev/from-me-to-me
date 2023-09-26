import { SessionProvider, useSession } from "next-auth/react";
import { Global } from "@emotion/react";
import { Layout } from "../src/components/layout";
import type { AppProps } from "next/app";
import { GlobalStyles } from "../styles/globalStyles";

export default function App({
  Component,
  pageProps: { session, ...pageProps },
}: AppProps) {
  return (
    <SessionProvider session={session}>
      <>
        <Global styles={GlobalStyles} />
        <Layout>
          <Component {...pageProps} />
        </Layout>
      </>
    </SessionProvider>
  );
}
