import { NextResponse } from "next/server";
import clientPromise from "../../../lib/mongodb";

export async function GET(request) {
  try {
    const client = await clientPromise;
    const db = client.db("deadstock");
    const assetInfoDb = db.collection("assetLocationInfo");

    const { searchParams } = new URL(request.url);
    const department = searchParams.get("department");
    const locationType = searchParams.get("locationType");
    const location = searchParams.get("location");
    const sortBy = searchParams.get("sortBy");

    if (!department || !locationType || !location) {
      return NextResponse.json(
        { error: "Missing department, locationType, or location." },
        { status: 400 }
      );
    }

    const sortFieldMapping = {
      assetNumber: "assetNumber",
      assetUser: "assetLocation.assetUser",
      assetClass: "assetInfo.assetClass",
      assetType: "assetInfo.assetType",
      assetDescription: "assetInfo.assetDescription",
    };

    const realSortField = sortFieldMapping[sortBy];

    if (!realSortField) {
      return NextResponse.json(
        { error: "Invalid sort field." },
        { status: 400 }
      );
    }

    const result = await assetInfoDb
      .aggregate([
        {
          $match: {
            "assetLocation.department": department,
            "assetLocation.locationType": locationType,
            "assetLocation.location": location,
          },
        },
        {
          $lookup: {
            from: "assets",
            localField: "assetNumber",
            foreignField: "assetNumber",
            as: "assetInfo",
          },
        },
        {
          $unwind: {
            path: "$assetInfo",
            preserveNullAndEmptyArrays: true,
          },
        },
        {
          $project: {
            _id: 0,
            assetNumber: 1,
            assetUser: "$assetLocation.assetUser",
            assetClass: "$assetInfo.assetClass",
            assetType: "$assetInfo.assetType",
            assetDescription: "$assetInfo.assetDescription",
            sortField: { $toLower: `$${realSortField}` }, // dynamically create a sort field
          },
        },
        {
          $sort: { sortField: 1 }, // sort case-insensitively
        },
        {
          $project: {
            assetNumber: 1,
            assetUser: 1,
            assetClass: 1,
            assetType: 1,
            assetDescription: 1,
          },
        },
        {
          $facet: {
            assetDetails: [{ $match: {} }],
            assetSummary: [
              {
                $group: {
                  _id: "$assetType",
                  totalAssets: { $sum: 1 },
                },
              },
              {
                $addFields: {
                  assetType: "$_id",
                },
              },
              {
                $project: {
                  _id: 0,
                },
              },
              {
                $sort: { assetType: 1 },
              },
            ],
          },
        },
      ])
      .toArray();

    return NextResponse.json(result[0]);
  } catch (error) {
    console.error("Error to get document:", error);
    return NextResponse.json(
      { error: "Failed to get document" },
      { status: 500 }
    );
  }
}
