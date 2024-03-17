import { connect } from "@/app/dbConfig/dbConfig";
import User from "@/app/models/User";
import { NextRequest, NextResponse } from "next/server";
import bcryptjs from 'bcryptjs';

export async function POST(req: NextRequest) {
    connect();
    const {email, password} = await req.json();

    const user = await User.findOne({email});

    if(user){
        return NextResponse.json({error: 'User already exists, please try to Login'}, {status: 400});
    }

    const salt = await bcryptjs.genSalt(10);
    const hashedPwd = await bcryptjs.hash(password, salt);

    const newUser = new User({
        email,
        password: hashedPwd
    });

    const savedUser = await newUser.save();

    return NextResponse.json({message: 'ok'})
    
}