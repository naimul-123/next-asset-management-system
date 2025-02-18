
import { NextResponse } from "next/server";
import clientPromise from "../../../lib/mongodb";
const client = await clientPromise;
const db = client.db('deadstock');
const assetInfoDb = db.collection('assetLocationInfo');


export async function POST(req) {
    try {
        const { assetNumber, assetUser, department, loctype, location } = await req.json();


        const locationWithTimestamp = {
            department,
            [loctype]: location,
            assetUser,
            createdAt: new Date()
        }
        let result = null;
        if (assetNumber && assetNumber.length === 12) {
            const existingAsset = await assetInfoDb.findOne({ assetNumber })

            if (existingAsset) {
                result = await assetInfoDb.updateOne({ assetNumber },
                    {
                        $set: {
                            assetLocation: locationWithTimestamp
                        }
                    }
                )


            }
            else {
                result = await assetInfoDb.insertOne({
                    assetNumber,
                    assetLocation: locationWithTimestamp

                });
            }


        };


        if (result?.acknowledged) {
            return NextResponse.json({ success: true, message: "Asset info has been saved successfully." }, { status: 200 });
        }
        return NextResponse.json({ success: false, message: "Failed to save asset info." }, { status: 403 });

    } catch (error) {
        console.error("Error processing data:", error);
        return NextResponse.json({ error: "Internal server error" }, { status: 500 });
    }

}