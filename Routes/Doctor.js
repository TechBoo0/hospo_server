const Doctor=require("../Models/Doctor")
const express=require("express")
const route=express.Router()
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

