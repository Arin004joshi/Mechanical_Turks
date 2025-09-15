import cloudinary from "../libs/cloudinary.js";

export const generatePreSignedUrl = async (req, res) => {
    if (!req.files || req.files.length === 0) {
        return res.status(400).json({ error: "No files uploaded" });
    }

    const timestamp = Math.round(Date.now() / 1000);

    const signature = cloudinary.utils.api_sign_request(
        { timestamp },
        process.env.CLOUDINARY_API_SECRET
    );

    try {
        const results = [];

        for (const file of req.files) {
            const result = await cloudinary.uploader.upload(file.path, {
                type: "authenticated",
                folder: "datasets",
                resource_type: "auto"
            });

            const signedUrl = cloudinary.url(result.public_id, {
                type: "authenticated",
                sign_url: true,
                secure: true,
                resource_type: "auto",
                expires_at: Math.floor(Date.now() / 1000) + 60 // expires in 1 min
            });

            results.push({
                url: signedUrl,
                public_id: result.public_id,
            });
        }

        res.json({
            message: "Files uploaded successfully",
            timestamp,
            signature,
            apiKey: process.env.CLOUDINARY_API_KEY,
            cloudName: process.env.CLOUDINARY_CLOUD_NAME,
            files: results,
        });
    } catch (err) {
        console.error("error in signUrl controller:", err.message);
        res.status(500).json({ error: err.message });
    }
};
