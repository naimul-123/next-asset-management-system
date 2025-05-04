import { NextResponse } from "next/server";
import clientPromise from "../../../lib/mongodb";
import { ObjectId } from "mongodb";

export async function DELETE(req) {
  try {
    const { id } = await req.json();
    console.log(id);
    if (!id) {
      return NextResponse.json(
        { error: "Missing required field: id." },
        { status: 400 }
      );
    }

    const client = await clientPromise;
    const db = client.db("deadstock");
    const controlDb = db.collection("controls");

    const deleted = await controlDb.deleteOne({ _id: new ObjectId(id) });

    if (deleted.deletedCount > 0) {
      return NextResponse.json(
        { message: "Role deleted successfully.", success: true },
        { status: 200 }
      );
    } else {
      return NextResponse.json(
        { error: "Role not found or already deleted." },
        { status: 404 }
      );
    }
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
