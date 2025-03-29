const express=require('express');
const dotenv=require('dotenv');
const cors=require('cors');
const mongoose=require('mongoose');

const app=express();
dotenv.config();

app.use(cors());

function DatabaseConnection(){
mongoose.connect(process.env.DATABASE)
.then(()=>{
    console.log("Your database is connected successfully!!")
})
.catch((err)=>{
  console.log("There is a error in database connection",err)
})
}

app.listen(process.env.PORT,()=>{
    DatabaseConnection()
    console.log(`Your server is running ${process.env.PORT}`)
})