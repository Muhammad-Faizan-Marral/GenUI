// /app/lib/supabase/middleware.js
import { NextResponse } from "next/server";

export async function middleware(req) {
  const token = req.cookies.get("sb-access-token")?.value;

  // Agar token nahi hai, redirect to login
  if (!token) {
    return NextResponse.redirect(new URL("/login", req.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/profile/:path*"], // Ye routes protected ho jayenge
};