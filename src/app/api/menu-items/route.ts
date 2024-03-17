import { connect } from "@/app/dbConfig/dbConfig";
import MenuItem from "@/app/models/MenuItems";
import { NextRequest, NextResponse } from "next/server";
import isAdmin from "@/app/utils/isAdmin";

export async function POST(req: NextRequest) {
    try {
        connect();
        if(await isAdmin()){
            const data = await req.json();        
            const newMenuItem = new MenuItem(data);
            const saveMenuItem = await newMenuItem.save();
            return NextResponse.json(saveMenuItem.itemName);
        }else {
            return NextResponse.json({error: 'Cannot see the requested page.'}, {status: 401});
        }
    }catch(err: any){
        return NextResponse.json({error: err.message}, {status: 500});
    }
}

export async function GET(req: NextRequest) {
    try {
        connect();
        let menuItems = await MenuItem.find(); 
        const noPriorityItems = menuItems.filter(item => item.priority.isPriority === false);
        const priorityItems = menuItems.filter(item => item.priority.isPriority === true);
        menuItems = [...noPriorityItems, ...priorityItems];
        return NextResponse.json(menuItems);
    }catch(err: any){
        return NextResponse.json({error: err.message}, {status: 500});
    }
}

export async function PUT(req: NextRequest) {
    try {
        connect();
        if(await isAdmin()){
            const {_id, ...data} = await req.json();
            const doc = await MenuItem.findByIdAndUpdate(_id, data, {new: true});
            return NextResponse.json(doc.itemName);
        }else {
            return NextResponse.json({error: 'Cannot see the requested page.'}, {status: 401});
        }
    }catch(err: any){
        return NextResponse.json({error: err.message}, {status: 500});
    }
}