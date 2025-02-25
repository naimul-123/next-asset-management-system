
import { NextResponse } from "next/server";
import clientPromise from "../../../lib/mongodb";
const client = await clientPromise;
const db = client.db('deadstock');
const userDb = db.collection('users')

export async function POST(req) {
    try {
        const userInfo = await req.json();
        const query = { sap: userInfo.sap }
        const isExistUser = await userDb.findOne(query);
        if (isExistUser) {
            if (isExistUser.status === "panding") {
                return NextResponse.json({ errortype: "pending_user" }, { status: 200 });
            }
            else {
                return NextResponse.json({ errortype: "existing_user" }, { status: 200 });
            }

        }
        else {
            const result = await userDb.insertOne({ ...userInfo, status: "pending" });
            if (result.acknowledged) {
                const response = NextResponse.json({ message: "A request has been sent to admin to add you as an user." }, { status: 200 });
                return response
            }
        }

    } catch (error) {
        return NextResponse.json(
            { error: 'Login failed', error },
            { status: 500 }
        );
    }
}