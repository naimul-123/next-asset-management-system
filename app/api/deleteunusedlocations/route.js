import clientPromise from "@/lib/mongodb";
import { NextResponse } from "next/server";

export async function DELETE(req) {
    try {
        const client = await clientPromise;
        const db = client.db("deadstock");
        const locationsCollection = db.collection("locations");

        const { department, locationType, location } = await req.json();

        if (!department || !locationType) {
            return NextResponse.json(
                { error: "Missing required fields: department or locationType" },
                { status: 400 }
            );
        }

        let updateResult;

        if (location) {
            // Remove a single location under a locationType
            updateResult = await locationsCollection.updateOne(
                { department, "locations.locationType": locationType },
                {
                    $pull: {
                        "locations.$.location": location,
                    },
                }
            );
        } else {
            // Remove the entire locationType
            updateResult = await locationsCollection.updateOne(
                { department },
                {
                    $pull: {
                        locations: { locationType },
                    },
                }
            );
        }

        if (updateResult.modifiedCount === 0) {
            return NextResponse.json(
                { error: "No matching location found or already deleted" },
                { status: 404 }
            );
        }

        return NextResponse.json({ message: "Deleted successfully" });
    } catch (error) {
        return NextResponse.json(
            { error: "Server error: " + error.message },
            { status: 500 }
        );
    }
}
