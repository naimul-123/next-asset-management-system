import { decodedToken } from "./lib/decodetoken";
import { NextResponse } from "next/server";

export async function middleware(request) {
  const token = request.cookies.get("token")?.value;

  if (!token) {
    return NextResponse.redirect(new URL("/login", request.url));
  }

  const user = await decodedToken(token);

  if (!user || (user.exp && user.exp < Math.floor(Date.now() / 1000))) {
    return NextResponse.redirect(new URL("/login", request.url));
  }

  // Base access for moderators and all other non-admin roles

  const allowedRoutes = [
    /^\/private\/asset_entry.*/,
    /^\/private\/asset_summary.*/,
    /^\/private\/manage_assets.*/,
  ];

  // admin additional access
  if (user.role === "admin" && user.isSuperAdmin) {
    allowedRoutes.push(...[/^\/private\/manage_user.*/, /^\/private\/update_assets.*/, /^\/private\/manage_location.*/]);
  }
  else {
    allowedRoutes.push(/^\/private\/upload_new_assets.*/);
  }
  // admin additional access

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
