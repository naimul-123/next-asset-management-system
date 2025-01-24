
import { NextResponse } from "next/server";
import clientPromise from "@/lib/mongodb";
import jwt from "jsonwebtoken";
const secretKey = process.env.SECRET_KEY;
const client = await clientPromise;
const db = client.db('deadstock');
const employeesData = db.collection('employees')
export async function POST(req) {
    try {
        const data = await req.json();
        const filter = { sap: data.sap }
        const updateUser = {
            $set: {
                department: data?.department,
                section: data?.section
            }
        }
        const result = await employeesData.updateOne(filter, updateUser);
        if (result.modifiedCount) {
            const employee = await employeesData.findOne(filter);
            const user = {
                sap: employee.sap,
                name: employee.name_en,
                designation: employee.designation_en,
                department: employee?.department,
                section: employee?.section,
            }
            const token = jwt.sign(user, secretKey, { expiresIn: '30m' });
            const response = NextResponse.json({ message: 'update successcull' }, { status: 200 });
            response.cookies.set('token', token, {
                httpOnly: true,
                maxAge: 30 * 60,
                path: '/',
                secure: process.env.NODE_ENV === 'production',
            })
            return response
        }
    } catch (error) {
        return NextResponse.json(
            { error: 'Login failed', error },
            { status: 500 }
        );
    }

}





