import { PrismaClient } from "@prisma/client";

const prismaClient = new PrismaClient();

export const getTask = async (req, res) => {
    const user = req.userId;
    try {
        if (!user) {
            return res.status(400).json({ message: "you are not authorized" });
        }
        const myTask = await prismaClient.user.findFirst({
            where: { id: user },
            include: {
                tasks: true
            }
        })
        return res.status(200).json({ myTask })
    } catch (error) {
        console.log("error in gettask controller :" + error.message);
        return res.status(400).json({ message: error.message })
    }
}