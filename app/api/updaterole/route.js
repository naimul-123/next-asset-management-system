import { NextResponse } from "next/server";
import clientPromise from "../../../lib/mongodb";
import jwt from "jsonwebtoken";
const secretKey = process.env.SECRET_KEY;
const client = await clientPromise;
const db = client.db("deadstock");
const userDb = db.collection("users");
export async function PUT(req) {
  try {
    const { sap, role } = await req.json();
    const filter = { sap };
    const updateUser = {
      $set: {
        role,
      },
    };
    const result = await userDb.updateOne(filter, updateUser);
    if (result.modifiedCount > 0) {
      const response = NextResponse.json(
        { message: "update successcull" },
        { status: 200 }
      );

      return response;
    }
  } catch (error) {
    return NextResponse.json({ error: "Login failed", error }, { status: 500 });
  }
}
