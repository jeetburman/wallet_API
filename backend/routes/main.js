import express from 'express';
import userRouter from './user.js';
import accountRouter from './accounts.js';

const main = express.Router();

main.use('/user',userRouter);
main.use('/account',accountRouter);

main.get('/',(req,res)=>{
    res.json({
        msg : "Server is working"
    })
})


export default main