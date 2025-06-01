import { NextResponse } from "next/server";
import bcrypt from "bcrypt";
import clientPromise from "@/lib/mongodb";

export async function GET(req) {
  try {
    const client = await clientPromise;
    const db = client.db("deadstock");
    const userDb = db.collection("users");

    const users = await userDb
      .find({ $or: [{ isSuperAdmin: null }, { isSuperAdmin: false }] })
      .toArray();

    // Wait for all async operations in map to finish
    const extendeduserData = await Promise.all(
      users.map(async (user) => {
        const isDefaultPassword = await bcrypt.compare("12345", user.password);
        return {
          name: user.name,
          sap: user.sap,
          role: user.role,
          isDefaultPassword,
        };
      })
    );

    return NextResponse.json(extendeduserData, { status: 200 });
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to get users", details: error.message },
      { status: 500 }
    );
  }
}
