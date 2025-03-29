const express=require('express');
const bcrypt=require('bcrypt');
const jwt=require('jsonwebtoken');
const User=require('../Models/UserModel');
const nodemailer = require('nodemailer');
require('dotenv').config();

const UserRouter=express.Router();
const secret=process.env.JWT;

const transporter = nodemailer.createTransport({
    service: 'gmail',  
    auth: {
        user: process.env.MAIL,
        pass: process.env.PASS 
    }
});
UserRouter.get("/",async(req,res)=>{
    const user=await User.find({})
    res.json(user)
})
UserRouter.post('/register', async (req, res) => {
    try {
        const { Username, Email, Password, Gender, Contact } = req.body;
        const existingUser = await User.findOne({ Email });
        if (existingUser) {
            return res.status(400).json({ message: "Email already exists" });
        }
        const hashedPassword = await bcrypt.hash(Password, 10);
        const newUser = new User({
            Username,
            Email,
            Password: hashedPassword,
            Gender,
            Contact
        });
        await newUser.save();
        const token = jwt.sign({ id: newUser._id, Email },secret, { expiresIn: '1h' });

        const mailOptions = {
            from: '"Hospo Support" <' + process.env.EMAIL_USER + '>',
            to: Email,
            subject: "🎉 Welcome to Hospo - Your Health Companion!",
            html: `
                <div style="font-family: Arial, sans-serif; max-width: 600px; margin: auto; padding: 20px; border: 1px solid #ddd; border-radius: 10px; box-shadow: 2px 2px 10px rgba(0, 0, 0, 0.1);">
                    <h2 style="color: #4CAF50; text-align: center;">🌿 Welcome to Hospo, ${Username}! 🎉</h2>
                    <p style="color: #333; font-size: 16px;">
                        We're thrilled to have you as part of our <b>Hospo</b> community. Your journey towards a seamless and efficient healthcare experience starts now!
                    </p>
                    <p style="color: #333; font-size: 16px;">
                        With **Hospo**, you can:
                        <ul>
                            <li>✔️ Book Appointments with top doctors</li>
                            <li>✔️ Manage your medical records effortlessly</li>
                            <li>✔️ Receive real-time updates on your appointments</li>
                        </ul>
                    </p>
                    <div style="text-align: center; margin: 20px 0;">
                        <a href="https://hospo.com/login" style="background-color: #4CAF50; color: white; padding: 12px 20px; border-radius: 5px; text-decoration: none; font-size: 18px; font-weight: bold;">Get Started Now</a>
                    </div>
                    <p style="color: #555; font-size: 14px; text-align: center;">
                        If you have any questions, feel free to reach out to our support team. We're here to help! 💚
                    </p>
                    <hr style="border: none; border-top: 1px solid #ddd;">
                    <p style="text-align: center; font-size: 12px; color: #777;">
                        © 2025 Hospo, Inc. | All Rights Reserved.
                    </p>
                </div>
            `,
        };

        transporter.sendMail(mailOptions, (err, info) => {
            if (err) {
                console.log("Error sending email:", err);
            } else {
                console.log("Email sent: " + info.response);
            }
        });

        res.status(201).json({ message: "User registered successfully", token });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

UserRouter.post('/login', async (req, res) => {
    try {
        const { Email, Password } = req.body;
        const user = await User.findOne({ Email });
        if (!user) {
            return res.status(400).json({ message: "Invalid email or password" });
        }
        const isMatch = await bcrypt.compare(Password, user.Password);
        if (!isMatch) {
            return res.status(400).json({ message: "Invalid email or password" });
        }
        const token = jwt.sign({ id: user._id, Email },secret, { expiresIn: '1h' });

        res.status(200).json({ message: "Login successful", token });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

module.exports=UserRouter;