// import { getToken } from "next-auth/jwt";
import { NextRequest, NextResponse } from "next/server";
export { default } from "next-auth/middleware";

const secret = process.env.SECRET_KEY;

// export default withAuth(
export async function middleware(req: NextRequest) {
  // const token = await getToken({ req, secret, raw: true });
  const { pathname } = req.nextUrl;
  let token;

  console.log("req : ", req);
  console.log("req.cookies : ", req.cookies);
  console.log("req.cookies._parsed : ", req.cookies._parsed);

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
    console.log("------------------------------");
    console.log("로딩 페이지로 이동...");
    console.log("------------------------------");
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

    console.log("------------------------------");
    console.log("곧 login으로 리다이렉트 ...");
    console.log("------------------------------");
    return NextResponse.redirect(new URL("/login", req.url));
  }
}
// );

export const config = {
  matcher: ["/", "/login", "/api/:auth*"],
};
