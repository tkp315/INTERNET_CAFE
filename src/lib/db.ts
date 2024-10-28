import { DB_NAME } from "@/constants"
import mongoose from "mongoose"

interface connectionObject {
    isConnected?:number
}
const connection:connectionObject ={};
const connectToDB = async():Promise<void>=>{
    if(connection.isConnected){
        console.log("Already connected");
        return ;
    }
    try {
        const connectionInstance = await mongoose.connect(`${process.env.MONGO_URI}/${DB_NAME}`);

        connection.isConnected=connectionInstance.connections[0].readyState;

        console.log("DB connected")
    } catch (error) {
        console.log("ERR: error while connecting",error)
    }
}

export default connectToDB;