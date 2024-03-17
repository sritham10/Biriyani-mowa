import { connect } from "@/app/dbConfig/dbConfig";
import User from "@/app/models/User";
import { NextRequest, NextResponse } from "next/server";
import bcryptjs from 'bcryptjs';

export async function POST(req: NextRequest) {
    try {
        connect();
        const {email, password} = await req.json();

        const user = await User.findOne({email});

        if(!user){
            return NextResponse.json({error: 'User does not exists'}, {status: 400});
        }

        const isMatch = await bcryptjs.compare(password, user.password);

        if(!isMatch) {
            return NextResponse.json({error: 'Credentials mismatch'}, {status: 401});
        }

        return NextResponse.json({message: 'ok'})

    } catch (error:any) {
        return NextResponse.json({error: error.message})
    }
}