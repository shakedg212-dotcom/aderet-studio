import { NextResponse } from "next/server";

export function middleware() {
  // Absolute safe mode: no request mutation, pass-through only.
  return NextResponse.next();
}

export const config = {
  matcher: [
    "/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)",
  ],
};
