
import { NextResponse } from "next/server";
import clientPromise from "../../../lib/mongodb";
const client = await clientPromise;
const db = client.db('deadstock');
const deptcollection = db.collection('locations')
export async function GET(req) {
    try {
        const deptdata = await deptcollection.find({}, { projection: { _id: 0 } }).toArray();



        const response = NextResponse.json(deptdata);
        return response

    } catch (error) {
        return NextResponse.json(
            { error: 'Failed to get departments', error },
            { status: 500 }
        );
    }

}
