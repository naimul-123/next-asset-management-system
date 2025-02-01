
import { NextResponse } from "next/server";
import clientPromise from "../../../lib/mongodb";

export async function POST(req) {
    try {
        const client = await clientPromise;
        const db = client.db('deadstock');
        const deptcollection = db.collection('departments')
        const { deptName, locName, locType } = await req.json();
        const department = await deptcollection.findOne({ name: deptName });
        if (!department) {
            return NextResponse.json({ error: "Department not found" }, { status: 404 })
        }
        let result;

        if (!department[locType]) {
            result = await deptcollection.updateOne(
                { name: deptName },
                { $set: { [locType]: [locName] } }
            )
        }
        else {
            result = await deptcollection.updateOne(
                { name: deptName },
                { $addToSet: { [locType]: locName }, },
            )

        }
        if (result.modifiedCount) {
            const response = NextResponse.json({ message: "Location added successfully" }, { status: 200 });
            return response
        }

        return NextResponse.json({ error: "Failed to add" }, { status: 200 });

    } catch (error) {
        return NextResponse.json(
            { error: 'Login failed', error },
            { status: 500 }
        );
    }

}





