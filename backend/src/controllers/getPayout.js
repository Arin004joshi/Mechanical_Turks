import { PrismaClient } from "@prisma/client";
const prismaClient = new PrismaClient();

export const getPayout = async (req, res) => {
    try {
        const { amountToPayout } = req.body;
        const userId = req.userId;

        // All logic inside one transaction
        const result = await prismaClient.$transaction(async (tx) => {
            // get the labeller row FOR UPDATE (to ensure no race)
            const labeller = await tx.labeller.findUnique({
                where: { id: userId },
            });

            if (!labeller) {
                throw new Error("Labeller not found");
            }

            if (amountToPayout <= 0) {
                throw new Error("Invalid amount");
            }

            if (labeller.pending_amount < amountToPayout) {
                throw new Error("Not enough pending amount to payout");
            }

            // update the locked and pending amounts
            const updatedLabeller = await tx.labeller.update({
                where: { id: userId },
                data: {
                    pending_amount: {
                        decrement: amountToPayout,
                    },
                    locked_amount: {
                        increment: amountToPayout,
                    },
                },
            });

            // create payout record
            const txnId = "0x238435185"; // replace with actual txn hash
            const payoutRecord = await tx.payouts.create({
                data: {
                    user_id: userId,
                    amount: amountToPayout,
                    status: "Processing",
                    signature: txnId,
                },
            });

            return {
                updatedLabeller,
                payoutRecord,
            };
        });

        res.json({
            message: "processing payout",
            pending_amount: result.updatedLabeller.pending_amount,
            locked_amount: result.updatedLabeller.locked_amount,
            payout: result.payoutRecord,
        });
    } catch (error) {
        console.error("Error in payout controller:", error.message);
        res.status(400).json({ message: error.message });
    }
};
