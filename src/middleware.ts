import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

/**
 * Panel kilidi.
 *
 * /dashboard altındaki her şey geçerli bir oturum çerezi ister. Oturum yoksa
 * ziyaretçi giriş ekranına atılır — adresi bilen herkesin panele girmesi engellenir.
 *
 * Not: gerçek doğrulama backend bağlandığında yapılacak. Bu katman, panelin
 * herkese açık olmasını engelleyen ilk savunma hattıdır.
 */
export function middleware(request: NextRequest) {
    const token = request.cookies.get("token")?.value;

    if (!token) {
        const loginUrl = new URL("/login", request.url);
        loginUrl.searchParams.set("from", request.nextUrl.pathname);
        return NextResponse.redirect(loginUrl);
    }

    return NextResponse.next();
}

export const config = {
    matcher: ["/dashboard/:path*"],
};
