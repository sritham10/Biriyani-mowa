import { connect } from "@/app/dbConfig/dbConfig";
import { getServerSession } from "next-auth";
import { NextRequest, NextResponse } from "next/server";
import isAdmin from "@/app/utils/isAdmin";
import { authOptions } from "@/app/utils/authOptions";
import Order from "@/app/models/Orders";
// import Stripe from "stripe";

// const stripe = new Stripe(process.env.STRIPE_API_SECRET!);

// export async function POST(req: NextRequest){
//     connect();

//     try{
//         const {cartProducts, address} = await req.json();
        
//         const session = await getServerSession(authOptions);
//         const userEmail = session?.user?.email!;
        

//         const newOrder = new Order({
//             userEmail,
//             ...address,
//             cartProducts
//         });

//         const savedOrder = await newOrder.save();

//         const stripeLineItems: Stripe.Checkout.SessionCreateParams.LineItem[] | undefined = [];
        
//         cartProducts.forEach(prod => {
//             const prodName = prod.itemName;
//             const prodPrice = Number(prod.itemPrice);
//             stripeLineItems.push({
//                 quantity: 1,
//                 price_data: {
//                     currency: 'INR',
//                     product_data: {
//                         name: prodName
//                     },
//                     unit_amount: prodPrice*100
//                 }
//             })    
//         });


//         const stripeSession: Stripe.Checkout.SessionCreateParams = await stripe.checkout.sessions.create({
//             line_items: stripeLineItems,
//             mode: 'payment',
//             customer_email: userEmail,
//             success_url: process.env.NEXTAUTH_URL+'/cart?success=1',
//             cancel_url: process.env.NEXTAUTH_URL+'/cart?failure=1',
//             metadata: {orderId: savedOrder._id},
//             shipping_options: [
//                 {
//                     shipping_rate_data: {
//                         display_name: 'Delivery fee',
//                         type: 'fixed_amount',
//                         fixed_amount: {amount: 200, currency: 'INR'},
//                     }
//                 }
//             ]
//         });

//         return NextResponse.json(true);
//     }catch(err: any){
//         return NextResponse.json({error: err.message}, {status: 500});
//     }

// }

export async function GET(req: NextRequest) {
    try {
        connect();
        const admin = req.nextUrl.searchParams.get('admin');
        const orders = req.nextUrl.searchParams.get('orders');
        const session = await getServerSession(authOptions);
        const userEmail = session?.user?.email!;

        if(admin && orders === 'all' && await isAdmin() && session?.user){
            const allUserOrders =  await Order.find();   
            return NextResponse.json(allUserOrders);
        } else if(session?.user) {
            const userOrders = await Order.find({userEmail: userEmail});   
            return NextResponse.json(userOrders);
        } else {
            return NextResponse.json({error: 'Cannot see the requested page.'}, {status: 401});
        }
    } catch (error: any) {
        return NextResponse.json({error: error.message}, {status: 500});
    }
}

export async function POST(req: NextRequest){
    try {
        connect();
        const {address, cartProducts, cartValue, finalCartValue, discountValue, couponApplied} = await req.json();
        const session = await getServerSession(authOptions);
        const userEmail = session?.user?.email!;
        
        const newOrder = new Order({
            userEmail,
            ...address,
            cartProducts,
            cartValue,
            finalCartValue,
            discountValue,
            couponApplied
        });

        const savedOrder = await newOrder.save();

        if(savedOrder) {
            return NextResponse.json({
                orderId: savedOrder._id,
                orderStatus: savedOrder.orderStatus
            });
        } else {
            throw new Error('Something went wrong')
        }

    } catch (error: any) {
        return NextResponse.json({error: error.message}, {status: 500});
    }
}