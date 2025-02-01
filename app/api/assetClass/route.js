
import { NextResponse } from "next/server";
import clientPromise from "../../../lib/mongodb";
const client = await clientPromise;
const db = client.db('deadstock');
const assetClassCollection = db.collection('assetClass')
export async function GET(req) {
    try {
        const assetClasses = await assetClassCollection.find({}, { projection: { _id: 0, assetGroup: 1, assetType: 1 } }).toArray();
        const response = NextResponse.json(assetClasses);
        return response

    } catch (error) {
        return NextResponse.json(
            { error: 'Failed to get asset class', error },
            { status: 500 }
        );
    }

}


