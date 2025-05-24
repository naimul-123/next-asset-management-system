import { NextResponse } from "next/server";
export async function POST() {
  const response = NextResponse.json({
    message: "Logged out successfully",
    success: true,
  });
  response.cookies.delete("token");
  return response;
}
