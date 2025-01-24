
import { NextResponse } from "next/server";
import clientPromise from "../../../lib/mongodb";



export async function GET(request) {
    try {
        const client = await clientPromise;
        const db = client.db('deadstock');
        const assetInfoDb = db.collection('assetInfo')
        const { searchParams } = new URL(request.url)
        const department = searchParams.get("department")
        const section = searchParams.get("section")
        if (!department || !section) {
            return NextResponse.json({ error: "Missing department or section" }, { status: 400 });
        }
        const pipeline = [
            {
                $addFields: {
                    currentLocation: { $arrayElemAt: ["$assetLocation", -1] }
                }
            },
            {
                $match: {
                    "currentLocation.department": department,
                    "currentLocation.section": section,

                }
            }
        ]

        const result = await assetInfoDb.aggregate(pipeline).toArray();

        return NextResponse.json(result)

    } catch (error) {
        console.error('Error to get document:', error); // Log error
        return NextResponse.json({ error: 'Failed to get document' }, { status: 500 });
    }
}
