
import { NextResponse } from "next/server";
import clientPromise from "../../../lib/mongodb";
const secretKey = process.env.SECRET_KEY;
const client = await clientPromise;
const db = client.db('deadstock');
const userDb = db.collection('users')
export async function DELETE(req) {
    try {
        const { searchParams } = new URL(req.url)
        const sap = searchParams.get("sap")

        const query = { sap: sap };
        const result = await userDb.deleteOne(query);
        if (result.deletedCount) {
            const response = NextResponse.json({ message: "Deleted Successfully!" })
            return response
        }



    } catch (error) {
        return NextResponse.json(
            { error: 'Login failed', error },
            { status: 500 }
        );
    }

}





