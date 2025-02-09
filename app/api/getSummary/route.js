
import { NextResponse } from "next/server";
import clientPromise from "../../../lib/mongodb";
import { format } from "path";




const client = await clientPromise;
const db = client.db('deadstock');

export async function GET(req) {
    try {
        const assetsCollection = db.collection('assets');
        const result = await assetsCollection.aggregate([
            {
                "$project": {
                    "assetClass": 1,
                    "assetType": 1,
                    "acquisVal": {
                        "$toDouble": {
                            "$replaceAll": {
                                "input": "$acquisVal",
                                "find": ",",
                                "replacement": ""
                            }
                        }
                    },
                    "bookVal": {
                        "$toDouble": {
                            "$replaceAll": {
                                "input": "$bookVal",
                                "find": ",",
                                "replacement": ""
                            }
                        }
                    }
                }
            },
            {
                "$group": {
                    "_id": {
                        "assetType": "$assetType",
                        "assetClass": "$assetClass"
                    },
                    "totalAcquisVal": {
                        "$sum": "$acquisVal"
                    },
                    "totalBookVal": {
                        "$sum": "$bookVal"
                    },
                    "totalAssets": {
                        "$sum": 1
                    }
                }
            },


            {
                "$sort": {
                    "_id.assetType": 1
                }
            },

            {
                "$group": {
                    "_id": "$_id.assetClass",
                    "totalAcquisVal": {
                        "$sum": "$totalAcquisVal"
                    },
                    "totalBookVal": {
                        "$sum": "$totalBookVal"
                    },
                    "totalAssets": {
                        "$sum": "$totalAssets"
                    },
                    "assetTypes": {
                        "$push": {
                            "assetType": "$_id.assetType",
                            "acquisVal": "$totalAcquisVal",
                            "bookVal": "$totalBookVal",
                            "totalAssets": "$totalAssets"
                        }
                    }
                }
            },
            {
                $addFields: { "assetClass": "$_id" }
            },
            {
                "$sort": {
                    "assetClass": 1,
                }
            },
            {
                $project: {
                    _id: 0
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
