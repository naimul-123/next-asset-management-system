// app/api/auth/[...nextauth]/route.js
import NextAuth from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import { getUser } from "@/lib/getUser";
import bcrypt from 'bcrypt'

export const authOptions = {
    providers: [
        CredentialsProvider({
            name: "Credentials",
            credentials: {
                sap: { label: "sap", type: "text" },
                password: { label: "password", type: "password" },
            },
            async authorize(credentials) {
                const user = await getUser(credentials.sap);
                if (!user) return null;

                const isValid = await bcrypt.compare(credentials.password, user.password);
                if (!isValid) return null;

                return {
                    sap: user.sap,
                    name: user.name,
                    role: user.role,
                    isSuperAdmin: user.isSuperAdmin,
                };
            },
        }),
    ],
    pages: {
        signIn: "/login",
    },
    session: {
        strategy: "jwt",
        maxAge: 60 * 60 * 8,   // 8 hours
        updateAge: 60 * 60,    // reissue token every 1 hour if user is active
    },
    jwt: {
        maxAge: 60 * 60 * 8,   // 8 hours
    },
    callbacks: {
        async jwt({ token, user }) {
            if (user) {
                token.sap = user.sap;
                token.name = user.name;
                token.role = user.role;
                token.isSuperAdmin = user.isSuperAdmin;
            }
            return token;
        },
        async session({ session, token }) {
            session.user.sap = token.sap;
            session.user.name = token.name;
            session.user.role = token.role;
            session.user.isSuperAdmin = token.isSuperAdmin;
            return session;
        },
    },
    secret: process.env.SECRET_KEY,
};


// Create the NextAuth API route handlers
const handler = NextAuth(authOptions);
export { handler as GET, handler as POST };
