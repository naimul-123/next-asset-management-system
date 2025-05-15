// /api/assets/route.js
import { NextResponse } from "next/server";
import clientPromise from "../../../lib/mongodb";

const client = await clientPromise;
const db = client.db("deadstock");

export async function POST(req) {
    try {
        const assetsCollection = db.collection("assets");
        const assetClassCollection = db.collection("assetClass");

        const { assetNumbers } = await req.json(); // Receive only assetNumbers array

        // Step 1: Get asset class info (prefix -> class)
        const assetClassInfo = await assetClassCollection
            .find({}, { projection: { _id: 0, assetCode: 1, assetClass: 1 } })
            .toArray();

        const codeToClassMap = new Map(
            assetClassInfo.map(({ assetCode, assetClass }) => [assetCode.toString(), assetClass])
        );

        // Step 2: Get assetType per assetClass (sorted)
        const assetTypesInfo = await assetsCollection.aggregate([
            {
                $group: {
                    _id: "$assetClass",
                    assetTypes: { $addToSet: "$assetType" }
                }
            },
            {
                $project: {
                    _id: 0,
                    assetClass: "$_id",
                    assetTypes: { $sortArray: { input: "$assetTypes", sortBy: 1 } }
                }
            }
        ]).toArray();




        // Step 3: Get all assetType info in one query
        const foundAssets = await assetsCollection.find(
            { assetNumber: { $in: assetNumbers } },
            { projection: { _id: 0, assetNumber: 1, assetType: 1 } }
        ).toArray();

        const assetTypeMap = new Map(
            foundAssets.map(({ assetNumber, assetType }) => [assetNumber, assetType])
        );

        // Step 4: Reconstruct enhanced data
        const enhancedData = assetNumbers.map(assetNumber => {
            const prefix = assetNumber.slice(0, 2);
            const assetClass = codeToClassMap.get(prefix) || null;
            const assetType = assetTypeMap.get(assetNumber) || null;

            return {
                assetNumber,
                assetClass,
                assetType,
                isTypeExist: Boolean(assetType),

            };
        });

        return NextResponse.json({ enhancedData, assetTypesInfo, foundAssets }, { status: 200 });

    } catch (error) {
        console.error("Error processing asset data:", error);
        return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
    }
}
