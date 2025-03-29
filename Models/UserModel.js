const mongoose=require('mongoose');

const UserSchema=mongoose.Schema({
    Username : String,
    Email : {type: String, match: [/.+\@.+\..+/, "Please fill a valid email address"], unique: true},
    Password : {type : String, minlength: [5, "Password should be at least 5 characters long"] },
    Gender : {type : String, enum: ['male', 'female', 'other']},
    Contact : {type : String,unique : true}
});

const User = mongoose.model('User', UserSchema);
module.exports=User;