
import { NextResponse } from "next/server";
import clientPromise from "@/lib/mongodb";

import jwt from "jsonwebtoken";

const secretKey = process.env.SECRET_KEY;



const client = await clientPromise;
const db = client.db('deadstock');
const employeesData = db.collection('employees')

export async function POST(req) {
    const { sap } = await req.json();
    const user = await employeesData.findOne({ sap: parseInt(sap) });
    if (!user) {
        return NextResponse.json({ error: "Invalid Credentials" }, { status: 401 });
    }
    const token = jwt.sign({ sap, role: user.role }, secretKey, { expiresIn: "1h", });
    return NextResponse.json({ token }, {
        headers: {
            "set-Cookie": `token=${token}; httpOnly; path=/;`,
        }
    })
}

export async function GET(request) {
    try {
        const { searchParams } = new URL(request.url)
        const sapid = searchParams.get("sap")
        console.log(sapid);
        const query = { sap: parseInt(sapid) };
        const result = await employeesData.findOne(query);

        return NextResponse.json(result)

    } catch (error) {
        console.error('Error to get document:', error); // Log error
        return NextResponse.json({ error: 'Failed to get document' }, { status: 500 });
    }
}
