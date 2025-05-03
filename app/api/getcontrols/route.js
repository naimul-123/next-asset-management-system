
import { NextResponse } from "next/server";
import clientPromise from "../../../lib/mongodb";
const client = await clientPromise;
const db = client.db('deadstock');
const controlDb = db.collection('controls')
export async function GET(req) {
    try {
        const controls = await controlDb.find().toArray();;
        const response = NextResponse.json(controls);
        return response

    } catch (error) {
        return NextResponse.json(
            { error: 'Failed to get roles', error },
            { status: 500 }
        );
    }

}
