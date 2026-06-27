import app from "./app.js"
import dotenv from "dotenv"
import connectMongo from "./config/db.js"

dotenv.config()

const port=process.env.PORT || 8080

app.get("/",(req,res)=>{
    res.send({msg:"sistema de autenticacion"})
})

connectMongo()

app.listen(port,()=>{
    console.log("servidor corriendo en el "+ port)
})