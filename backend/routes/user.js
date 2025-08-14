import express from 'express';
import zod from 'zod';
import User from '../Db.js';
import jwt from 'jsonwebtoken';
import JWT_SECRET from '../config.js';


const userRouter = express.Router();


const signupSchema = zod.object({
    userName : zod.string(),
    firstName : zod.string(),
    lastName : zod.string(),
    password : zod.string()
})

userRouter.get('/',(req,res)=>{
    res.json({
        msg : "User Router works"
    })
})

userRouter.post('signup',async (req,res)=>{
    const {success} = signupSchema.safeParse(req.body);
    if(!success){
        return res.status(411).json({
            msg : "Email already exists OR incorrect inputs"
        })
    }
    const existingUser = await User.findOne({
        userName : req.body.userName
    })
    if(existingUser){
        return res.status(411).json({
            msg : "Some problem with the inputs"
        })
    }
    const user = await User.create({
        userName : req.body.userName,
        password : req.body.userName,
        firstName : req.body.userName,
        lastName : req.body.userName,
    })
    const userId = user._id;

    const token = jwt.sign({userId},JWT_SECRET);

    res.json({
        msg : "User created successfully",
        token : token
    })

})

const signinSchema = zod.object({
    userName : zod.string(),
    password : zod.string()
})

userRouter.post('/signin',async (req,res)=>{
    const {success} = signinSchema.safeParse(req.body);
    if(!success){
        return res.status(411).json({
            msg : "Error with the input"
        })
    }
    const user = await User.findOne({
        userName : req.body.userName,
        password : req.body.password
    })
    if(user){
        const userId = user._id;
        const token = jwt.sign({userId},JWT_SECRET);
        return res.json({
            token : token
        })
    }
    return res.status(411).json({
        msg : "Error While logging in"
    })
})


export default userRouter;