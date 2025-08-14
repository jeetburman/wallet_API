import express from 'express';
import userRouter from './user.js';

const main = express.Router();

main.use('/user',userRouter);

main.get('/',(req,res)=>{
    res.json({
        msg : "Server is working"
    })
})


export default main