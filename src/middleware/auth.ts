import { Request, Response, NextFunction } from "express";
import JWT from "jsonwebtoken";
import dotenv from "dotenv";
import userSchema from "../model/userSchema.js";

dotenv.config();

// interface AuthRequest extends Request {
//   token: string;
//   user: any;
// }

// const authMiddleware = async (
//   req: AuthRequest,
//   res: Response,
//   next: NextFunction
// ): Promise<Response | void> => {
//   const token = req.header("Authorization");
//   if (!token) return res.send({ message: "Token is not provided." });

//   try {
//     const decoded = JWT.verify(token, process.env.SECRET_KEY as string) as {
//       _id: string;
//     };
//     const user = await userSchema.findById(decoded._id);
//     if (!user)
//       return res.send({ message: "User not found, please try again." });

//     req.token = token;
//     req.user = user;

//     next();
//   } catch (error) {
//     return res.status(500).send({
//       success: false,
//       message: "Error while verifying authentication",
//       error: (error as Error).message,
//     });
//   }
// };

interface DecodedToken {
  _id: string;
  // Add any other properties that are included in your token if needed
}

interface AuthRequest extends Request {
  token?: string;
  user?: typeof userSchema.prototype; // Adjust according to your User model
}

const authMiddleware = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction
) => {
  const token = req.header("Authorization");

  if (!token) {
    return res.status(401).send({ message: "Token is not provided." });
  }

  try {
    //* Decode the token
    const decoded = JWT.verify(token, process.env.SECRET_KEY!) as DecodedToken;

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
  } catch (error) {
    console.error("Authentication Error:", (error as Error).message);
    res.status(401).send({
      success: false,
      message: "Error while authentication.",
      error: (error as Error).message,
    });
  }
};

export default authMiddleware;
