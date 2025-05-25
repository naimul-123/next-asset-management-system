import { NextResponse } from "next/server";
import clientPromise from "../../../lib/mongodb";
const client = await clientPromise;
const db = client.db("deadstock");
const assetLocCollection = db.collection("assetLocationInfo");
export async function GET(request) {
  try {
    const rejectedAssets = await assetLocCollection
      .aggregate([
        {
          $lookup: {
            from: "assets",
            localField: "assetNumber",
            foreignField: "assetNumber",
            as: "matchedAssets",
          },
        },
        {
          $match: {
            matchedAssets: { $eq: [] },
          },
        },
        {
          $project: {
            _id: 0,
            assetNumber: 1
          },
        },
      ])
      .toArray();

    const result = rejectedAssets?.map(asset => asset.assetNumber)
    return NextResponse.json(result);
  } catch (error) {
    console.error("Error getting document:", error);
    return NextResponse.json(
      { error: "Failed to get document" },
      { status: 500 }
    );
  }
}



export async function DELETE(req) {
  try {
    const { rejectedassets, role } = await req.json(); // Expecting: [{ assetNumber: "..." }, ...]

    if (!Array.isArray(rejectedassets) || rejectedassets.length === 0) {
      return NextResponse.json(
        { error: "Invalid or empty data." },
        { status: 400 }
      );
    }

    if (role !== "admin") {
      return NextResponse.json(
        { error: "Unauthorized access!" },
        { status: 401 }
      );
    }

    const deleted = await assetLocCollection.deleteMany({
      assetNumber: { $in: rejectedassets },
    });

    if (deleted.deletedCount > 0) {
      return NextResponse.json(
        { message: "Assets deleted successfully.", success: true },
        { status: 200 }
      );
    } else {
      return NextResponse.json(
        { error: "No matching assets found to delete." },
        { status: 404 }
      );
    }
  } catch (error) {
    console.error("Error deleting assets:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
