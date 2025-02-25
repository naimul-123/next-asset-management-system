
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

            },
            {
                $sort: { assetType: 1 }

            },
            {
                $facet: {
                    assetDetails: [
                        { $match: {} }
                    ],
                    assetSummary: [
                        {
                            $group: {
                                _id: "$assetType",
                                totalAssets: { $sum: 1 }
                            },

                        },
                        {
                            $addFields: {
                                assetType: "$_id",
                            },
                        },
                        {
                            $project: {
                                _id: 0,
                            }
                        },
                        {
                            $sort: { assetType: 1 }
                        }
                    ]
                }
            }
        ]).toArray();


        return NextResponse.json(result[0])

    } catch (error) {
        console.error('Error to get document:', error); // Log error
        return NextResponse.json({ error: 'Failed to get document' }, { status: 500 });
    }
}
