const express=require('express');
const dotenv=require('dotenv');
const cors=require('cors');

const app=express();
dotenv.config();

app.use(cors());

app.listen(process.env.PORT,()=>{
    console.log(`Your server is running ${process.env.PORT}`)
})