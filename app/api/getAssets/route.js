import { NextResponse } from "next/server";
import clientPromise from "../../../lib/mongodb";

const client = await clientPromise;
const db = client.db("deadstock");
const assetClassdb = db.collection("assetClass");
const controlsdb = db.collection("controls");
const assetsCollection = db.collection("assets");

export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    let matchStage = {};
    const assetNumber = searchParams.get("assetNumber");
    const department = searchParams.get("department");
    const locationType = searchParams.get("locationType");
    const location = searchParams.get("location");
    const assetClass = searchParams.get("assetClass");
    const assetType = searchParams.get("assetType");
    const searchType = searchParams.get("searchType");
    const isBookVal1 = searchParams.get("isBookVal1");
    const sortBy = searchParams.get("sortBy");
    const role = searchParams.get("role");
    let assetClasses;
    if (!role) {
      return NextResponse.json(
        { error: "User role is not defiend!", error },
        { status: 409 }
      );
    }
    if (role === "admin") {
      assetClasses = await assetClassdb.distinct("assetClass");
    } else {
      const result = await controlsdb.findOne(
        { rolename: role },
        { projection: { permissions: 1, _id: 0 } }
      );
      assetClasses = result?.permissions || [];
    }

    const assetTypeUsedInRoleClasses = await assetsCollection.distinct(
      "assetType",
      {
        assetClass: { $in: assetClasses },
      }
    );

    matchStage.$or = [
      { assetClass: { $in: assetClasses } },
      {
        assetClass: "Low value Asset",
        assetType: { $in: assetTypeUsedInRoleClasses },
      },
    ];
    // here I also include "Low value Asset" assetClass assets these match with assetClasses assetType

    if (searchType === "assetNumber") {
      matchStage.assetNumber = assetNumber;
    } else if (searchType === "assetLocation") {
      matchStage["assetInfo.assetLocation.department"] = department;
      if (locationType)
        matchStage["assetInfo.assetLocation.locationType"] = locationType;
      if (location) matchStage["assetInfo.assetLocation.location"] = location;
    } else if (searchType === "assetClass") {
      const assetTypeUsedInClass = await assetsCollection.distinct(
        "assetType",
        { assetClass: assetClass }
      );
      Object.assign(matchStage, {
        $or: [
          { assetClass: assetClass },
          {
            assetClass: "Low value Asset",
            assetType: { $in: assetTypeUsedInClass },
          },
        ],
        ...(assetType && { assetType: assetType }),
      });
    }
    if (isBookVal1 === "true") {
      matchStage.bookVal = "1";
    }

    const pipeline = [
      {
        $lookup: {
          from: "assetLocationInfo",
          localField: "assetNumber",
          foreignField: "assetNumber",
          as: "assetInfo",
        },
      },
      { $unwind: { path: "$assetInfo", preserveNullAndEmptyArrays: true } },
      { $match: matchStage },

      // CapDate parsing logic remains unchanged...

      {
        $addFields: {
          capParts: {
            $cond: [
              {
                $and: [
                  { $eq: [{ $type: "$capDate" }, "string"] },
                  { $eq: [{ $size: { $split: ["$capDate", "/"] } }, 3] },
                ],
              },
              { $split: ["$capDate", "/"] },
              null,
            ],
          },
        },
      },
      {
        $addFields: {
          firstNum: {
            $cond: [
              { $ne: ["$capParts", null] },
              { $toInt: { $arrayElemAt: ["$capParts", 0] } },
              null,
            ],
          },
        },
      },
      {
        $addFields: {
          yearFixed: {
            $cond: [
              { $ne: ["$capParts", null] },
              {
                $let: {
                  vars: { yr: { $arrayElemAt: ["$capParts", 2] } },
                  in: {
                    $cond: [
                      { $eq: [{ $strLenCP: "$$yr" }, 2] },
                      { $concat: ["20", "$$yr"] },
                      "$$yr",
                    ],
                  },
                },
              },
              null,
            ],
          },
          monthStr: {
            $cond: [
              { $ne: ["$capParts", null] },
              {
                $cond: [
                  { $gt: ["$firstNum", 12] },
                  { $arrayElemAt: ["$capParts", 1] },
                  { $arrayElemAt: ["$capParts", 0] },
                ],
              },
              null,
            ],
          },
          dayStr: {
            $cond: [
              { $ne: ["$capParts", null] },
              {
                $cond: [
                  { $gt: ["$firstNum", 12] },
                  { $arrayElemAt: ["$capParts", 0] },
                  { $arrayElemAt: ["$capParts", 1] },
                ],
              },
              null,
            ],
          },
        },
      },
      {
        $addFields: {
          capDateFixed: {
            $cond: [
              {
                $and: [
                  { $ne: ["$monthStr", null] },
                  { $ne: ["$dayStr", null] },
                  { $ne: ["$yearFixed", null] },
                ],
              },
              { $concat: ["$monthStr", "/", "$dayStr", "/", "$yearFixed"] },
              null,
            ],
          },
        },
      },
      {
        $addFields: {
          parsedCapDate: {
            $dateFromString: {
              dateString: "$capDateFixed",
              format: "%m/%d/%Y",
              onError: null,
              onNull: null,
            },
          },
        },
      },

      // Sorting logic
      ...(sortBy === "acquisationVal"
        ? [
            {
              $addFields: {
                sortKey: {
                  $toDouble: {
                    $replaceAll: {
                      input: "$acquisationVal",
                      find: ",",
                      replacement: "",
                    },
                  },
                },
              },
            },
          ]
        : sortBy === "capDate"
        ? [{ $addFields: { sortKey: "$parsedCapDate" } }]
        : sortBy
        ? [
            {
              $addFields: {
                sortKey: { $toLower: `$${sortBy}` },
              },
            },
          ]
        : []),

      ...(sortBy ? [{ $sort: { sortKey: 1 } }] : []),

      // Final projection to send to client (excluding parsedCapDate)
      {
        $project: {
          _id: 0,
          assetNumber: 1,
          assetClass: 1,
          assetType: 1,
          assetDescription: 1,
          acquisationVal: "$acquisVal",

          capDate: {
            $cond: [
              { $ne: ["$parsedCapDate", null] },
              {
                $dateToString: {
                  date: "$parsedCapDate",
                  format: "%d/%m/%Y",
                },
              },
              "$capDate",
            ],
          },

          bookVal: "$bookVal",
          department: "$assetInfo.assetLocation.department",
          locationType: "$assetInfo.assetLocation.locationType",
          location: "$assetInfo.assetLocation.location",
          assetUser: "$assetInfo.assetLocation.assetUser",
        },
      },
    ];

    const result = await assetsCollection.aggregate(pipeline).toArray();

    if (result) {
      return NextResponse.json(result);
    } else {
      return NextResponse.json(
        { status: 400, message: "Failed to load data" },
        { status: 400 }
      );
    }
  } catch (error) {
    console.error("Error to get document:", error);
    return NextResponse.json(
      { error: "Failed to get document" },
      { status: 500 }
    );
  }
}
