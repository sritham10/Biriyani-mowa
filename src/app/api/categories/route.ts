import Category from "@/app/models/Category";
import MenuItem from "@/app/models/MenuItems";
import { NextRequest, NextResponse } from "next/server";
import isAdmin from "@/app/utils/isAdmin";
import { connect } from "@/app/dbConfig/dbConfig";

export async function GET(req: NextRequest) {
    try {
        connect();
        const categories = await Category.find().lean();
        return NextResponse.json(categories);
    } catch (error: any) {
        return NextResponse.json({error: error.message}, {status: 500});
    }
}

export async function POST(req: NextRequest) {
    try {
        connect();
        if(await isAdmin()){
            const d = await req.json();
        
            const newCategory = new Category({
                name: d.categoryName
            });

            const savedCategory = await newCategory.save();

            return NextResponse.json(savedCategory);
        } else {
            return NextResponse.json({error: 'Cannot see the requested page.'}, {status: 401});
        }

    }catch(err: any){
        return NextResponse.json({error: err.message}, {status: 500});
    }
} 

export async function PUT(req: NextRequest) {
    try {
        connect();
        if(await isAdmin()){
            const data = await req.json();    
            if('categoryName' in data && '_id' in data){
                const res = await Category.findByIdAndUpdate(data._id, {name: data.categoryName}, {new: true});            
                return NextResponse.json(res);
            } else {
                throw new Error('Something went wrong!');
            }
        } else {
            return NextResponse.json({error: 'Cannot see the requested page.'}, {status: 401});
        }

    } catch (error: any) {
        return NextResponse.json({error: error.message}, {status: 500});
    }
}

export async function DELETE(req: NextRequest) {
    try {
        connect();
        if(await isAdmin()){
            const data = await req.json();
            if('_id' in  data){
                const cat = await Category.findById(data._id);
                const menuItems = await MenuItem.find({category: cat.name});
                
                if(menuItems.length > 0){
                    throw new Error(`${menuItems.length} Menu Items exists with this Category.`);
                }
            }   
            if('_id' in data){
                const res = await Category.findByIdAndDelete(data._id);            
                return NextResponse.json(res);
            } else {
                throw new Error('Something went wrong!');
            }
        } else {
            return NextResponse.json({error: 'Cannot see the requested page.'}, {status: 401});
        }
    } catch (error: any) {
        return NextResponse.json({error: error.message}, {status: 500});
    }
}