import mongoose from "mongoose";

type ConnectionObject = {
    isConnected? : number;
}
const connection: ConnectionObject ={}

const dbConnect = async (): Promise<void> => {
    if(connection.isConnected){
        console.log("Already connected to DB.......");
        return;
    }
    try {
        const db = await mongoose.connect(process.env.MONGODB_URL || "");
        // console.log(con)
        connection.isConnected = db.connections[0].readyState;
        console.log("DB connected .........");
    } catch (error) {
        console.log("DB connection fail......", error);
        process.exit(1);
    }
}  
    
export default dbConnect;