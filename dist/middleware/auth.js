import JWT from "jsonwebtoken";
import dotenv from "dotenv";
import userSchema from "../model/userSchema.js";
dotenv.config();
const authMiddleware = async (req, res, next) => {
    const token = req.header("Authorization");
    if (!token) {
        return res.status(401).send({ message: "Token is not provided." });
    }
    try {
        //* Decode the token
        const decoded = JWT.verify(token, process.env.SECRET_KEY);
        //* Retrieve the user using the decoded ID
        const user = await userSchema.findById(decoded._id);
        if (!user) {
            return res.status(403).send({ message: "User is not found." });
        }
        req.token = token;
        req.user = user;
        if (req.user?.role === "admin") {
            return next();
        }
        next();
    }
    catch (error) {
        console.error("Authentication Error:", error.message);
        res.status(401).send({
            success: false,
            message: "Error while authentication.",
            error: error.message,
        });
    }
};
export default authMiddleware;
