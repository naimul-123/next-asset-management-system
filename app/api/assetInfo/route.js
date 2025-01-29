
import { NextResponse } from "next/server";
import clientPromise from "../../../lib/mongodb";




const client = await clientPromise;
const db = client.db('deadstock');
const assetInfoDb = db.collection('assetInfo')

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
        const sectionInfo = await req.json();

        // const query = { sap: parseInt(sapid) };
        // const result = await employeesData.findOne(query);

        return NextResponse.json(sectionInfo)

    } catch (error) {
        console.error('Error to get document:', error); // Log error
        return NextResponse.json({ error: 'Failed to get document' }, { status: 500 });
    }
}
