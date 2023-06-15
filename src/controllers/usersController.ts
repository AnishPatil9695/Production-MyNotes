import { RequestHandler } from "express";
import userModel from "../models/user"
import createHttpError from "http-errors";
import bcrypt from "bcrypt"

interface SignUpBody{
    username?: string;
    email?: string;
    password: string;

}


export const getAuthenticatedUser:RequestHandler=async(req,res,next)=>{
   
    try {
       
        const user = await userModel.findById(req.session.userId).select("+email").exec()
        res.status(200).json(user)
    } catch (error) {
        next(error);
    }
}

export const signUp:RequestHandler<unknown,unknown,SignUpBody,unknown> = async(req,res,next)=>{
    const username=req.body.username;
    const email=req.body.email;
    const passwordRaw=req.body.password;
    try {
     
        if(!username || !email || !passwordRaw){
           throw createHttpError(400,"Paremeters missing")
        }
        const existingUser=await userModel.findOne({username:username}).exec();
        if(existingUser){throw createHttpError(409,"User already exists")}
        const existingEmail=await userModel.findOne({email:email}).exec();
        if(existingEmail){throw createHttpError("Email already exists")}

        const passwordHash=await bcrypt.hash(passwordRaw,10)
        console.log(userModel,email,passwordHash)
        const newUser=await userModel.create({
            username: username,
            email: email,
            password: passwordHash
        })
       
        // req.session.userId=newUser._id
        res.status(201).json(newUser)

    } catch (error) {
        next(error);
    }
}

interface loginBody{
    username:string,
    password:string
}

export const login:RequestHandler<unknown,unknown,loginBody,unknown>=async(req, res, next) => {
   const username=req.body.username
   const password=req.body.password
   try {
    if(!username || !password){
        throw createHttpError(400,"parameters missing")
       }
       const user = await userModel.findOne({username: username}).select("+password +email").exec()
    
       if(!user){
        throw createHttpError(401,"Invalid credentials")
       }
    
       const passwordMatch=await bcrypt.compare(password,user.password);
    
       if(!passwordMatch){
        throw createHttpError(401,"Invalid credentials")
       }
    
       req.session.userId=user.id
       res.status(200).json(user)
   } catch (error) {
    next(error)
   }
};

export const logout:RequestHandler = (req, res, next) => {
    req.session.destroy(
        error=>{
            if(error){
                next(error)
            }
            else{
                res.sendStatus(200)
            }
        }
    )
}