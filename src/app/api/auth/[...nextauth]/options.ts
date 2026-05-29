import { NextAuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import bcrypt from "bcryptjs";
import dbConnect from "@/lib/dbConnect";
import UserModel from "@/model/User";

export const authOptions: NextAuthOptions = {
    providers: [
        CredentialsProvider({
            id: "credentials",
            name: "Credentials",
            credentials: {
                email: { label: "Email", type: "text" }, // this rwo field are given by next auth from client sign-in_form as input
                password: { label: "Password", type: "password" },
            },
            async authorize(credential: any): Promise<any> { // create custom authorization fun 
                await dbConnect();
                try {
                    const user = await UserModel.findOne({
                        $or: [
                            { email: credential.identifier.email },   // this credential (nextAuth) give input email 
                            // { username: credential.identifier.username }  // it not user for now.
                        ]
                    });

                    if (!user) { // if we not find input email in db 
                        throw new Error("No user found with this email");
                    }
                    if (!user.isVerified) { // if email find but email not verify 
                        throw new Error("Please verify your email");
                    }

                    const isPasswordMatch = await bcrypt.compare(credential.password, user.password);
                    if (isPasswordMatch) { // if password match 
                        return user; // this return to authOptions
                    } else {
                        throw new Error("Incorrect email email or password");
                    }

                } catch (error: any) {
                    throw new Error(error);
                }
            },

        }),
    ],
    callbacks: {
        async jwt({ token, user }) { // this token not contain much information so 
            if (user) {
                // we insert some other information from user(return from authorize fun) inside token and session
                // but we not insert other data type into token(nextAuth's)
                token._id = user._id?.toString(); // so we need to modify next-auth interface User. In /src/types/next.auth.d.ts
                token.username = user.username;
                token.isVerified = user.isVerified;
                token.isAcceptingMessage = user.isAcceptingMessage;
            }
            return token;
        },
        async session({ session, token }) {
            if(token){
                session.user._id = token._id;
                session.user.username = token.username;
                session.user.isVerified = token.isVerified;
                session.user.isAcceptingMessage = token.isAcceptingMessage;
            }
            return session;
        }
    },
    pages: {
        signIn: '/sign-in'
    },
    session: {
        strategy: 'jwt'
    },
    secret: process.env.NEXTAUTH_SECRET,
} 