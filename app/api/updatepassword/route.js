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
        { error: "SAP and password are required" },
        { status: 400 }
      );
    }

    
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
    if (isDefaultPassword) {
      return NextResponse.json(
        { error: "Default password could not be saved" },
        { status: 401 }
      );
    }
    // return NextResponse.json({ isDefaultPassword }, { status: 200 });
    // ✅ Hash the password before saving
    const saltRounds = 10;
    const hashedPassword = await bcrypt.hash(password, saltRounds);


    const filter = { sap };
    const updateUser = { $set: { password: hashedPassword } }; // ✅ Store hashed password

    const result = await userDb.updateOne(filter, updateUser);

    if (result.modifiedCount > 0) {
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
