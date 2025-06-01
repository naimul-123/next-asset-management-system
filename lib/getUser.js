
import clientPromise from "./mongodb";
import { NextResponse } from "next/server";
export const getUser = async (sap) => {
    try {
        const client = await clientPromise;
        const db = client.db("deadstock");
        const userDb = db.collection("users")
        const user = await userDb.findOne({ sap });
        if (user.password === "12345") {
            return NextResponse.json({
                redirected: true,
                url: new URL(`/resetpassword?sap=${user.sap}`, req.url),
            });
        }
        else {
            return user;
        }

    } catch (err) {
        console.error("Error fetching user:", err);
        return null;
    }
};
