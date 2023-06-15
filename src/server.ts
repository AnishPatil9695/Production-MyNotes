import express from "express";
import app from "./app"
import env from "./utill/validateEnv"
import mongoose from "mongoose"
import path from "path";

app.use(express.static(path.join(__dirname, './frontend/build')));
app.get('*',function (req,res){
    res.sendFile(path.join(__dirname, './frontend/build/index.html'));
})

const port=env.PORT;


mongoose.connect(env.MONGO_CONNECTION_STRING) 
.then(() => {
    console.log("Connected to Mongoose Successfully")
    app.listen(port,()=>{
        console.log("Server Running on port " + port); 
        
    })
})
 .catch(console.error)