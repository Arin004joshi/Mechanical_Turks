import jwt from "jsonwebtoken"

export const labellerMiddleware = async (req, res, next) => {
    try {
        let token;
        if (
            req.headers.authorization &&
            req.headers.authorization.startsWith("Bearer ")
        ) {
            token = req.headers.authorization.split(" ")[1];
        }

        // If no token yet, you could still check cookies
        if (!token && req.cookies?.jwt) {
            token = req.cookies.jwt;
        }
        if (!token) {
            return res.status(401).json({ message: "Unauthorized - No Token Provided" });
        }
        const decoded = jwt.verify(token, process.env.LABELLER_JWT_SECRET)
        if (!decoded) {
            return res.status(401).json({ message: "Unauthorized - Invalid Token" });
        }
        req.userId = decoded.userId;
        next();
    } catch (error) {
        console.log("error in labeller middleware controller: " + error.message);
        res.status(400).json({ message: error.message });
    }
}