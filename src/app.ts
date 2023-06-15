import "dotenv/config"
import express, { NextFunction,Request,Response } from  "express"
import noteRouter from "./routes/notesRoutes"
import userRouter from "./routes/userRoutes"
import morgan from "morgan"
import createHttpError ,{isHttpError}from "http-errors"
import session from "express-session"
import env from "./utill/validateEnv"
import MongoStore from "connect-mongo"
import { requireAuth } from "./middleware/auth"
const app=express()

app.use(morgan("dev"))        // to log endpoints 
app.use(express.json());
app.use(session({
    secret:env.SESSION_SECRET,
    resave:false,
    saveUninitialized:false,
    cookie:{
        maxAge:60 * 60 * 1000,
    },
    rolling:true,
    store:MongoStore.create({
        mongoUrl:env.MONGO_CONNECTION_STRING
    })
}))

app.use("/api/users",userRouter);
app.use("/api/notes",requireAuth,noteRouter)

app.use((req, res, next) => {
    next(createHttpError(404,"Endpoint not found"))
})

//Error handling Middleware
// eslint-disable-next-line @typescript-eslint/no-unused-vars
app.use((error:unknown,req:Request,res:Response,next:NextFunction) => { 
    console.error(error)
    let  errormessage="An unknown error occurred"
    let statuscode = 500
    if(isHttpError(error)) 
    {   statuscode = error.status;
        errormessage = error.message;
    }
    res.status(statuscode).json({error:errormessage})

})
 
export default app