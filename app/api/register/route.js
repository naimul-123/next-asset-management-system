
import { NextResponse } from "next/server";
import clientPromise from "../../../lib/mongodb";
const client = await clientPromise;
const db = client.db('deadstock');
const userDb = db.collection('users')
const tempUserDb = db.collection('tempUser')
export async function POST(req) {
    try {
        const userInfo = await req.json();
        const query = { sap: userInfo.sap }
        const isExistUser = await userDb.countDocuments(query);
        if (isExistUser) {
            return NextResponse.json({ errortype: "existing_user" }, { status: 200 });
            //  here I want to make an alert message "Already Regustrued." and after showing alert and 15 second leter, it will be redirected to "/login" page.
        }
        const isExistTemp = await tempUserDb.countDocuments(query);
        if (isExistTemp) {
            return NextResponse.json({ errortype: "pending_user" }, { status: 200 });
        }
        const result = await tempUserDb.insertOne({ ...userInfo });
        if (result.acknowledged) {
            const response = NextResponse.json({ message: "A request has been sent to admin to add you as an user" }, { status: 200 });
            return response
        }
    } catch (error) {
        return NextResponse.json(
            { error: 'Login failed', error },
            { status: 500 }
        );
    }
}