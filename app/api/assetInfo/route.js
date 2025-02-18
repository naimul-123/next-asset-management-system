
import { NextResponse } from "next/server";
import clientPromise from "../../../lib/mongodb";
export async function GET(req) {
    const client = await clientPromise;
    const db = client.db('deadstock');
    try {
        const assetsCollection = db.collection('assets');
        const { searchParams } = new URL(req.url)
        const assetType = searchParams.get("assetType")

        const result = await assetsCollection.aggregate([
            {
                $match: {
                    assetType: assetType
                }
            },
            {
                $lookup: {
                    from: "assetLocationInfo",
                    localField: "assetNumber",
                    foreignField: "assetNumber",
                    as: "assetInfoData"
                }
            },
            {
                $match: {
                    assetInfoData: { $size: 0 },
                }
            },
            // Convert 2-digit year to 4-digit format and then parse to Date
            {
                $addFields: {
                    capDateConverted: {
                        $dateFromString: {
                            dateString: {
                                $concat: [
                                    { $arrayElemAt: [{ $split: ["$capDate", "/"] }, 0] }, // MM
                                    "/",
                                    { $arrayElemAt: [{ $split: ["$capDate", "/"] }, 1] }, // DD
                                    "/",
                                    {
                                        $cond: {
                                            if: { $gte: [{ $toInt: { $arrayElemAt: [{ $split: ["$capDate", "/"] }, 2] } }, 50] },
                                            then: { $concat: ["19", { $arrayElemAt: [{ $split: ["$capDate", "/"] }, 2] }] },
                                            else: { $concat: ["20", { $arrayElemAt: [{ $split: ["$capDate", "/"] }, 2] }] }
                                        }
                                    }
                                ]
                            },
                            format: "%m/%d/%Y",
                            timezone: "Asia/Dhaka"
                        }
                    },


                }
            },
            {
                $sort: { capDateConverted: -1 } // Sort in descending order (earlier date first)
            },
            {
                $addFields: {
                    formatedCapDate: {
                        $dateToString: {
                            format: '%d-%m-%Y',
                            date: "$capDateConverted",
                            timezone: "Asia/Dhaka"
                        }
                    }
                }
            },
            {
                $project: {

                    assetNumber: 1,  // Include renamed field
                    capDate: "$formatedCapDate", // Rename capDateConverted -> capDate
                    accumDep: 1,
                    acquisVal: 1,
                    assetDescription: 1,
                    assetClass: 1,
                    assetType: 1,
                    bookVal: 1,

                    // Remove temporary converted field from output
                }
            }
        ]
        ).toArray();



        return NextResponse.json(result)

    } catch (error) {
        console.error('Error to get document:', error); // Log error
        return NextResponse.json({ error: 'Failed to get document' }, { status: 500 });
    }
}
