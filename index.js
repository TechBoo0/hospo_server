const express=require('express');
const dotenv=require('dotenv');
const cors=require('cors');
const mongoose=require('mongoose');
const UserRouter=require('./Routes/UserRoutes');
const medcard=require("./Routes/medcards")

const app=express();
dotenv.config();

app.use(cors());
app.use(express.json());
app.use("/user",UserRouter);
app.use("/medcard",medcard)

function DatabaseConnection(){
mongoose.connect(process.env.DATABASE)
.then(()=>{
    console.log("Your database is connected successfully!!")
})
.catch((err)=>{
  console.log("There is a error in database connection",err)
})
}

app.listen(process.env.PORT,async()=>{
    await DatabaseConnection()
    console.log(`Your server is running ${process.env.PORT}`)
})