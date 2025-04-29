
import { NextResponse } from "next/server";
import clientPromise from "../../../lib/mongodb";
const client = await clientPromise;
const db = client.db('deadstock');
const user_accessDb = db.collection('users_access')
export async function GET(req) {
    try {
        const roles = await user_accessDb.distinct('rolename');
        const response = NextResponse.json(roles);
        return response

    } catch (error) {
        return NextResponse.json(
            { error: 'Failed to get roles', error },
            { status: 500 }
        );
    }

}
