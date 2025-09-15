import { PrismaClient } from "@prisma/client";
const prismaClient = new PrismaClient();

export const getNextTask = async (req, res) => {
    const userId = req.userId;
    try {
        const task = await prismaClient.task.findFirst({
            where: {
                done: false,
                submissions: {
                    none: {
                        Labeller_id: userId,
                    }
                },
            },
            select: {
                title: true,
                options: true,
            }
        })
        if (!task) {
            res.status(411).json({ message: "No more task left for you to review" });
        } else {
            res.status(200).json({ task: task });
        }
    } catch (error) {
        res.status(400).json({ message: error.message })
    }
}