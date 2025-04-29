
import { NextResponse } from "next/server";
import clientPromise from "../../../lib/mongodb";
const client = await clientPromise;
const db = client.db('deadstock');
const user_accessDb = db.collection('users_access')
export async function POST(req) {
    try {
        const { rolename } = await req.json();
        console.log(rolename);
        if (!rolename || (rolename.trim() === "")) {
            const response = NextResponse.json({ error: "No role exist." }, { status: 409 });
            return response
        }
        else {
            const query = { rolename: rolename }
            const isExistrole = await user_accessDb.countDocuments(query);
            if (isExistrole) {
                const response = NextResponse.json({ error: "This role already exist in database." }, { status: 409 });
                return response
            }

            else {
                const result = await user_accessDb.insertOne({ rolename });
                if (result.acknowledged) {
                    const response = NextResponse.json({ message: "Role added successfully" }, { status: 200 });
                    return response
                }
            }
        }
        return NextResponse.json(
            { error: 'Failed to add role', error },
            { status: 500 }
        );
    } catch (error) {
        return NextResponse.json(
            { error: error.message },
            { status: 500 }
        );
    }

}





