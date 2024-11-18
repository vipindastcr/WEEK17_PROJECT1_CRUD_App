import express, { Router } from "express";
import mongoose from "mongoose";
import router from "./routes"
import path from 'path';
import methodOverride from 'method-override';

const app=express();
app.use(express.json());
app.use(express.urlencoded({ extended: true }))

app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));



app.use(methodOverride('_method'));

app.use("/public", express.static(path.join(__dirname, "/public")))

const MONGO_URL='mongodb://127.0.0.1:27017';
mongoose.connect(MONGO_URL,{
    dbName:"node-typescript-app",
}).then(()=>{
    console.log("Database Connected");
    
}).catch((error)=>console.log(error));

app.use("/",router);

app.listen(2002,()=>{
    console.log('server running on http://localhost:2002');
    
})