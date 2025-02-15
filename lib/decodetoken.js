import { jwtVerify } from "jose";
export async function decodedToken(token) {
    try {
        const secretKey = new TextEncoder().encode(process.env.SECRET_KEY);
        const { payload } = await jwtVerify(token, secretKey);
        return payload
    } catch (error) {
        console.error("Invalid token:", error.message);
        return null;
    }
}