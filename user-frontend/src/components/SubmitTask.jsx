import React, { useState } from 'react';
import { BACKEND_URL } from "../utils/index.js";
import { useNavigate } from "react-router-dom";
import { useWallet, useConnection } from "@solana/wallet-adapter-react";
import { Transaction, SystemProgram, PublicKey } from "@solana/web3.js";

const SubmitTask = ({ uploaded }) => {
    const [title, setTitle] = useState("");
    const [amount, setAmount] = useState(0);
    const [processing, setProcessing] = useState(false);
    const navigate = useNavigate();

    const { publicKey, sendTransaction } = useWallet();
    const { connection } = useConnection();

    const RECIPIENT_ADDRESS = "CXkVfZNsKfXJjTg8kmG5MPwgiT5xfNv1HzfAqV7Bp35S";

    const handleSubmit = async () => {
        if (!title.trim()) {
            alert("Please enter a task title.");
            return;
        }

        if (!uploaded || uploaded.length === 0) {
            alert("Please upload at least one image.");
            return;
        }

        if (!publicKey) {
            alert("Please connect your Solana wallet first.");
            return;
        }

        setProcessing(true);

        try {
            const recipientPubkey = new PublicKey(RECIPIENT_ADDRESS);
            const solAmount = amount * 0.000047;
            const lamports = Math.floor(solAmount * 1e9);

            const transaction = new Transaction().add(
                SystemProgram.transfer({
                    fromPubkey: publicKey,
                    toPubkey: recipientPubkey,
                    lamports,
                })
            );

            // getLatestBlockhash("finalized"): Fetches a recent blockhash. Why? To timestamp the tx; if too old, it's rejected to avoid duplicates.
            const { blockhash, lastValidBlockHeight } = await connection.getLatestBlockhash("finalized");
            transaction.recentBlockhash = blockhash;
            transaction.feePayer = publicKey;

            // Send transaction : This triggers the wallet popup (Phantom etc.), asks you to sign, then broadcasts it to the network.
            // cryptographically proves you authorized the payment.
            // it is like signing a cheque
            // Serializes tx.
            // Requests wallet to sign (pops up UI: "Approve this transfer?").
            // Wallet adds signature to tx.signatures array.
            // Broadcasts signed tx to RPC nodes (e.g., 'https://api.devnet.solana.com').
            const signature = await sendTransaction(transaction, connection);
            console.log("Payment sent! Signature:", signature);

            // Ensures the transaction has been finalized (recorded on-chain).
            // The network processes and finalizes it (like depositing the check).
            // Polls RPC until finalized or timeout. Underneath: Checks slot confirmations.
            // In your code: After signing, confirm to ensure it's on-chain before backend call.
            await connection.confirmTransaction(
                { signature, blockhash, lastValidBlockHeight },
                "finalized"
            );

            console.log("Transaction confirmed on chain!");

            // Send task data to backend
            const options = uploaded.map((url) => ({ imageUrl: url }));
            const payload = { title, amount, options, txSignature: signature };

            const res = await fetch(`${BACKEND_URL}/api/user/task`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${localStorage.getItem("token")}`
                },
                body: JSON.stringify(payload),
            });

            const data = await res.json();
            console.log("Task response:", data);

            if (res.ok) {
                alert("Task created successfully!");
                setTitle("");
                setAmount(0);
                navigate(`/task`);
            } else {
                alert(`Failed: ${data.message || "Something went wrong"}`);
            }

        } catch (err) {
            console.error(err);
            alert("Error during payment or task creation. Check console.");
        }

        setProcessing(false);
    };

    return (
        <div className="flex justify-center">
            <div className="max-w-screen-lg w-full">
                <div className="text-2xl text-left pt-20 w-full pl-4">
                    Create a task
                </div>

                <label className="pl-4 block mt-2 text-md font-medium  text-black">Task details</label>

                <input type="text" id="first_name" className="ml-4 mt-1 bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5" placeholder="What is your task?" value={title} onChange={(e) => setTitle(e.target.value)} required />

                <label className="pl-4 block mt-8 text-md font-medium text-black">Add amount</label>

                <div className="flex justify-center">
                    <input
                        type="number"
                        placeholder="Amount"
                        value={amount}
                        onChange={(e) => setAmount(Number(e.target.value))}
                        className="border rounded px-2 py-1 w-64"
                    />

                    <button onClick={handleSubmit} type="button" disabled={processing} className="mt-4 text-white bg-gray-800 hover:bg-gray-900 focus:outline-none focus:ring-4 focus:ring-gray-300 font-medium rounded-full text-sm px-5 py-2.5 me-2 mb-2 dark:bg-gray-800 dark:hover:bg-gray-700 dark:focus:ring-gray-700 dark:border-gray-700">
                        {processing ? "Processing..." : `Pay ${amount} INR or ${amount * 0.000047} SOLS`}
                    </button>
                </div>

            </div>
        </div>
    )
}

export default SubmitTask
