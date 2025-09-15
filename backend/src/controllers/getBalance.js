import { PrismaClient } from "@prisma/client";
const prismaClient = new PrismaClient();

export const getBalance = async (req, res) => {
    const userId = req.userId;
    try {
        const labeller = await prismaClient.labeller.findFirst({
            where: {
                id: userId,
            }
        })
        res.status(200).json({
            pending: labeller.pending_amount,
            payoutAmount: labeller.locked_amount,
        })
    } catch (error) {
        console.log("error in getPayment controler : " + error.message);
        res.status(400).json({ message: error.message })
    }
}