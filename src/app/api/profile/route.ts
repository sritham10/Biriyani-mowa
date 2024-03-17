import { connect } from "@/app/dbConfig/dbConfig";
import { getServerSession } from "next-auth";
import { NextRequest, NextResponse } from "next/server";
import { authOptions } from "@/app/utils/authOptions";
import User from "@/app/models/User";

export async function PUT(req: NextRequest){
    connect();
    const data = await req.json();
    const serverSession = await getServerSession(authOptions);
    const email = serverSession?.user?.email;
    const { name, phone, streetAddress, city, postal, country } = data;    

    if('name' in data){
        const res = await User.findOneAndUpdate({email}, {name, phone, streetAddress, city, postal, country}, {new: true});
    }

    return NextResponse.json(true);
    
}

export async function GET() {
    try {
        connect();
        const serverSession = await getServerSession(authOptions);
        const email = serverSession?.user?.email;

        if(!email) throw new Error('Login to view this page')

        const user = await User.findOne({email}).select('-password');
        return NextResponse.json(user);

    }catch(err: any){
        return NextResponse.json({error: err.message})
    }
}

export async function POST(req: NextRequest){
    try {
        connect();
        const {userEmail} = await req.json();
        if(!userEmail) throw new Error('No User Email Provided!')

        const user = await User.findOne({email: userEmail}).select('-password');
        return NextResponse.json(user);

    }catch(err: any){
        return NextResponse.json({error: err.message})
    }
}