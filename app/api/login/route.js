
import { NextResponse } from "next/server";
import clientPromise from "../../../lib/mongodb";
import jwt from "jsonwebtoken";

const secretKey = process.env.SECRET_KEY;

const client = await clientPromise;
const db = client.db('deadstock');
const employeesData = db.collection('employees')

export async function POST(req) {

    try {
        const data = await req.json();
        const query = { sap: parseInt(data.sap) }
        const employee = await employeesData.findOne(query);
        // console.log(employee);
        if (!employee) {
            return NextResponse.json({ error: 'Invalid SAP ID' }, { status: 401 });
        }

        const user = {
            sap: employee.sap,
            name: employee.name_en,
            designation: employee.designation_en,
            department: employee?.department || "",
            section: employee?.section || "",
        }
        // console.log(user);
        const token = jwt.sign(user, secretKey, { expiresIn: '30m' });

        const response = NextResponse.json({ message: 'Login successcull' }, { status: 200 });

        response.cookies.set('token', token, {
            httpOnly: true,
            maxAge: 30 * 60,
            path: '/',
            secure: process.env.NODE_ENV === 'production',

        })
        return response

    } catch (error) {
        console.error('Login error:', error);
        return NextResponse.json(
            { error: 'Login failed' },
            { status: 500 }
        );
    }

}





