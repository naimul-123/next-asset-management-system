import { NextResponse } from "next/server";
import clientPromise from "../../../lib/mongodb";

const client = await clientPromise;
const db = client.db("deadstock");
const assetInfoDb = db.collection("assetLocationInfo");

export async function POST(req) {
  try {
    const { assetNumbers, assetUser, department, locationType, location } =
      await req.json();

    const locationWithTimestamp = {
      department,
      locationType,
      location,
      assetUser,
      
    };

    let result = null;

    // Find all existing assets
    const existingAssets = await assetInfoDb
      .find({ assetNumber: { $in: assetNumbers } })
      .toArray();
    const existingAssetNumbers = existingAssets.map(
      (asset) => asset.assetNumber
    );

    // Update existing assets
    if (existingAssetNumbers.length > 0) {
      await assetInfoDb.updateMany(
        { assetNumber: { $in: existingAssetNumbers } },
        { $set: { assetLocation: locationWithTimestamp } }
      );
    }

    // Find new assets to insert
    const newAssetNumbers = assetNumbers.filter(
      (num) => !existingAssetNumbers.includes(num)
    );

    if (newAssetNumbers.length > 0) {
      const newAssets = newAssetNumbers.map((num) => ({
        assetNumber: num,
        assetLocation: locationWithTimestamp,
      }));

      await assetInfoDb.insertMany(newAssets);
    }

    return NextResponse.json(
      { success: true, message: "Assets info has been saved successfully." },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error processing data:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
