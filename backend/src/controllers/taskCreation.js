import { PrismaClient } from "@prisma/client";
import { validateTaskInput } from "../types.js";
import { Connection } from '@solana/web3.js';

const prismaClient = new PrismaClient();
const connection = new Connection('https://api.devnet.solana.com');

export const createTask = async (req, res) => {
    try {
        const parsedData = validateTaskInput.safeParse(req.body);
        if (!parsedData.success) {
            return res.status(400).json({ message: "your data is invalid" });
        }

        const user = req.userId;
        const existingUser = await prismaClient.user.findUnique({ where: { id: user } });
        if (!existingUser) {
            throw new Error("User does not exist");
        }

        // ✅ Verify payment signature
        const { txSignature } = req.body;
        if (!txSignature) {
            return res.status(400).json({ message: "Transaction signature missing" });
        }

        const expectedReceiver = 'FnKXkBN7MtL5fgMQBn23muDCihDb2X5Mfm77HbS3XEnB';
        const solAmount = parsedData.data.amount * 0.000047;
        const lamportsExpected = Math.floor(solAmount * 1e9);

        // Queries RPC for tx details.
        // RPC nodes index blocks; this deserializes tx, parses instructions (e.g., identifies SystemProgram transfer).
        const tx = await connection.getParsedTransaction(txSignature, {
            commitment: 'confirmed',
        });
        if (!tx) {
            return res.status(400).json({ message: "Transaction not found on Solana devnet" });
        }

        const transferIx = tx.transaction.message.instructions.find(
            (ix) => ix.program === 'system'
        );
        if (!transferIx || transferIx.parsed.info.destination !== expectedReceiver) {
            return res.status(400).json({ message: "Transaction does not pay correct recipient" });
        }
        if (transferIx.parsed.info.lamports < lamportsExpected) {
            return res.status(400).json({ message: "Transaction paid less than required" });
        }

        // if payment verified ✅ — create task
        let response = await prismaClient.$transaction(async txn => {
            const newTask = await txn.task.create({
                data: {
                    title: parsedData.data.title,
                    amount: parsedData.data.amount,
                    user_id: user,
                    signature: txSignature
                }
            });

            await txn.option.createMany({
                data: parsedData.data.options.map(x => ({
                    image_url: x.imageUrl,
                    task_id: newTask.id
                }))
            });

            return newTask;
        });

        return res.status(201).json({ message: "Task created successfully", task: response });
    } catch (error) {
        console.log("error in task creation controller: " + error.message);
        return res.status(400).json({ message: error.message });
    }
};
