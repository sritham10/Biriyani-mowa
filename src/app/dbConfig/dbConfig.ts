import mongoose from "mongoose"

export async function connect(){
    try{
        mongoose.connect(process.env.MONGO_URI!)
        const connection = mongoose.connection;

        connection.on('connected', () => {
            console.log('MongoDB Connected !');
        });
        connection.on('error', (err) => {
            console.log('MongoDB Connection Error. ', err);
        });

    }catch(err: any){
        console.log('Something went wrong!');
        console.log(err.message);
        
    }
}