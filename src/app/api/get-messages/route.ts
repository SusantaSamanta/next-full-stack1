import dbConnect from "@/lib/dbConnect";
import { getServerSession, User } from "next-auth";
import { authOptions } from "../auth/[...nextauth]/options";
import UserModel from "@/model/User";



function wait(): any {
    return new Promise((resolve, reject) => {
        setTimeout(() => {
            resolve("ok");
        }, 1000);
    })
}


export const GET = async () => {
  await wait();
  try {
    await dbConnect();

    const session = await getServerSession(authOptions);
    const user: User = session?.user as User;

    if (!session || !session.user) {
      return Response.json(
        {
          success: false,
          message: "Not authenticated user",
        },
        { status: 401 }
      );
    }

    const foundUser = await UserModel.findById(user._id);

    if (!foundUser) {
      return Response.json(
        {
          success: false,
          message: "User not found",
        },
        { status: 404 }
      );
    }

    const messages = [...foundUser.messages].sort(
      (a, b) =>
        new Date(b.createdAt).getTime() -
        new Date(a.createdAt).getTime()
    );

    return Response.json(
      {
        success: true,
        messages,
        message: "Messages fetched successfully",
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error fetching messages:", error);

    return Response.json(
      {
        success: false,
        message: "Failed to fetch messages",
      },
      { status: 500 }
    );
  }
};