import mongoose from "mongoose"



const mongoUrl=process.env.MONGO_URI


 async function connectMongo(){
    try{
        const mongoUrl = process.env.MONGO_URI
        await mongoose.connect(mongoUrl)
        console.log("conectado a la base de datos")

    }
    catch(error) {

        console.log("error al concetar a la base de datos",error)
    }

  }

  export default connectMongo