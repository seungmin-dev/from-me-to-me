import { NextRequest, NextResponse } from "next/server";
export { default } from "next-auth/middleware";

export async function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;
  let token;

  if (req.cookies._parsed.get("_vercel_jwt")) {
    token = req.cookies._parsed.get("_vercel_jwt")?.value;
  } else {
    token = req.cookies._parsed.get("__Secure-next-auth.session-token")?.value;
  }

  console.log("------------------------------");
  console.log("token : ", token);
  console.log("------------------------------");

  console.log("------------------------------");
  console.log("pathname : ", pathname);
  console.log("------------------------------");

  if (token && pathname.startsWith("/login")) {
    return NextResponse.redirect(new URL("/loading", req.url));
  }
  if (
    !token &&
    !pathname.startsWith("/login") &&
    !pathname.startsWith("/api/auth")
  ) {
    console.log("------------------------------");
    console.log("token : ", token, " pathname : ", pathname);
    console.log("------------------------------");

    return NextResponse.redirect(new URL("/login", req.url));
  }
}

export const config = {
  matcher: ["/", "/login", "/api/:auth*"],
};
