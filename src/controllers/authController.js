import User from "../models/user.js"
import bcrypt from "bcrypt"
import jwt from "jsonwebtoken"

export const register= async (req,res)=>{
try{
const {name,email,password}=req.body
    if(!name || !email ||!password){
      return  res.status(400).json({
    message: "todos los campos son obligatorios"
})
    }

    const existUser= await User.findOne({email})
    if (existUser) {
   return res.status(400).json({msg:"el email ya esta registrado"})
}
const hashedPassword = await bcrypt.hash(password, 10)
const user = new User({
    name,
    email,
    password: hashedPassword
})
await user.save()
return res.status(201).json({
    msg: "Usuario registrado correctamente"
})

}
catch(error){
       return res.status(500).json({
        msg: "Error interno del servidor"
    })
}

}


export const login=async (req,res)=>{
try{
      const {email,password}=req.body
    if(!email || !password){
        return  res.status(400).json({msg:"email y password son obligatorios"})
    }
    const user=await User.findOne({email})
    if(!user){
         return res.status(401).json({msg:"usuario o contrasñas incorrectas"})
    }
    const isMatch = await bcrypt.compare(password,user.password)
    if(!isMatch){
        return res.status(401).json({msg:"usuario o contraseñas incorrectas"})
    }


   const token = jwt.sign(
    {
        userId: user._id,
        role: user.role
    },
    process.env.JWT_SECRET,
    {
        expiresIn: "1h"
    }
)


res.cookie("authToken", token, {
    httpOnly: true,
    sameSite: "Lax",
    secure: process.env.NODE_ENV === "production"
})

req.session.user = {
    userId: user._id,
    role: user.role
}

return res.status(200).json({msg:"login exitoso",token})

}
catch(error){
return res.status(500).json({
        msg: "Error interno del servidor",error
    })
}


}



export const profile=(req,res)=>{
return res.status(200).json({
        msg: "perfil obtenido correctamente",
        user: req.user
    })
}


export const admin = (req,res) => {
    return res.status(200).json({
        msg: "Bienvenido administrador",
        user: req.user
    })
}


export const logout = (req, res) => {
    res.clearCookie("authToken")
     return res.status(200).json({
        msg: "Logout exitoso"
    })

}


export const session = (req, res) => {
    return res.status(200).json({
        msg: "Sesión obtenida correctamente",
        session: req.session
    })
}