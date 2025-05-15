import { NextResponse } from "next/server";
import clientPromise from "../../../lib/mongodb";

const client = await clientPromise;
const db = client.db("deadstock");
const assetsCollections = db.collection("assets");
const backupCollection = db.collection("backupAssets");

export async function POST(req) {
  try {
    const { data, role } = await req.json();
    console.log(role);
    if (role === "admin" && Array.isArray(data) && data.length > 0) {
      const existingAssets = await assetsCollections.find({}).toArray();
      if (existingAssets.length > 0) {
        await backupCollection.insertMany(existingAssets);
        await assetsCollections.deleteMany({});
        await assetsCollections.insertMany(data);
      }
      return NextResponse.json(
        {
          success: true,
          message: "Assets info has been updated successfully.",
        },
        { status: 200 }
      );
    } else {
      return NextResponse.json(
        {
          success: false,
          message: "Something wrong.",
        },
        { status: 409 }
      );
    }
  } catch (error) {
    console.error("Error to update assets:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
