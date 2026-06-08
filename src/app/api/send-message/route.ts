import dbConnect from "@/lib/dbConnect"
import mongoose from "mongoose";
import UserModel from "@/model/User";
import { Message } from "@/model/User";


export const POST = async (request: Request) => {
    await dbConnect();

    const { username, content, sender } = await request.json();
    console.log(username, content, sender)
    if (!username || !content) {
        return Response.json({
            success: false,
            messages: 'All fields require.'
        }, { status: 403 });
    }
    try {
        const isUser = await UserModel.findOne({username});

        if (!isUser) {
            return Response.json({
                success: false,
                message: "User not found."
            }, { status: 404 });
        }
        if (!isUser.isAcceptingMessage) {
            return Response.json({
                success: false,
                messages: 'User not accepting message for now.'
            }, { status: 403 });
        }

        const newMessage = { content, createdAt: new Date(), sender };
        isUser.messages.push(newMessage as Message); // this Message interface came from User model
        await isUser.save();
        console.log(isUser)
        return Response.json({
            success: true,
            message: "Message send successfully."
        }, { status: 200 });

    } catch (error) {
        console.log("Not able to send user message.",error);
        return Response.json({
            success: false,
            message: "Not able to send user message."
        }, { status: 500 });
    }
}