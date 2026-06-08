import UserModel from "@/model/User";
import dbConnect from "@/lib/dbConnect";
import { success } from "zod";
import { getServerSession, User } from "next-auth";
import { authOptions } from "../auth/[...nextauth]/options";


export const DELETE = async (request: Request) => {
    await dbConnect();
    const session = await getServerSession(authOptions);
    if (!session || !session.user) {
        return Response.json({
            success: false,
            message: "Not authenticated"
        }, { status: 401 });
    }
    
    const { messageId, username } = await request.json();
    if (!messageId || !username) {
        return Response.json({
            success: false,
            message: "Require messageId and username"
        }, { status: 401 });
    }

    try {
        const isUser = await UserModel.findOneAndUpdate(
            { username },  // find the document where username matches
            {
                $pull: {  // Remove message=messageId from the messages array
                    messages: {
                        _id: messageId,
                    },
                },
            },
            { new: true }   // Return the updated document after modification
        );

        if (!isUser) {
            return Response.json({
                success: false,
                message: "Require message accepting status."
            }, { status: 401 });
        }
        return Response.json({
            success: true,
            message: "Message deleted successfully"
        }, { status: 201 });

    } catch (error) {
        console.log(error);
        return Response.json({
            success: false,
            message: "Error happing during message delete."
        }, { status: 500 });
    }
}