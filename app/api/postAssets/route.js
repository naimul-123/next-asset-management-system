
import { NextResponse } from "next/server";
import clientPromise from "../../../lib/mongodb";
import { format } from "path";




const client = await clientPromise;
const db = client.db('deadstock');
const assetInfoDb = db.collection('assetInfo');


export async function POST(req) {
    try {
        const { assetNumber, assetUser, department, loctype, location, ...rest } = await req.json();


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
                const locationExists = existingAsset.assetLocation.some(
                    (loc) =>
                        loc.assetUser === assetUser &&
                        loc.department === department &&
                        loc[loctype] === location
                )
                if (!locationExists) {
                    result = await assetInfoDb.updateOne({
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
                result = await assetInfoDb.insertOne({
                    assetNumber,
                    assetLocation: [locationWithTimestamp],
                    ...rest

                });
            }


        };

        console.log(result);

        if (result?.acknowledged) {
            return NextResponse.json({ success: true, message: "Asset info has been saved successfully." }, { status: 200 });
        }
        return NextResponse.json({ success: false, message: "Failed to save asset info." }, { status: 403 });

    } catch (error) {
        console.error("Error processing data:", error);
        return NextResponse.json({ error: "Internal server error" }, { status: 500 });
    }

}