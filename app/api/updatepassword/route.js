import { NextResponse } from "next/server";
import clientPromise from "../../../lib/mongodb";
import bcrypt from "bcrypt"; // ✅ Import bcrypt

export async function PUT(req) {
  try {
    const client = await clientPromise;
    const db = client.db("deadstock");
    const userDb = db.collection("users");

    const { sap, password, newpassword } = await req.json();

    if (!sap || !password || !newpassword) {
      return NextResponse.json(
        { error: "SAP and password are required", success: false },
        { status: 401 }
      );
    }

    const user = await userDb.findOne({ sap });

    const isValidUser = await bcrypt.compare(password, user.password);
    if (!isValidUser) {
      return NextResponse.json(
        { error: "Invalid SAP ID or password", success: false },
        { status: 401 }
      );
    }

    // Step 3: Compare plaintext password with hashed one
    const isPasswordSame = await bcrypt.compare(newpassword, user.password);
    if (isPasswordSame) {
      return NextResponse.json(
        { error: "Same password could not saved." },
        { status: 401 }
      );
    }

    // Step 4: Check if password is default
    const isDefaultPassword = await bcrypt.compare(newpassword, "12345");
    if (isDefaultPassword) {
      return NextResponse.json(
        { error: "Default password could not be saved", success: false },
        { status: 401 }
      );
    }

    // ✅ Hash the password before saving
    const saltRounds = 10;
    const hashedPassword = await bcrypt.hash(newpassword, saltRounds);
    const updateUser = { $set: { password: hashedPassword } }; // ✅ Store hashed password
    const result = await userDb.updateOne({ sap }, updateUser);

    if (result.modifiedCount > 0) {
      return NextResponse.json(
        {
          message: "Password updated successfully",
          redirectTo: "/login",
          success: true,
        },
        { status: 200 }
      );
    } else {
      return NextResponse.json(
        {
          error: "Password update failed. SAP not found or no changes made.",
          success: false,
        },
        { status: 401 }
      );
    }
  } catch (error) {
    return NextResponse.json(
      {
        error: "Failed to reset password",
        details: error.message,
        success: false,
      },
      { status: 500 }
    );
  }
}
