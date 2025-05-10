// /api/assets/route.js
import { NextResponse } from "next/server";
import clientPromise from "../../../lib/mongodb";

const client = await clientPromise;
const db = client.db("deadstock");

export async function POST(req) {
    try {
        const assetsCollection = db.collection("assets");
        const assetClassCollection = db.collection("assetClass");
        const { searchParams } = new URL(req.url);


        // Step 1: Get asset class info
        const assetClassInfo = await assetClassCollection
            .find({}, { projection: { _id: 0, assetCode: 1, assetClass: 1 } })
            .toArray();

        const rawData = await req.json();

        // Loop through rawData and enhance each object
        const enhancedData = await Promise.all(rawData.map(async (item) => {
            const prefix = item.assetNumber?.slice(0, 2); // extract first two letters
            const matchedClass = assetClassInfo.find(info => info.assetCode.toString() === prefix);
            const updatedItem = {
                ...item,
                assetClass: matchedClass?.assetClass || null
            };

            // Find assetType based on assetNumber
            const foundAsset = await assetsCollection.findOne(
                { assetNumber: item.assetNumber },
                { projection: { _id: 0, assetType: 1 } }
            );

            if (foundAsset.assetType) {
                updatedItem.assetType = foundAsset.assetType;
                updatedItem.assetTypes = [];
            } else {
                if (updatedItem.assetNumber === "100000000314") {
                    console.log(updatedItem.assetClass);
                }
                const assetTypes = await assetsCollection.distinct("assetType", { assetClass: updatedItem.assetClass });

                updatedItem.assetType = null;
                updatedItem.assetTypes = assetTypes;
            }

            return updatedItem;
        }));

        return NextResponse.json(enhancedData, { status: 200 });
    } catch (error) {
        console.error("Error fetching processed data:", error);
        return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
    }
}

