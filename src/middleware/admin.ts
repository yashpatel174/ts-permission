import { Request, Response, NextFunction, RequestHandler } from "express";

interface AuthRequest extends Request {
  user?: {
    role: string;
  };
}

const isAdmin = (req: AuthRequest, res: Response, next: NextFunction) => {
  if (req.user?.role === "admin") {
    return next();
  } else {
    return res
      .status(403)
      .send({ message: "Only admin can access this route." });
  }
};

export default isAdmin;
