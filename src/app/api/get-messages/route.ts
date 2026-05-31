import dbConnect from "@/lib/dbConnect"
import { getServerSession, User } from "next-auth";
import { authOptions } from "../auth/[...nextauth]/options";
import mongoose from "mongoose";
import UserModel from "@/model/User";


export const GET = async (request: Request) => {
    await dbConnect();
    const session = await getServerSession(authOptions); // this session came from /api/auth/[...nextauth]/options
    const user: User = session?.user as User; // this user object inside session we insert from token 
    if (!session || !session.user) {
        return Response.json({
            success: false,
            message: "Not authenticated user"
        }, { status: 401 });
    }
    // const userId = user._id;
    const userId = new mongoose.Types.ObjectId(user._id);
    try {
        const isUser = await UserModel.aggregate([
            { $match: {id: userId}},
            {$unwind: '$messages'},
            {$sort: {'messages.createdAt': -1}},
            {$group: {_id: '$_id', messages: {$push: '$messages'}}}
        ])
        if (!isUser || isUser.length === 0) {
            return Response.json({
                success: false,
                message: "Not able to get user messages."
            }, { status: 401 });
        }
        return Response.json({
            success: true,
            messages: isUser[0].messages
        }, { status: 200 });

    } catch (error) {
        console.log("Not able to send user messages.");
        return Response.json({
            success: false,
            message: "Not able to send user messages."
        }, { status: 500 });
    }
}