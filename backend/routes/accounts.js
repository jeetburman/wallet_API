import express from 'express';
import authMiddleware from '../middleware.js';
import { Account } from '../Db.js';
import mongoose from 'mongoose';

const accountRouter = express.Router();

accountRouter.get('/balance',authMiddleware,async (req,res)=>{
    try{
        const account = await Account.findOne({
        userId: req.userId
    });
    res.json({
        balance: account.balance
    })
    }catch(e){
        return res.status(400).json({
            msg : 'Bad Request'
        })
    }
})

accountRouter.post("/transfer", authMiddleware, async (req, res) => {
    try {
        const { amount, to } = req.body;

        // Validate inputs
        if (!amount || amount <= 0) {
            return res.status(400).json({ message: "Invalid transfer amount" });
        }

        // Fetch sender's account
        const account = await Account.findOne({ userId: req.userId });

        if (!account || account.balance < amount) {
            return res.status(400).json({
                message: "Insufficient balance"
            });
        }

        // Fetch receiver's account
        const toAccount = await Account.findOne({ userId: to });

        if (!toAccount) {
            return res.status(400).json({
                message: "Invalid account"
            });
        }

        // Deduct from sender
        await Account.updateOne(
            { userId: req.userId },
            { $inc: { balance: -amount } }
        );

        // Credit receiver
        await Account.updateOne(
            { userId: to },
            { $inc: { balance: amount } }
        );

        res.json({
            message: "Transfer successful"
        });

    } catch (error) {
        console.error(error);
        res.status(500).json({
            message: "Something went wrong"
        });
    }
});


// accountRouter.post("/transfer", authMiddleware, async (req, res) => {
//     const session = await mongoose.startSession();

//     session.startTransaction();
//     const { amount, to } = req.body;

//     // Fetch the accounts within the transaction
//     const account = await Account.findOne({ userId: req.userId }).session(session);

//     if (!account || account.balance < amount) {
//         await session.abortTransaction();
//         return res.status(400).json({
//             message: "Insufficient balance"
//         });
//     }

//     const toAccount = await Account.findOne({ userId: to }).session(session);

//     if (!toAccount) {
//         await session.abortTransaction();
//         return res.status(400).json({
//             message: "Invalid account"
//         });
//     }

//     // Perform the transfer
//     await Account.updateOne({ userId: req.userId }, { $inc: { balance: -amount } }).session(session);
//     await Account.updateOne({ userId: to }, { $inc: { balance: amount } }).session(session);

//     // Commit the transaction
//     await session.commitTransaction();
//     res.json({
//         message: "Transfer successful"
//     });
// });


export default accountRouter;