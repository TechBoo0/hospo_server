const mongoose=require("mongoose")
const schema=mongoose.Schema({
    name: { type: String, required: true },
    email: { type: String, required: true },
    phone: { type: String, required: true },
    registrationType: { type: String, enum: ['online', 'offline'], default: 'online' },
    symptoms: { type: [String], default: [] },
    medications: { type: [String], default: [] },
    slot: { type: Date, required: true },
    confirm:{type:Boolean,default:false},
    doctorId: { type: String, required: true },
    type:{type:String,required:true},
    prescription:{type:Array},
    pasientId: { type: String, required: true }
})
const Medcard=mongoose.model("medcard",schema)

module.exports=Medcard
