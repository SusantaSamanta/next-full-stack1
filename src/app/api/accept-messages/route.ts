import { getServerSession } from "next-auth";
import { authOptions } from "../auth/[...nextauth]/options";
import dbConnect from "@/lib/dbConnect";
import UserModel from "@/model/User";
import { User } from "next-auth";

///    3000/api/accepting-messages : where we receive login userId from session and change his message accepting status true or false

export const POST = async (request: Request) => {
    await dbConnect();
    const session = await getServerSession(authOptions); // this session came from /api/auth/[...nextauth]/options
    const user: User = session?.user as User; // this user object inside session we insert from token 
    if (!session || !session.user) {
        return Response.json({
            success: false,
            message: "Not authenticated"
        }, { status: 401 });
    }
    const userId = user._id;
    const { acceptMessages } = await request.json();
    try {
        const updatedUser = await UserModel.findByIdAndUpdate(
            userId,
            { isAcceptingMessage: acceptMessages },
            { new: true } // this option mean after update return new result 
        )
        if (!updatedUser) {
            return Response.json({
                success: false,
                message: "Not able to update user massage accept status."
            }, { status: 401 });
        }
        return Response.json({
            success: true,
            message: "User massage accept status update successfully.",
            updatedUser
        }, { status: 201 });

    } catch (error) {
        console.log("Not able to update user massage accept status.");
        return Response.json({
            success: false,
            message: "Not able to update user massage accept status."
        }, { status: 500 });
    }
}


///    3000/api/accepting-messages : where we receive login userId from session and send his current message accepting status 

export const GET = async (request: Request) => {
    await dbConnect();
    console.log('first')
    const session = await getServerSession(authOptions); // this session came from /api/auth/[...nextauth]/options
    const user: User = session?.user as User; // this user object inside session we insert from token 
    if (!session || !session.user) {
        return Response.json({
            success: false,
            message: "Not authenticated user"
        }, { status: 401 });
    }
    console.log('second')
    const userId = user._id;
    try {
        const isUser = await UserModel.findById(userId)
        console.log(isUser, "third")
        if (!isUser) {
            return Response.json({
                success: false,
                message: "Not able to send user massage accept status."
            }, { status: 404 });
        }
        return Response.json({
            success: true,
            isAcceptingMessage: isUser.isAcceptingMessage
        }, { status: 200 });

    } catch (error) {
        console.log("Not able to send user massage accept status.");
        return Response.json({
            success: false,
            message: "Not able to send user massage accept status."
        }, { status: 500 });
    }
}
