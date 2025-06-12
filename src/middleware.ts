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

  // Truy cập chia sẻ bot chưa đăng nhập → chỉ thêm locale
  if (!token && pathname.startsWith("/bot/share/")) {
    const redirectUrl = new URL(
      `/${locale}${pathname}${request.nextUrl.search}`,
      request.url
    );
    return NextResponse.redirect(redirectUrl);
  }

  // Chưa đăng nhập và vào trang không public → chuyển hướng tới login
  if (!token && !isPublicPath) {
    const redirectUrl = new URL(
      `/${locale}/login${request.nextUrl.search}`,
      request.url
    );
    return NextResponse.redirect(redirectUrl);
  }

  // Đã đăng nhập mà vào trang public → chuyển hướng tới locale+pathname
  if (token && isPublicPath) {
    const redirectUrl = new URL(`/${locale}/dashboard`, request.url);
    return NextResponse.redirect(redirectUrl);
  }

  // Thiếu locale → redirect thêm locale vào
  if (pathnameIsMissingLocale) {
    console.log("he2");
    const redirectUrl = new URL(
      `/${locale}${pathname}${request.nextUrl.search}`,
      request.url
    );
    return NextResponse.redirect(redirectUrl);
  }

  // Không cần redirect
  return NextResponse.next();
}

export const config = {
  matcher: ["/((?!_next/static|_next/image|favicon.ico).*)"],
};
