import { InferSchemaType, Schema ,model} from "mongoose";

const userSchema=new Schema({
    username:{type:String, required:true,unique:true},
    email:{type:String, required:true,unique:true,Select:false},
    password:{type:String, required:true, Select:false}
})

type User=InferSchemaType<typeof userSchema>;
export default model<User>("User", userSchema);