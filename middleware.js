import { decodedToken } from "./lib/decodetoken";
import { NextResponse } from "next/server";


export async function middleware(request) {
    const token = request.cookies.get('token')?.value;
    // console.log("token", token);

    if (!token) {
        return NextResponse.redirect(new URL('/login', request.url))
    }
    const user = await decodedToken(token);

    if (!user || (user.exp && user.exp < Math.floor(Date.now() / 1000))) {
        return NextResponse.redirect(new URL('/login', request.url));
    }

    const roleBasedAccess = {
        admin: [
            /^\/private\/asset_entry.*/,
            /^\/private\/manage_assets.*/,
            /^\/private\/asset_summary.*/,
            /^\/private\/upload_assets.*/,
        ],
        moderator: [

            /^\/private\/asset_entry.*/,
            /^\/private\/asset_summary.*/,
            /^\/private\/upload_assets.*/,
        ]

    };

    if (user.role === "admin" && user.isSuperAdmin) {
        roleBasedAccess.admin.push(
            /^\/private\/add_user.*/,
            /^\/private\/manage_user.*/,
            /^\/private\/manage_user\/approve_user.*/
        );
    }
    const pathName = new URL(request.url).pathname;
    const allowedRoutes = roleBasedAccess[user.role] || [];
    const hasAccess = allowedRoutes.some((pattern) => pattern.test(pathName));

    if (!hasAccess) {
        return NextResponse.redirect(new URL('/unauthorized', request.url));
    }
    return NextResponse.next();

}
export const config = {
    matcher: ['/private/:path*']
}