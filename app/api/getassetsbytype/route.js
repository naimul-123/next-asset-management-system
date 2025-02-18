
import { NextResponse } from "next/server";
import clientPromise from "../../../lib/mongodb";



export async function GET(request) {
    try {
        const client = await clientPromise;
        const db = client.db('deadstock');
        const assetInfoDb = db.collection('assetLocationInfo');
        const { searchParams } = new URL(request.url);
        const department = searchParams.get("department");
        const loctype = searchParams.get("loctype");
        const location = searchParams.get("location");

        if (!department && loctype && location) {
            return NextResponse.json({ error: "Missing department , location type or location." }, { status: 400 });
        }


        const query = {
            "assetLocation.department": department,
            [`assetLocation.${loctype}`]: location
        }

        // const result = await assetInfoDb.find(query).toArray();
        const result = await assetInfoDb.aggregate([
            {
                $match: {
                    "assetLocation.department": department,
                    [`assetLocation.${loctype}`]: location
                }
            },
            {
                $lookup: {
                    from: "assets",
                    localField: "assetNumber",
                    foreignField: "assetNumber",
                    as: "assetInfo"
                }
            },
            {
                $unwind: {
                    path: "$assetInfo",
                    preserveNullAndEmptyArrays: true
                }
            },
            {
                $project: {
                    _id: 1,
                    assetNumber: 1,
                    assetUser: "$assetLocation.assetUser",
                    assetClass: "$assetInfo.assetClass",
                    assetType: "$assetInfo.assetType",
                    assetDescription: "$assetInfo.assetDescription"
                }
            }
        ]).toArray();


        return NextResponse.json(result)

    } catch (error) {
        console.error('Error to get document:', error); // Log error
        return NextResponse.json({ error: 'Failed to get document' }, { status: 500 });
    }
}
