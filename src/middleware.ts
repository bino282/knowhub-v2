import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { getToken } from "next-auth/jwt";
import { i18n } from "./i18n";
import { match as matchLocale } from "@formatjs/intl-localematcher";
import Negotiator from "negotiator";

const publicPaths = ["/login", "/register"];
const PUBLIC_FILE = /\.(.*)$/;

function getLocale(request: NextRequest): string {
  const negotiatorHeaders: Record<string, string> = {};
  request.headers.forEach((value, key) => {
    negotiatorHeaders[key] = value;
  });

  const languages = new Negotiator({ headers: negotiatorHeaders }).languages(
    i18n.locales as any
  );

  return matchLocale(i18n.locales, languages, i18n.defaultLocale);
}

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const locale = getLocale(request);

  // Bỏ qua static files hoặc API routes
  if (pathname.startsWith("/api") || PUBLIC_FILE.test(pathname)) {
    return NextResponse.next();
  }

  // Lấy token nếu có
  const token = await getToken({
    req: request,
    secret: process.env.NEXTAUTH_SECRET,
  });

  // Tách locale ra khỏi pathname để so sánh
  const pathnameWithoutLocale = i18n.locales
    .map((locale) => `/${locale}`)
    .reduce((acc, curr) => {
      return pathname.startsWith(curr)
        ? pathname.replace(curr, "") || "/"
        : acc;
    }, pathname);

  const isPublicPath = publicPaths.includes(pathnameWithoutLocale);

  const pathnameIsMissingLocale = i18n.locales.every(
    (locale) => !pathname.startsWith(`/${locale}/`) && pathname !== `/${locale}`
  );
  if ((!token && !isPublicPath) || (!token && pathnameIsMissingLocale)) {
    // Chưa đăng nhập và truy cập vào trang không public → chuyển hướng đến trang login
    const redirectUrl = new URL(
      `/${locale}/login${request.nextUrl.search}`,
      request.url
    );
    return NextResponse.redirect(redirectUrl);
  }

  // Đã đăng nhập và truy cập vào path `/` (trang gốc) → chuyển hướng tới dashboard
  if (token && pathname === "/") {
    const redirectUrl = new URL(`/${locale}/dashboard`, request.url);
    return NextResponse.redirect(redirectUrl);
  }

  // Đã đăng nhập và truy cập trang public → chuyển hướng đến dashboard
  if (token && isPublicPath && !pathnameIsMissingLocale) {
    const redirectUrl = new URL(`/${locale}/dashboard`, request.url);
    return NextResponse.redirect(redirectUrl);
  }

  // Đã đăng nhập và thiếu locale trong pathname hoặc vào trang public chưa có locale
  if (token && (isPublicPath || pathnameIsMissingLocale)) {
    const redirectUrl = new URL(
      `/${locale}${pathname}${request.nextUrl.search}`,
      request.url
    );
    return NextResponse.redirect(redirectUrl);
  }

  // Thiếu locale trong pathname (có thể chưa đăng nhập) → thêm locale
  if (pathnameIsMissingLocale && !isPublicPath) {
    const redirectUrl = new URL(
      `/${locale}${pathname}${request.nextUrl.search}`,
      request.url
    );
    return NextResponse.redirect(redirectUrl);
  }
}

export const config = {
  matcher: ["/((?!_next/static|_next/image|favicon.ico).*)"],
};
