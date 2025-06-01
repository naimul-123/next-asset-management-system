import { NextResponse } from "next/server";
import clientPromise from "../../../lib/mongodb";
import bcrypt from "bcrypt";

const client = await clientPromise;
const db = client.db("deadstock");
const userDb = db.collection("users");

export async function POST(req) {
    try {
        const { sap, password } = await req.json();

        // Step 1: Find user by SAP only
        const user = await userDb.findOne({ sap });

        // Step 2: Check if user exists
        if (!user) {
            return NextResponse.json(
                { error: "Invalid SAP ID or password" },
                { status: 401 }
            );
        }

        // Step 3: Compare plaintext password with hashed one
        const isPasswordValid = await bcrypt.compare(password, user.password);
        if (!isPasswordValid) {
            return NextResponse.json(
                { error: "Invalid SAP ID or password" },
                { status: 401 }
            );
        }

        // Step 4: Check if password is default
        const isDefaultPassword = await bcrypt.compare("12345", user.password);

        return NextResponse.json({ isDefaultPassword }, { status: 200 });
    } catch (error) {
        console.error("Login error:", error);
        return NextResponse.json({ error: "Login failed" }, { status: 500 });
    }
}
