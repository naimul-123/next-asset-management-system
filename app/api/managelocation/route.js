import { NextResponse } from "next/server";
import clientPromise from "../../../lib/mongodb";

export async function POST(req) {
    try {
        const client = await clientPromise;
        const db = client.db("deadstock");
        const locationsCollection = db.collection("locations");

        const { department, locationType, location, formType } = await req.json();

        if (!department || !locationType) {
            return NextResponse.json(
                { error: "Department or location type is required" },
                { status: 400 }
            );
        }

        const departmentDoc = await locationsCollection.findOne({ department });

        if (!departmentDoc) {
            return NextResponse.json(
                { error: "Department not found" },
                { status: 404 }
            );
        }

        const existingLocationType = departmentDoc.locations.find(
            (lt) => lt.locationType === locationType
        );

        // Case 1: Add new locationType
        if (formType === "type") {
            if (existingLocationType) {
                return NextResponse.json(
                    { error: "Location type already exists" },
                    { status: 400 }
                );
            }

            const result = await locationsCollection.updateOne(
                { department },
                {
                    $push: {
                        locations: {
                            locationType,
                            location: [],
                        },
                    },
                }
            );

            return NextResponse.json({ success: true, message: "Location type added", result });
        }

        // Case 2: Add new location
        if (formType === "location") {
            if (!location) {
                return NextResponse.json(
                    { error: "Location is required to add a new location" },
                    { status: 400 }
                );
            }

            if (!existingLocationType) {
                return NextResponse.json(
                    { error: "Location type not found in this department" },
                    { status: 404 }
                );
            }

            if (existingLocationType.location.includes(location)) {
                return NextResponse.json(
                    { error: "Location already exists in this location type" },
                    { status: 400 }
                );
            }

            const result = await locationsCollection.updateOne(
                {
                    department,
                    "locations.locationType": locationType,
                },
                {
                    $push: {
                        "locations.$.location": location,
                    },
                }
            );

            return NextResponse.json({ success: true, message: "Location added", result });
        }

        return NextResponse.json({ error: "Invalid formType" }, { status: 400 });
    } catch (error) {
        console.error("Error:", error);
        return NextResponse.json(
            { error: "Server error", details: error.message },
            { status: 500 }
        );
    }
}
