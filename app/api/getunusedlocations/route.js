import clientPromise from "@/lib/mongodb";
import { NextResponse } from "next/server";

export async function GET() {
    async function getAllUnusedLocationTypesAndLocations() {
        const client = await clientPromise;
        const db = client.db("deadstock");

        const locationsCollection = db.collection("locations");
        const assetCollection = db.collection("assetLocationInfo");

        const allDepartments = await locationsCollection.find({}).toArray();

        const unusedLocationTypes = [];
        const unusedLocations = [];

        for (const doc of allDepartments) {
            const department = doc.department;

            const usedAssets = await assetCollection
                .find({ "assetLocation.department": department })
                .project({
                    _id: 0,
                    "assetLocation.locationType": 1,
                    "assetLocation.location": 1,
                })
                .toArray();

            // Map locationType to used locations Set
            const usedMap = {};
            for (const { assetLocation } of usedAssets) {
                const type = assetLocation.locationType;
                const loc = assetLocation.location;
                if (!usedMap[type]) usedMap[type] = new Set();
                usedMap[type].add(loc);
            }

            for (const { locationType, location } of doc.locations) {
                if (!usedMap[locationType]) {
                    // Entire locationType is unused
                    unusedLocationTypes.push({
                        department,
                        locationType,
                    });
                } else {
                    // Some individual locations may be unused
                    const unusedLocs = location.filter(
                        (loc) => !usedMap[locationType].has(loc)
                    );

                    for (const loc of unusedLocs) {
                        unusedLocations.push({
                            department,
                            locationType,
                            location: loc,
                        });
                    }
                }
            }
        }

        return { unusedLocationTypes, unusedLocations };
    }

    const result = await getAllUnusedLocationTypesAndLocations();
    return NextResponse.json(result);
}
