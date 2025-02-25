import { NextResponse } from "next/server";
import clientPromise from "../../../lib/mongodb";

const client = await clientPromise;


export async function POST(req) {
    try {
        const { assetNumbers, assetUser } = await req.json();

        if (!assetUser || !Array.isArray(assetNumbers) || assetNumbers.length === 0) {
            return NextResponse.json({ message: "Invalid request data" }, { status: 400 });
        }
        const db = client.db('deadstock');
        const assetInfoDb = db.collection('assetLocationInfo');
        const result = await assetInfoDb.updateMany(
            { assetNumber: { $in: assetNumbers } },
            { $set: { "assetLocation.assetUser": assetUser } }
        )
        if (result.modifiedCount) {
            return NextResponse.json(
                { message: "Updated successfully", success: true },
                { status: 200 }
            )
        }
        else {
            return NextResponse.json(
                { message: "No Change.", success: true },
                { status: 200 }
            )
        }






    } catch (error) {
        console.error("Error processing data:", error);
        return NextResponse.json({ error: "Internal server error" }, { status: 500 });
    }
}
