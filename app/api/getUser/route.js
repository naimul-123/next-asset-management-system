import { NextResponse } from "next/server";
import { jwtVerify } from "jose"
export async function GET(request) {
    const token = request.cookies.get('token')?.value;

    try {
        const secretKey = new TextEncoder().encode(process.env.SECRET_KEY);
        const { payload } = await jwtVerify(token, secretKey);
        return NextResponse.json({ payload })

    } catch (error) {
        return NextResponse.json({ error: error.message }, { status: 403 })
    }

}