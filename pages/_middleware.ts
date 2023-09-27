import { getToken } from "next-auth/jwt";
import { NextRequest, NextResponse } from "next/server";

const secret = process.env.SECRET_KEY;

export async function middleware(req: NextRequest) {
  const session = await getToken({ req, secret, raw: true });
  const { pathname } = req.nextUrl;

  if (
    !session &&
    !pathname.startsWith("/login") &&
    !pathname.startsWith("/api/auth")
  ) {
    return NextResponse.redirect(new URL("/login", req.url));
  }
  if (session && pathname.startsWith("/login")) {
    return NextResponse.redirect(new URL("/loading", req.url));
  }
}

export const config = {
  matcher: ["/login", "/loading", "/"],
};
