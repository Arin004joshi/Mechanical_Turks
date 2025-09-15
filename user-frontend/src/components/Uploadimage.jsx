import React, { useState } from "react";
import { BACKEND_URL } from "../utils/index.js";
import SubmitTask from '../components/SubmitTask.jsx'


const Uploadimage = () => {
    const [preview, setPreview] = useState([]); // preview the uploaded images
    const [uploaded, setUploaded] = useState([]); // display the signedUrls
    const [isUploading, setIsUploading] = useState(false); // for the loading state

    const handleUpload = async (files) => {
        setIsUploading(true);
        const formData = new FormData();
        for (const file of files) {
            formData.append("files", file); // must match multer field name
        }

        const token = localStorage.getItem("token");
        console.log(token);
        const res = await fetch(`${BACKEND_URL}/api/user/generatepresignedurl`, {
            method: "POST",
            headers: {
                Authorization: `Bearer ${token}`
            },
            body: formData, // don't set Content-Type manually
        });

        const data = await res.json();
        console.log(data);
        setIsUploading(false);

        if (data.files) {
            setUploaded((prev) => [...prev, ...data.files.map((f) => f.url)]);
        } else {
            console.error("Upload error:", data);
        }
    };

    const handleFileChange = async (e) => {
        const files = Array.from(e.target.files);
        const urls = files.map((file) => URL.createObjectURL(file));
        setPreview((prev) => [...prev, ...urls]);

        await handleUpload(files);
    };

    return (
        <div className="flex flex-wrap gap-4 justify-center">
            {/* Render all previews */}
            {preview.map((src, index) => (
                <div
                    key={index}
                    className="w-40 h-40 rounded border overflow-hidden flex items-center justify-center"
                >
                    <img
                        src={src}
                        alt={`preview-${index}`}
                        className="w-full h-full object-cover"
                    />
                </div>
            ))}

            {/* Upload button */}
            <div className="w-40 h-40 rounded border flex items-center justify-center">
                <label
                    htmlFor="fileUpload"
                    className="h-full w-full flex items-center justify-center bg-red-100 text-4xl cursor-pointer"
                >
                    {isUploading ? "Loading..." : <input
                        id="fileUpload"
                        type="file"
                        accept="image/*"
                        multiple
                        className="hidden"
                        onChange={handleFileChange}
                    />}
                </label>
            </div>

            {/* Show uploaded URLs */}
            <div className="w-40 h-40 mt-4 text-sm">
                {uploaded.map((url, i) => (
                    <a
                        key={i}
                        href={url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-blue-600 underline block"
                    >
                        {url}
                    </a>
                ))}
            </div>
            <SubmitTask uploaded={uploaded} />
        </div>
    );
};

export default Uploadimage;
