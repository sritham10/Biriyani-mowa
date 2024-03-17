import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
    const data = await req.formData() ;

    if(data.get('file')){
        
    }

    return NextResponse.json(true);
}