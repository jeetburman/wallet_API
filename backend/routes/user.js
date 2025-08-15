import express from 'express';
import zod from 'zod';
import { User, Account } from '../Db.js';
import jwt from 'jsonwebtoken';
import JWT_SECRET from '../config.js';
import authMiddleware from '../middleware.js';


const userRouter = express.Router();


const signupSchema = zod.object({
    userName : zod.string(),
    firstName : zod.string(),
    lastName : zod.string(),
    password : zod.string()
})

// userRouter.get('/',(req,res)=>{
//     res.json({
//         msg : "User Router works"
//     })
// })

userRouter.post('/signup',async (req,res)=>{
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
        password : req.body.password,
        firstName : req.body.firstName,
        lastName : req.body.lastName,
    })
    const userId = user._id;

    const token = jwt.sign({userId},JWT_SECRET);
    const bankBalance = await Account.create({
        userId,
        balance: Math.floor(1 + Math.random() * 10000)
    })
    res.json({
        msg : "User created successfully",
        token : token,
        balance : `Your random balance is : Rs.${bankBalance.balance}`
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


const updateSchema = zod.object({
    firstName : zod.string().optional(),
    lastName : zod.string().optional(),
    password : zod.string().optional()
})

userRouter.put('/',authMiddleware,async (req,res)=>{
    const {success} = updateSchema.safeParse(req.body);
    if(!success){
        return res.status(411).json({
            msg : 'Input error'
        })
    }

    const {firstName , lastName , password} = req.body;
    const updateValues = {};

    if(firstName) updateValues.firstName = firstName;
    if(lastName) updateValues.lastName = lastName;
    if(password) updateValues.password = password;

    try{
        await User.updateOne({_id : req.userId},req.body)
    }catch(e){
        return res.json({
            msg : 'Some problem while updating'
        })
    }
    return res.status(200).json({
        msg : 'Details updated successfully!'
    })
})


userRouter.get('/bulk',authMiddleware,async (req,res)=>{
    const filter = req.query.filter || "";

    const users = await User.find({
        $or: [{
            firstName: {
                "$regex": filter
            }
        }, {
            lastName: {
                "$regex": filter
            }
        }]
    })

    res.json({
        user: users.map(user => ({
            username: user.userName,
            firstName: user.firstName,
            lastName: user.lastName,
            _id: user._id
        }))
    })
})


export default userRouter;