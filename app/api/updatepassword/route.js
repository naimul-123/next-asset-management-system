import { NextResponse } from "next/server";
import clientPromise from "../../../lib/mongodb";

export async function PUT(req) {
  try {
    const { sap, password } = await req.json();
    if (!sap || !password) {
      return NextResponse.json(
        { error: "SAP and password are required" },
        { status: 400 }
      );
    }

    const client = await clientPromise;
    const db = client.db("deadstock");
    const userDb = db.collection("users");

    const filter = { sap };
    const updateUser = { $set: { password } };

    const result = await userDb.updateOne(filter, updateUser);

    if (result.modifiedCount > 0) {
      // Redirect to login page
      return NextResponse.json(
        {
          message: "Password updated successfully",
          success: true,
          redirectTo: "/login",
        },
        { status: 200 }
      );
    } else {
      return NextResponse.json(
        { error: "Password update failed. SAP not found or no changes made." },
        { status: 400 }
      );
    }
  } catch (error) {
    console.error("Error updating password:", error);
    return NextResponse.json(
      { error: "Failed to reset password", details: error.message },
      { status: 500 }
    );
  }
}
