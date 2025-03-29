const express=require("express")
const route=express.Router()
const Medcard=require("../Models/Medcard")
const Doctor=require("../Models/Doctor")
const dotenv=require("dotenv").config()
const nodemailer=require("nodemailer")
const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: process.env.MAIL,
        pass: process.env.PASS
    }
});


route.use(express.json())

// ---- GET routes ----

route.get("/",async(req,res)=>{
    const cards=await Medcard.find({})
    res.json(cards)
})

route.get("/doctor/:id",async(req,res)=>{
    const {id}=req.params
    const cards=await Medcard.find({doctorId:id})
    res.json(cards)
})

route.get("/pasient/:id",async(req,res)=>{
    const {id}=req.params
    const cards=await Medcard.find({pasientId:id})
    res.json(cards)
})

// ---- POST ----
route.post("/reg",async(req,res)=>{
    const {doctorId,email}=req.body
    const doctor=await Doctor.findById(doctorId)
    const mailOptions = {
        from: process.env.MAIL,
        to: doctor.email,
        subject: 'New Registration',
        html: `
            <div style="font-family: Arial, sans-serif; padding: 10px; border: 1px solid #ddd; border-radius: 5px;">
                <h3 style="color: #333;">Hey Doc,</h3>
                <p style="font-size: 16px; color: #555;">You have a new booking on <strong style="color: #28a600;">${date}</strong>.</p>
                <p style="font-size: 16px; color: #555;"><strong>Patient Details:</strong></p>
                <ul style="font-size: 16px; color: #555;">
                    <li><strong>Name:</strong> ${name}</li>
                    <li><strong>Email:</strong> ${email}</li>
                    <li><strong>Patient ID:</strong> ${email.split("@")[0]}</li>
                    <li><strong>Phone:</strong> ${phone}</li>
                    <li><strong>Address:</strong> ${address}</li>
                    <li><strong>Registration Type:</strong> ${registrationType}</li>
                    <li><strong>Symptoms:</strong> ${symptoms}</li>
                    <li><strong>Medications:</strong> ${medications}</li>
                </ul>
                <p>And the id:</p><b>${email.split("@")[0]}</b>
                <p style="font-size: 16px; color: #555;">If you'd like to confirm, please use the link below:</p>
            </div>
        `
    };
    try {
        await Medcard.create(req.body);
        const mail = await transporter.sendMail(mailOptions);
        console.log(mail);
        res.status(200).json({ message: 'Email sent successfully',email});
    } catch (error) {
        console.log(error);
        res.status(500).json({ error: 'Failed to send email' });
    }
})

module.exports=route