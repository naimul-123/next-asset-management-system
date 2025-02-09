
import { NextResponse } from "next/server";
import clientPromise from "../../../lib/mongodb";



export async function GET(request) {
    try {
        const client = await clientPromise;
        const db = client.db('deadstock');
        const assetInfoDb = db.collection('assetInfo');
        const { searchParams } = new URL(request.url);
        const department = searchParams.get("department");
        const loctype = searchParams.get("loctype");
        const location = searchParams.get("location");

        if (!department && loctype && location) {
            return NextResponse.json({ error: "Missing department , location type or location." }, { status: 400 });
        }


        const pipeline = [
            {
                $addFields: {
                    lastLocation: { $arrayElemAt: ["$assetLocation", -1] }
                }
            },
            {
                $match: {
                    "lastLocation.department": department,
                    [`lastLocation.${loctype}`]: location
                }
            },
            {
                $project: {
                    _id: 0,
                    assetNumber: 1,
                    assetType: 1,
                    assetDescription: 1,
                    assetUser: "$lastLocation.assetUser"
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
