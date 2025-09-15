import { PrismaClient } from "@prisma/client";
import { validateSubmissionInput } from "../types.js"
import { int } from "zod";
const prismaClient = new PrismaClient();

const TOTAL_SUBMISSIONS = 100;
const TOTAL_DECIMALS = 1000_000_000;

export const getSubmissions = async (req, res) => {
    const userId = req.userId;
    const body = req.body;
    const parsedInput = validateSubmissionInput.safeParse(body);
    try {
        if (parsedInput.success) {
            let task = await prismaClient.task.findFirst({
                where: {
                    done: false,
                    submissions: {
                        none: {
                            Labeller_id: userId,
                        }
                    },
                },
                select: {
                    id: true,
                    amount: true,
                    title: true,
                    options: true,
                    done: true
                }
            });
            if (!task) {
                return res.status(404).json({ message: "Task not found" });
            }
            if (task.done) {
                return res.status(400).json({ message: "Task already completed" });
            }
            else {
                // assume user chooses ONE option (sent in request body)
                const chosenOptionId = body.optionId;
                const amount = task.amount / TOTAL_SUBMISSIONS

                // now create new submission
                const newSubmission = await prismaClient.submission.create({
                    data: {
                        task: {
                            connect: { id: task.id }
                        },
                        Labeller: {
                            connect: { id: userId }
                        },
                        option: {
                            connect: { id: chosenOptionId }
                        },
                        amount: amount
                    }
                })

                // update task.done in DB
                await prismaClient.task.update({
                    where: { id: task.id },
                    data: {
                        done: true,
                    }
                });

                await prismaClient.labeller.update({
                    where: { id: userId },
                    data: {
                        pending_amount: {
                            increment: Math.floor(amount * TOTAL_DECIMALS)
                        },
                    }
                });
                console.log("Updating labeller:", userId, "by amount:", amount);

                let nextTask = await prismaClient.task.findFirst({
                    where: {
                        done: false,
                        submissions: {
                            none: {
                                Labeller_id: userId,
                            }
                        },
                    },
                    select: {
                        id: true,
                        amount: true,
                        title: true,
                        options: true,
                        done: true
                    }
                });

                if (newSubmission) {
                    res.status(200).json({ nextTask: nextTask })
                }
            }
        } else {
            res.status(400).json({ message: "validation failed for your input" })
        }
    } catch (error) {
        res.status(400).json({ message: error.message })
    }
}