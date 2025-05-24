import { NextResponse } from "next/server";
import clientPromise from "../../../lib/mongodb";

const client = await clientPromise;
const db = client.db("deadstock");

export async function POST(req) {
    const data = await req.json();
    const session = db.client.startSession();
    try {
        await session.withTransaction(async () => {
            const assetOps = data.map((d) =>
                db.collection("assets").updateOne(
                    { assetNumber: d.assetNumber },
                    {
                        $set: {
                            assetType: d.assetType,
                            assetClass: d.assetClass,
                            assetDescription: d.assetDescription,
                            capDate: d.capDate,
                            accumDep: d.accumDep,
                            acquisVal: d.acquisVal,
                            bookVal: d.bookVal,
                        },
                    },
                    { upsert: true, session }
                )
            );

            const locationOps = data.map((d) =>
                db.collection("assetLocationInfo").updateOne(
                    { assetNumber: d.assetNumber },
                    {
                        $set: {
                            assetLocation: d.assetLocation,
                        },
                    },
                    { upsert: true, session }
                )
            );

            await Promise.all([...assetOps, ...locationOps]);
        });

        return new Response(JSON.stringify({ message: "Data saved successfully!" }), { status: 200 });
    } catch (error) {
        console.error("Save error:", error);
        return new Response(JSON.stringify({ message: "Failed to save data." }), { status: 500 });
    } finally {
        await session.endSession();
    }
}
