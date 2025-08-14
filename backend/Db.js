import mongoose from 'mongoose';

try{
    mongoose.connect("mongodb://localhost:27017/paytm-backend-db")
    console.log("Connected to DB");
}catch(e){
    console.log("Error Connecting",e);
}

const userSchema = new mongoose.Schema({
    userName : {
        type : String,
        required : true,
        unique : true,
        minLength : 5,
        maxLength : 20
    },
    firstName : {
        type : String,
        required : true,
        minLength : 5,
        maxLength : 20
    },
    lastName : {
        type : String,
        required : true,
        unique : true,
        minLength : 5,
        maxLength : 20
    },
    password : {
        type : String,
        required : true,
        minLength : 5,
        maxLength : 20
    }
})

const User = mongoose.model('User',userSchema);


export default User
