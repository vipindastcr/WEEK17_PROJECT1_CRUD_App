import mongoose from "mongoose";

const EmployeeSchema =new mongoose.Schema({
    name:{
        type:String,
        required:true
    },
    email:{
        type:String,
        required:true,
        unique:true
    },
    mobile:{
        type:String,
        required:true
    },
    dob:{
        type:Date,
        required:true
    },
    doj:{
        type:Date,
        required:true
    },
    isAdmin: { type: Boolean, required: true, default: false },

},{
    timestamps:true
})

export const EmployeeModel=mongoose.model('Employee',EmployeeSchema);