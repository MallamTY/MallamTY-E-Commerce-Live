import mongoose from "mongoose";


const connectDB = async(URI: any) => {
    return mongoose.connect(URI)
    .then(() => {
        console.log(`\n  \nConnection to database established ............`);
    })
}

export default connectDB;