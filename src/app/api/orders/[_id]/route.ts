import Order from "@/app/models/Orders";
import { NextRequest, NextResponse } from "next/server";
import isAdmin from "@/app/utils/isAdmin";
import { authOptions } from "@/app/utils/authOptions";
import { getServerSession } from "next-auth";
import { connect } from "@/app/dbConfig/dbConfig";

type ParamType = {
    params: {
        _id: string
    }
}

export async function GET(req: NextRequest, {params: {_id}}: ParamType) {
    try {
        connect();
        const session = await getServerSession(authOptions);
        if(session?.user){
            const order = await Order.findOne({_id});
            if(!order) throw new Error('No order found!!');
            if(order.userEmail !== session.user.email) throw new Error('No order found!')
            return NextResponse.json(order);
        } else {
            return NextResponse.json({error: 'Cannot see the requested page.'}, {status: 401});
        }
    } catch (err: any) {
        return NextResponse.json({error: err.message}, {status: 500});
    }
}

export async function PUT(req: NextRequest, {params: {_id}}: ParamType) {
    try {
        connect();
        const cancelOrder = req.nextUrl.searchParams.get('cancelOrder');
        const data = await req.json();
        
        if(await isAdmin()){
            const order = await Order.findByIdAndUpdate(_id, data, {new: true});
            if(!order) throw new Error('Something went wrong')               ;
            return NextResponse.json(order);
        } else if(cancelOrder) {
            const order = await Order.findByIdAndUpdate(_id, data, {new: true});
            if(!order) throw new Error('Something went wrong')               ;
            return NextResponse.json(order);
        }
        else {
            return NextResponse.json({error: 'Cannot see the requested page.'}, {status: 401});
        }
        
    } catch (err: any) {
        return NextResponse.json({error: err.message}, {status: 500});
    }
}