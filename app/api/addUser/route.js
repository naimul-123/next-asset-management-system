import { NextResponse } from "next/server";
import clientPromise from "../../../lib/mongodb";
const client = await clientPromise;
const db = client.db("deadstock");
const userDb = db.collection("users");
export async function POST(req) {
  try {
    const userInfo = await req.json();
    const query = { sap: userInfo.sap };
    const isExistUser = await userDb.countDocuments(query);
    if (isExistUser) {
      const response = NextResponse.json(
        { error: "User already exist in database." },
        { status: 200 }
      );
      return response;
    } else {
      const saltRounds = 10;
      const hashedPassword = await bcrypt.hash('12345', saltRounds);
      const result = await userDb.insertOne({ ...userInfo, password: hashedPassword });
      if (result.acknowledged) {
        const response = NextResponse.json(
          { message: "User added successfully" },
          { status: 200 }
        );
        return response;
      }
    }
  } catch (error) {
    return NextResponse.json({ error: "Login failed", error }, { status: 500 });
  }
}
