import { NextAuthOptions } from "next-auth";
import NextAuth from "next-auth/next";
import KakaoProvider from "next-auth/providers/kakao";

let expires_at: number;

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
      if (account) {
        token = {
          ...token,
          provider: account.provider,
        };
        expires_at = account.expires_at!;
      }
      // else if (Date.now() < expires_at) {
      //   return token;
      // } else if (Date.now() >= expires_at) {
      //   // accessToken 재발급
      //   try {
      //     const data = {
      //       grant_type: "refresh_token",
      //       client_id: process.env.KAKAO_CLIENT_ID,
      //       refresh_token: token.refreshToken,
      //       client_secret: process.env.KAKAO_CLIENT_SECRET,
      //     };
      //     const response = await fetch("https://kauth.kakao.com/oauth/token", {
      //       headers: {
      //         "Content-type": "application/x-www-form-urlencoded;charset=utf-8",
      //       },
      //       body: encodeURIComponent(JSON.stringify(data)),
      //       method: "POST",
      //     });
      //     const tokens = await response.json();
      //     console.log("refreshing tokens : ", tokens);
      //     if (!response.ok) throw tokens;
      //   } catch (error) {
      //     console.log(error);
      //     return { ...token, error: "RefreshAccessTokenError" as const };
      //   }
      // }
      return token;
    },
    async session({ session, token }) {
      session.accessToken = token.accessToken as string;
      return session;
    },
  },
};

export default NextAuth(authOptions);
