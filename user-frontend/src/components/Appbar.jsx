"use client";
import { WalletMultiButton } from '@solana/wallet-adapter-react-ui';
import { useWallet } from '@solana/wallet-adapter-react';
import { useEffect } from 'react';
import { BACKEND_URL } from "../utils/index.js";

const Appbar = () => {
    const { publicKey, signMessage } = useWallet();

    async function signAndSend() {
        if (!publicKey) return;

        const message = new TextEncoder().encode("Sign into mechanical turks");
        const signature = await signMessage?.(message);

        // send to backend
        const response = await fetch(`${BACKEND_URL}/api/user/signinusers`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                signature,
                publicKey: publicKey.toString()
            })
        });

        const data = await response.json();
        console.log(data);
        localStorage.setItem("token", data.token);
    }

    useEffect(() => {
        signAndSend();
    }, [publicKey]);

    return (
        <div className="flex justify-between border-b pb-2 pt-2">
            <div className="text-2xl pl-4 flex justify-center pt-3">MECHANICAL TURKS</div>
            <div className="text-xl pr-4 pb-2">
                <WalletMultiButton />
            </div>
        </div>
    );
};

export default Appbar;
