import { NextResponse } from "next/server";
import clientPromise from "../../../lib/mongodb";
const client = await clientPromise;
const db = client.db("deadstock");
const userDb = db.collection("users");
export async function GET(req) {
  try {
    const users = await userDb
      .find({ $or: [{ isSuperAdmin: null }, { isSuperAdmin: false }] })
      .toArray();

    const response = NextResponse.json(users, { status: 200 });
    return response;
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to get user", error },
      { status: 500 }
    );
  }
}
