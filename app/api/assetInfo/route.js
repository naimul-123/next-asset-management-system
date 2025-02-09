
import { NextResponse } from "next/server";
import clientPromise from "../../../lib/mongodb";
import { format } from "path";




const client = await clientPromise;
const db = client.db('deadstock');
const assetInfoDb = db.collection('assetInfo');


export async function POST(req) {
    try {
        const assets = await req.json();

        const operations = assets.map(async (asset) => {
            const { assetNumber, assetLocation, ...rest } = asset;
            const locationWithTimestamp = {
                ...assetLocation,
                createdAt: new Date()
            }
            let existingAsset = null
            if (assetNumber && assetNumber.length === 12) {
                existingAsset = await assetInfoDb.findOne({ assetNumber })
            };

            if (existingAsset) {
                const locationExists = existingAsset.assetLocation.some(
                    (loc) =>
                        loc.assetUser === assetLocation.assetUser &&
                        loc.department === assetLocation.department &&
                        loc.section === assetLocation.section
                )
                if (!locationExists) {
                    await assetInfoDb.updateOne({
                        assetNumber
                    }, {
                        $push: {
                            assetLocation:
                                locationWithTimestamp

                        }
                    });
                }


            }
            else {
                await assetInfoDb.insertOne({
                    assetNumber,
                    assetLocation: [locationWithTimestamp],
                    ...rest
                });
            }



        });

        await Promise.all(operations);
        return NextResponse.json({ success: true }, { status: 200 });
    } catch (error) {
        console.error("Error processing data:", error);
        return NextResponse.json({ error: "Internal server error" }, { status: 500 });
    }



}

export async function GET(req) {
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
                    from: "assetInfo",
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
