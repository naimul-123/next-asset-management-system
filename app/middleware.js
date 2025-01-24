import { NextResponse } from "next/server";


export async function middleware(request) {
    const token = request.cookies.get('token')?.value;
    console.log("logged from middleware");

    if (!token) {
        return NextResponse.redirect(new URL('/login', request.url))
    }
    return NextResponse.next()

}
export const config = {
    matcher: ['/:path*']
}