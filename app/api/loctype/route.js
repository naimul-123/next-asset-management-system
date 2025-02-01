
import { NextResponse } from "next/server";
import clientPromise from "../../../lib/mongodb";
const client = await clientPromise;
const db = client.db('deadstock');
const locCollection = db.collection('loctypes')
export async function GET(req) {
    try {
        const { loctypes } = await locCollection.findOne({}, { projection: { _id: 0 } });
        const response = NextResponse.json(loctypes);
        return response

    } catch (error) {
        return NextResponse.json(
            { error: 'Failed to get departments', error },
            { status: 500 }
        );
    }

}

export async function POST(req) {
    try {

        const { locType } = await req.json();


        const result = await locCollection.updateOne(
            { _id: 'loctypes' },
            { $addToSet: { loctypes: locType } },
            { upsert: true }

        )



        if (result.modifiedCount || result.upsertedCount) {
            const response = NextResponse.json({ message: "Location type added successfully" }, { status: 200 });
            return response
        }

        return NextResponse.json({ error: "Failed to add" }, { status: 200 });

    } catch (error) {
        return NextResponse.json(
            { error: 'Login failed', error },
            { status: 500 }
        );
    }

}
