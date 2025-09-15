import { generateTokenforLabellers, generateTokenforUsers } from "../libs/utils.js"
import { PrismaClient } from "@prisma/client"
import { PublicKey } from "@solana/web3.js";
import nacl from "tweetnacl";

const prismaClient = new PrismaClient();

// with public wallet address
export const signInUsers = async (req, res) => {
    try {
        const { publicKey, signature } = req.body;

        if (!publicKey || !signature) {
            return res.status(400).json({ error: "Missing publicKey or signature" });
        }
        // traditional method:
        const existingUser = await prismaClient.user.findFirst({
            where: {
                address: publicKey
            }
        })
        if (existingUser) {
            const token = generateTokenforUsers(existingUser.id, res);
            return res.status(200).json({ token });
        }

        // create a new user
        const newUser = await prismaClient.user.create({
            data: {
                address: publicKey
            }
        })
        const token = generateTokenforUsers(newUser.id, res);
        return res.status(200).json({ token });

        //upsert method:
    } catch (error) {
        console.log("error in user login controller", error.message);
        res.status(400).json(error.message);
    }
}

export const signInLabellers = async (req, res) => {
    try {
        const { publicKey, signature } = req.body;

        if (!publicKey || !signature) {
            return res.status(400).json({ error: "Missing publicKey or signature" });
        }
        // traditional method:
        const existingUser = await prismaClient.labeller.findFirst({
            where: {
                address: publicKey
            }
        })
        if (existingUser) {
            const token = generateTokenforLabellers(existingUser.id, res);
            return res.status(200).json({ token });
        }

        // create a new user
        const newUser = await prismaClient.labeller.create({
            data: {
                address: publicKey,
                pending_amount: 0,
                locked_amount: 0
            }
        })
        const token = generateTokenforLabellers(newUser.id, res);
        return res.status(200).json({ token })

        //upsert method:
    } catch (error) {
        console.log("error in labeller login controller", error.message);
        res.status(400).json(error.message);
    }
}