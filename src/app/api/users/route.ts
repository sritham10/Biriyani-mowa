import User from "@/app/models/User";
import { NextRequest, NextResponse } from "next/server";
import isAdmin from "@/app/utils/isAdmin";
import { connect } from "@/app/dbConfig/dbConfig";

export async function GET(req: NextRequest) {
    try {
        connect();
        const users = await User.find().lean();
        if(await isAdmin()){
            return NextResponse.json(users);
        } else {
            return NextResponse.json({error: 'Cannot see the requested page.'}, {status: 401});
        }
    } catch (error: any) {
        return NextResponse.json({error: error.message}, {status: 500});
    }
}

export async function PUT(req: NextRequest) {
    try {
        connect();
        if(await isAdmin()){
            const data = await req.json();
            const {userId, actionType} = data;
            const noOfAdmins = await User.countDocuments({isAdmin: true});
            if(noOfAdmins === 1 && actionType === 'USER') throw new Error('Cannot delete the only ADMIN');
            const updateUser = await User.findByIdAndUpdate({_id: userId}, {$set: {isAdmin: actionType === 'USER' ? false : true}}, {new: true});
            return NextResponse.json(updateUser);
        } else {
            return NextResponse.json({error: 'Cannot see the requested page.'}, {status: 401});
        }

    } catch (error: any) {
        return NextResponse.json({error: error.message}, {status: 500});
    }
}