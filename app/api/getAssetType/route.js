
import { NextResponse } from "next/server";
import clientPromise from "../../../lib/mongodb";




const client = await clientPromise;
const db = client.db('deadstock');

export async function GET(req) {
    try {
        const assetsCollection = db.collection('assets');
        const { searchParams } = new URL(req.url)
        const assetClass = searchParams.get("assetClass")
        console.log(assetClass);
        const result = await assetsCollection.aggregate([
            {
                $match: {

                    assetClass: assetClass
                }
            },

            {
                $group: {
                    _id: null,
                    assetTypes: { $addToSet: "$assetType" }
                }
            },
            {
                $project: {
                    _id: 0,
                    assetTypes: { $sortArray: { input: "$assetTypes", sortBy: 1 } }
                }
            }

        ]
        ).toArray();



        return NextResponse.json(result.length > 0 ? result[0].assetTypes : [], { status: 200 })

    } catch (error) {
        console.error('Error to get document:', error); // Log error
        return NextResponse.json({ error: 'Failed to get document' }, { status: 500 });
    }
}