import type { NextAuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import GoogleProvider from 'next-auth/providers/google';
import { connect } from "../dbConfig/dbConfig";
import User from "../models/User";
import bcryptjs from 'bcryptjs';
import { MongoDBAdapter } from "@auth/mongodb-adapter";
import clientPromise from "@/app/libs/mongoConnect";

export const authOptions: NextAuthOptions = {
    secret: process.env.SECRET,
    adapter: MongoDBAdapter(clientPromise!),
    providers: [
        GoogleProvider({
            clientId: process.env.GOOGLE_CLIENT_ID as string,
            clientSecret: process.env.GOOGLE_CLIENT_SECRET as string,
        }),
        CredentialsProvider({
            name: 'credentials' ,
            credentials: {
                email: {},
                password: {},
            },
            async authorize(credentials, req){
                const {email, password}: any = credentials;
                connect();

                try {
                const user = await User.findOne({email});

                if(user){
                    const isMatch = await bcryptjs.compare(password, user.password);
                    if(isMatch) {
                    return user;
                    }
                }
                return null;
                } catch(err){
                console.log("Error: ", err);
                }
            }
        }),
    ],
    session: {
        strategy: 'jwt'
    },
}