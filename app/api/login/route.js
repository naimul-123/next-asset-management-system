
import { NextResponse } from "next/server";
import clientPromise from "../../../lib/mongodb";
import jwt from "jsonwebtoken";


const secretKey = process.env.SECRET_KEY;

const client = await clientPromise;
const db = client.db('deadstock');
const userDb = db.collection('users')
export async function POST(req) {

    try {
        const { sap, password } = await req.json();

        const query = { sap: sap, password: password }
        const user = await userDb.findOne(query);


        if (!user) {
            return NextResponse.json({ error: 'Invalid SAP ID or password' }, { status: 401 });
        }
        if (user.password === "12345") {
            return NextResponse.json({ redirected: true, url: new URL(`/resetpassword?sap=${user.sap}`, req.url) })
        }

        const payload = {
            name: user?.name,
            sap: user?.sap,
            role: user?.role,
            isSuperAdmin: user?.isSuperAdmin
        }

        // console.log(user);
        const token = jwt.sign(payload, secretKey, { expiresIn: '30m' });

        const response = NextResponse.json({ success: true, message: 'Login successcull' }, { status: 200 });

        response.cookies.set('token', token, {
            httpOnly: true,
            maxAge: 30 * 60,
            path: '/',
            secure: process.env.NODE_ENV === 'production',

        })
        return response

    } catch (error) {
        return NextResponse.json(
            { error: 'Login failed' },
            { status: 500 }
        );
    }

}





