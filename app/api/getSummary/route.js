
import { NextResponse } from "next/server";
import clientPromise from "../../../lib/mongodb";





const client = await clientPromise;
const db = client.db('deadstock');

export async function GET(req) {
    try {
        const assetClassdb = db.collection("assetClass");
        const assetsCollection = db.collection('assets');
        const controlsdb = db.collection("controls");
        const { searchParams } = new URL(req.url);
        const role = searchParams.get("role");
        let assetClasses;
        if (!role) {
            return NextResponse.json(
                { error: "User role is not defiend!", error },
                { status: 409 }
            );
        }
        if (role === "admin") {
            assetClasses = await assetClassdb.distinct("assetClass");
        } else {
            const result = await controlsdb.findOne(
                { rolename: role },
                { projection: { permissions: 1, _id: 0 } }
            );
            assetClasses = result?.permissions || [];
        }

        const result = await assetsCollection.aggregate([
            //  here I want to add match stage  I want to get data which assetClass belongs in assetClasses
            {
                $match: {
                    assetClass: { $in: assetClasses }
                }
            },
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
