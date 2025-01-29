
import { NextResponse } from "next/server";
import clientPromise from "../../../lib/mongodb";



export async function GET(request) {
    try {
        const client = await clientPromise;
        const db = client.db('deadstock');
        const assetInfoDb = db.collection('assetInfo');
        const { searchParams } = new URL(request.url);
        const department = searchParams.get("department");
        const section = searchParams.get("section");
        const cell = searchParams.get("cell");
        const chember = searchParams.get("chember");
        if (!department && (!section || !cell || !chember)) {
            return NextResponse.json({ error: "Missing department or location (section, cell or chember)" }, { status: 400 });
        }

        let locationFilter = { "currentLocation.department": department }
        section ? locationFilter["currentLocation.section"] = section :
            cell ? locationFilter["currentLocation.cell"] = cell :
                chember ? locationFilter["currentLocation.chember"] = chember : ''


        const pipeline = [
            {
                $addFields: {
                    currentLocation: { $arrayElemAt: ["$assetLocation", -1] }
                }
            },
            {
                $match: locationFilter
            }
        ]

        const result = await assetInfoDb.aggregate(pipeline).toArray();

        return NextResponse.json(result)

    } catch (error) {
        console.error('Error to get document:', error); // Log error
        return NextResponse.json({ error: 'Failed to get document' }, { status: 500 });
    }
}
