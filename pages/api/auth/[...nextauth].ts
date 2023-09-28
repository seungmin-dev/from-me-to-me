import { NextAuthOptions } from "next-auth";
import NextAuth from "next-auth/next";
import KakaoProvider from "next-auth/providers/kakao";

export const authOptions: NextAuthOptions = {
  session: {
    strategy: "jwt",
  },
  jwt: {
    secret: "secret",
  },
  providers: [
    KakaoProvider({
      clientId: process.env.KAKAO_CLIENT_ID!,
      clientSecret: process.env.KAKAO_CLIENT_SECRET!,
    }),
  ],
  callbacks: {
    async jwt({ token, account }) {
      console.log("------------------------------");
      console.log("jwt token : ", token);
      console.log("------------------------------");
      console.log("jwt account : ", account);
      console.log("------------------------------");
      if (account) {
        token.accessToken = account.access_token;
      }
      return token;
    },
    async session({ session, token }) {
      console.log("------------------------------");
      console.log("session session : ", session);
      console.log("------------------------------");
      console.log("session token : ", token);
      console.log("------------------------------");

      session.accessToken = token.accessToken as string;
      return session;
    },
  },
};

export default NextAuth(authOptions);
