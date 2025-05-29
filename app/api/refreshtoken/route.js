import { NextResponse } from "next/server";
import jwt from "jsonwebtoken";

const secretKey = process.env.SECRET_KEY;

export async function POST(req) {
  try {
    const token = req.cookies.get("token")?.value;

    if (!token) {
      return NextResponse.json({ error: "No token found" }, { status: 401 });
    }

    // Verify and decode existing token
    const decoded = jwt.verify(token, secretKey);

    // Prepare new token payload
    const payload = {
      name: decoded.name,
      sap: decoded.sap,
      role: decoded.role,
      isSuperAdmin: decoded.isSuperAdmin,
    };

    const newToken = jwt.sign(payload, secretKey, { expiresIn: "5m" });
    const newExpiredTime = Date.now() + 5 * 60 * 1000;

    const response = NextResponse.json(
      { success: true, message: "Token refreshed" },
      { status: 200 }
    );

    // Set refreshed cookies
    response.cookies.set("token", newToken, {
      httpOnly: true,
      maxAge: 300,
      path: "/",
      secure: process.env.NODE_ENV === "production",
    });
    response.cookies.set("expiredTime", newExpiredTime.toString(), {
      httpOnly: false,
      maxAge: 300,
      path: "/",
      secure: process.env.NODE_ENV === "production",
    });

    return response;
  } catch (error) {
    console.error("Refresh token failed:", error);
    return NextResponse.json(
      { error: "Invalid or expired token" },
      { status: 401 }
    );
  }
}
