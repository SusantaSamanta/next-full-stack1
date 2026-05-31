import UserModel from "@/model/User";
import dbConnect from "@/lib/dbConnect";

//               /api/check-username-unique
export async function GET(request: Request) {
    await dbConnect();
    try {
        const url = new URL(request.url);
        const username = url.searchParams.get('username');
        if (!username) {
            return Response.json({
                success: false,
                message: "Username require."
            }, { status: 400 });
        }
        const user = await UserModel.findOne({ username ,isVerified: true})
        if (user) {
            return Response.json({
                success: false,
                message: "This username is already taken."
            }, { status: 400 });
        }
        return Response.json({
            success: true,
            message: "This username is available."
        }, { status: 200 });

    } catch (error) {
        console.log("Error for check username unique....", error);
        return Response.json({
            success: false,
            message: "Not able to check username uniqueness."
        }, { status: 500 });
    }
}