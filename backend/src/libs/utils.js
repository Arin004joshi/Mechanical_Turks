import jwt from "jsonwebtoken";

export const generateTokenforUsers = (userId, res) => {
    const token = jwt.sign({ userId }, process.env.JWT_SECRET, {
        expiresIn: "7d",
    });

    res.cookie("jwt", token, {
        maxAge: 7 * 24 * 60 * 60 * 1000, // MS
        httpOnly: true, // prevent XSS attacks cross-site scripting attacks
        sameSite: "None", // CSRF attacks cross-site request forgery attacks
        secure: true,
    });

    return token;
};


export const generateTokenforLabellers = (userId, res) => {
    const token = jwt.sign({ userId }, process.env.LABELLER_JWT_SECRET, {
        expiresIn: "7d",
    });    

    res.cookie("labeller_jwt", token, {
        maxAge: 7 * 24 * 60 * 60 * 1000, // MS
        httpOnly: true, // prevent XSS attacks cross-site scripting attacks
        sameSite: "None", // CSRF attacks cross-site request forgery attacks
        secure: true,
    });

    return token;
};