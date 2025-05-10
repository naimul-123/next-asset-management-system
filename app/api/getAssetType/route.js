// /api/assets/route.js
import { NextResponse } from "next/server";
import clientPromise from "../../../lib/mongodb";

const client = await clientPromise;
const db = client.db("deadstock");

export async function GET(req) {
    try {
        const assetsCollection = db.collection("assets");
        const { searchParams } = new URL(req.url);
        const assetNumber = searchParams.get("assetNumber");
        const assetClass = searchParams.get("assetClass");

        if (assetNumber) {
            const assetDoc = await assetsCollection.findOne({ assetNumber });
            if (assetDoc) {
                return NextResponse.json({ assetType: assetDoc.assetType, found: true });
            } else {
                return NextResponse.json({ assetType: null, found: false });
            }
        }

        if (assetClass) {
            const assetTypes = await assetsCollection.distinct("assetType", { assetClass });
            return NextResponse.json({ assetTypes, found: false });
        }

        return NextResponse.json({ error: "Missing parameters" }, { status: 400 });
    } catch (error) {
        console.error("Error fetching asset info:", error);
        return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
    }
}
