
import { NextResponse } from "next/server";
import clientPromise from "../../../lib/mongodb";
const client = await clientPromise;
const db = client.db('deadstock');
const assetLocationData = db.collection('assetLocationInfo')
export async function DELETE(req) {
    try {
        const data = await req.json();
        const query = {
            assetNumber: data?.assetNumber,
            "assetLocation.assetUser": data?.assetUser,
            "assetLocation.department": data?.department,
            [`assetLocation.${data?.loctype}`]: data?.location

        }

        const result = await assetLocationData.deleteOne(query)

        console.log(result);
        return NextResponse.json({ result }, { status: 200 })
    } catch (error) {
        return NextResponse.json(
            { error: 'Request Failed', error },
            { status: 500 }
        );
    }

}