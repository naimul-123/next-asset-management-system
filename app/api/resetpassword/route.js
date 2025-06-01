import { NextResponse } from "next/server";
import clientPromise from "../../../lib/mongodb";
import bcrypt from "bcrypt";
export async function PUT(req) {
  try {
    const { sap } = await req.json();

    if (!sap) {
      return NextResponse.json({ error: "SAP is required" }, { status: 400 });
    }

    const client = await clientPromise;
    const db = client.db("deadstock");
    const userDb = db.collection("users");

    // Check if user exists
    const user = await userDb.findOne({ sap });

    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }
    const isresetedPas = await bcrypt.compare('12345', user.password);
    // If password is already default
    if (isresetedPas) {
      return NextResponse.json(
        {
          message: "Password is already set to the default value",
          success: false,
        },
        { status: 200 }
      );
    }
    const saltRounds = 10;
    const hashedPassword = await bcrypt.hash("12345", saltRounds);
    // Update password to default
    const result = await userDb.updateOne(
      { sap },
      { $set: { password: hashedPassword } }
    );

    if (result.modifiedCount > 0) {
      return NextResponse.json(
        {
          message: "Password has been reset to the default",
          success: true,
        },
        { status: 200 }
      );
    } else {
      return NextResponse.json(
        {
          error: "Password reset failed. No changes were made.",
        },
        { status: 400 }
      );
    }
  } catch (error) {
    console.error("Error resetting password:", error);
    return NextResponse.json(
      {
        error: "Internal server error",
        details: error.message,
      },
      { status: 500 }
    );
  }
}
