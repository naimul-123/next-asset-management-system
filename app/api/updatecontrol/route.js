import { NextResponse } from "next/server";
import clientPromise from "../../../lib/mongodb";
import { ObjectId } from "mongodb";

const client = await clientPromise;
const db = client.db("deadstock");
const controlDb = db.collection("controls");

export async function PUT(req) {
  try {
    const { _id, rolename, permissions } = await req.json();
    // console.log(_id, rolename, permissions);
    if (!_id || !rolename || !permissions) {
      return NextResponse.json(
        { error: "Missing required fields." },
        { status: 400 }
      );
    }

    const updated = await controlDb.updateOne(
      { _id: new ObjectId(_id) },
      { $set: { rolename, permissions } }
    );

    if (updated.modifiedCount > 0) {
      return NextResponse.json(
        { message: "Role updated successfully.", success: true },
        { status: 200 }
      );
    } else {
      return NextResponse.json(
        { error: "No changes made or role not found.", success: false },

      );
    }
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
