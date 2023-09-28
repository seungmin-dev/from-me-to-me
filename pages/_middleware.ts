import { getToken } from "next-auth/jwt";
import { NextRequest, NextResponse } from "next/server";

const secret = process.env.SECRET_KEY;

export async function middleware(req: NextRequest) {
  const token = await getToken({ req, secret, raw: true });
  const { pathname } = req.nextUrl;

  console.log("------------------------------");
  console.log("token : ", token);
  console.log("------------------------------");

  console.log("------------------------------");
  console.log("pathname : ", pathname);
  console.log("------------------------------");

  if (
    !token &&
    !pathname.startsWith("/login") &&
    !pathname.startsWith("/api/auth")
  ) {
    console.log("------------------------------");
    console.log("곧 login으로 리다이렉트 ...");
    console.log("------------------------------");
    return NextResponse.redirect(new URL("/login", req.url));
  }
  if (token && pathname.startsWith("/login")) {
    return NextResponse.redirect(new URL("/loading", req.url));
  }
}

export const config = {
  matcher: ["/login", "/loading", "/"],
};
