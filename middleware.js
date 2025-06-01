import { getToken } from "next-auth/jwt";
import { NextResponse } from "next/server";

export async function middleware(request) {
  const token = await getToken({ req: request, secret: process.env.SECRET_KEY });

  // If no token, redirect to login
  if (!token) {
    return NextResponse.redirect(new URL("/login", request.url));
  }

  // Check if token has expired
  const now = Math.floor(Date.now() / 1000); // Current time in seconds
  if (token.exp && token.exp < now) {
    // Token is expired
    return NextResponse.redirect(new URL("/login", request.url));
  }

  // Check user's role and permissions
  const { role, isSuperAdmin } = token;

  const allowedRoutes = [
    /^\/private\/asset_entry.*/i,
    /^\/private\/asset_summary.*/i,
    /^\/private\/manage_assets.*/i,
  ];

  if (role === "admin" && isSuperAdmin) {
    allowedRoutes.push(
      /^\/private\/manage_user.*/i,
      /^\/private\/update_assets.*/i,
      /^\/private\/manage_location.*/i
    );
  } else {
    allowedRoutes.push(/^\/private\/upload_new_assets.*/i);
  }

  const pathName = new URL(request.url).pathname;
  const hasAccess = allowedRoutes.some((pattern) => pattern.test(pathName));

  if (!hasAccess) {
    return NextResponse.redirect(new URL("/unauthorized", request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/private/:path*"],
};
