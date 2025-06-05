import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { getToken } from "next-auth/jwt";

const publicPaths = ["/login", "/register"];
const PUBLIC_FILE = /\.(.*)$/;

export async function middleware(request: NextRequest) {
  const { pathname, search } = request.nextUrl;

  if (pathname.startsWith("/api") || PUBLIC_FILE.test(pathname)) {
    return NextResponse.next();
  }

  const token = await getToken({
    req: request,
    secret: process.env.NEXTAUTH_SECRET,
  });
  const isBotSharePage = pathname.startsWith("/bot/share/");
  if (!token && isBotSharePage) {
    return NextResponse.next();
  }
  if (!token && !publicPaths.includes(pathname)) {
    return NextResponse.redirect(new URL(`/login${search}`, request.url));
  }

  if (token && publicPaths.includes(pathname)) {
    return NextResponse.redirect(new URL("/", request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/((?!_next/static|_next/image|favicon.ico).*)"],
};
