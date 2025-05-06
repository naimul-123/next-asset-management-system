import { NextResponse } from "next/server";
import clientPromise from "../../../lib/mongodb";
const client = await clientPromise;
const db = client.db("deadstock");
const assetClassdb = db.collection("assetClass");
const controlsdb = db.collection("controls");
export async function GET(req) {
  try {
    const { searchParams } = new URL(req.url);

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

    const response = NextResponse.json(assetClasses.sort());
    return response;
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to get asset class", error },
      { status: 500 }
    );
  }
}
