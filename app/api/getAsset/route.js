import { NextResponse } from "next/server";
import clientPromise from "../../../lib/mongodb";

const client = await clientPromise;
const db = client.db('deadstock');
const assetsCollection = db.collection('assets')
export async function GET(request) {
    try {
        const { searchParams } = new URL(request.url)
        const assetNo = searchParams.get("assetNo")
        const query = { AssetNumber: assetNo };
        const result = await assetsCollection.findOne(query);
        return NextResponse.json(result)


    } catch (error) {
        console.error('Error to get document:', error); // Log error
        return NextResponse.json({ error: 'Failed to get document' }, { status: 500 });
    }
}