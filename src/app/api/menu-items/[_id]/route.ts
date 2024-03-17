import MenuItem from "@/app/models/MenuItems";
import { NextRequest, NextResponse } from "next/server";
import isAdmin from "@/app/utils/isAdmin";
import { connect } from "@/app/dbConfig/dbConfig";

type ParamType = {
    params: {
        _id: string
    }
}

export async function GET(req: NextRequest, {params: {_id}}: ParamType) {
    try {
        connect();
        if(await isAdmin()){
            const menuItem = await MenuItem.findOne({_id});
            return NextResponse.json(menuItem)
        } else {
            return NextResponse.json({error: 'Cannot see the requested page.'}, {status: 401});
        }
    } catch (err: any) {
        return NextResponse.json({error: err.message}, {status: 500});
    }
}

export async function DELETE(req: NextRequest, {params: {_id}}: ParamType) {
    try {
        connect();
        if(await isAdmin()){
            const menuItem = await MenuItem.findByIdAndDelete({_id});
            return NextResponse.json(menuItem)
        } else {
            return NextResponse.json({error: 'Cannot see the requested page.'}, {status: 401});
        }
    } catch (err: any) {
        return NextResponse.json({error: err.message}, {status: 500});
    }
}