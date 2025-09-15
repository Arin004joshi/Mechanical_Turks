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

        const response = await fetch(`${BACKEND_URL}/api/labeller/signinlabellers`, {
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
        <header className="fixed top-0 left-0 right-0 bg-white shadow-md z-50 h-16 flex items-center justify-between px-6">
            <span className="text-2xl font-bold text-gray-800">MECHANICAL TURKS (for labellers) </span>
            <WalletMultiButton className="!bg-purple-600 !text-white !rounded-md !h-10 !inline-flex !items-center" />
        </header>   
    );
};

export default Appbar;
