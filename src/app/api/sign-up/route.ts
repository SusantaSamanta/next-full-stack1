import dbConnect from "@/lib/dbConnect";
import UserModel from "@/model/User";


export async function POST(request: Request) {
    await dbConnect();
    // return response.json({success: false});
    try {
        const { username, email, password } = await request.json();
        if (!username || !email || !password) {
            return Response.json(
                { success: false, message: "Username email password are required" },
                { status: 400 }
            );
        }
        console.log("ok")
        const userExistAndVerified = await UserModel.findOne({ username, isVerified: true });

        if (userExistAndVerified) {
            return Response.json(
                { success: false, message: "An user already exist with this username" },
                { status: 400 }
            );
        }


        const hashPassword = password;
        const expireDate = new Date();
        expireDate.setHours(expireDate.getHours() + 1);

        const verifyOTP = Math.floor(100000 + Math.random() * 900000).toString();


        const existingUserByEmail = await UserModel.findOne({ email });
        if (existingUserByEmail) {
            if (existingUserByEmail.isVerified) { // user exist and verified 
                return Response.json(
                    { success: false, message: "An user already exist with this email" },
                    { status: 400 }
                );
            } else {  // user exist but not verified so update new data 
                existingUserByEmail.password = hashPassword;
                existingUserByEmail.verifyCode = verifyOTP;
                existingUserByEmail.verifyCodeExpire = expireDate;
                await existingUserByEmail.save();
                // then code jump to last which send response verification code 
            }
        } else { /// No user present in this email creating new user 

            const newUser = new UserModel({
                username,
                email,
                password: hashPassword,
                verifyCode: verifyOTP,
                verifyCodeExpire: expireDate,
                isVerified: false,
                isAcceptingMessage: true,
                messages: [],
            })
            await newUser.save();


        }

        // sendRegistrationMail()
        console.log("Verification Code : ", verifyOTP);

        return Response.json(
            { success: true, message: "Registration successful verification mail send" },
            { status: 201 }
        );




    } catch (error) {
        console.log("Error for signup.......");
        return Response.json(
            { success: false, message: "Error during registration" },
            { status: 500 }
        );
    }
}