import dbConnect from "@/lib/dbConnect";
import UserModel from "@/model/User";

export const POST = async (request: Request) => {
    await dbConnect();
    try {
        const { email, verifyCode } = await request.json();
        if (!email || !verifyCode) {
            return Response.json({
                success: false,
                message: "Email and verification code required."
            }, { status: 400 });
        }
        const user = await UserModel.findOne({ email });
        if (!user) {
            return Response.json({
                success: false,
                message: "No user found not able to verify."
            }, { status: 500 });
        }

        const isOtpVerified = user.verifyCode === verifyCode;
        const isOtpExpire = new Date(user.verifyCodeExpire) > new Date(); // DB date > date now

        if (isOtpVerified && isOtpExpire) {
            user.isVerified = true;
            await user.save();
            return Response.json({
                success: true,
                message: "User verification successful."
            }, { status: 200 });
        } else {
            return Response.json({
                success: false,
                message: "Verification code wrong or expired."
            }, { status: 500 });
        }


    } catch (error) {
        console.log("Not able to verify code for now....", error);
        return Response.json({
            success: false,
            message: "Not able to check username uniqueness."
        }, { status: 500 });
    }
}