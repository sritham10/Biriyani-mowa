import { getServerSession } from "next-auth";
import { authOptions } from "./authOptions";
import User from "../models/User";

export default async function isAdmin(){
    const session = await getServerSession(authOptions);
    const userEmail = session?.user?.email;
    if(!userEmail) return false;

    const user = await User.findOne({email: userEmail});
    if(!user) return false;

    return user.isAdmin;
}