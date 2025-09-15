import z, { object } from "zod"

export const validateTaskInput = z.object({
    options: z.array(z.object({
        imageUrl: z.string()
    })),
    title: z.string().optional(),
    amount: z.number()
})

export const validateSubmissionInput = z.object({
    optionId: z.number(),
    taskId: z.string()
})