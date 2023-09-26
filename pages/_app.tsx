import { Global } from "@emotion/react";
import { Layout } from "../src/components/layout";
import type { AppProps } from "next/app";
import { GlobalStyles } from "../styles/globalStyles";

export default function App({ Component, pageProps }: AppProps) {
  return (
    <>
      <Global styles={GlobalStyles} />
      <Layout>
        <Component {...pageProps} />
      </Layout>
    </>
  );
}
