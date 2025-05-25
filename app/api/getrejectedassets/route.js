import { NextResponse } from "next/server";
import clientPromise from "../../../lib/mongodb";

export async function GET(request) {
  try {
    const client = await clientPromise;
    const db = client.db("deadstock");
    const assetLocCollection = db.collection("assetLocationInfo");
    console.log("request makes from client");
    const result = await assetLocCollection
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
            matchedAssets: 0,
          },
        },
      ])
      .toArray();

    return NextResponse.json(result);
  } catch (error) {
    console.error("Error getting document:", error);
    return NextResponse.json(
      { error: "Failed to get document" },
      { status: 500 }
    );
  }
}
