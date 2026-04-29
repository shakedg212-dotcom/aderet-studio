import { NextResponse } from "next/server";

export async function middleware(request) {
  // Temporary safe mode for production stability:
  // keep middleware as pass-through until auth/session middleware is reintroduced.
  return NextResponse.next({ request });
}

export const config = {
  matcher: [
    "/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)",
  ],
};
