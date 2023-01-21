import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import { NotAuthorizeError, BadRequestError } from "../errors";

interface UserPayload {
  id: string;
  username: string;
}

declare global {
  namespace Express {
    interface Request {
      user?: UserPayload;
    }
  }
}

export const requireAuth = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  if (!req.headers.authorization) {
    throw new NotAuthorizeError();
  }

  const [type, token] = req.headers.authorization.split(" ");

  if (type != "Bearer") {
    throw new BadRequestError("Invalid Authorization header");
  }

  try {
    const payload = jwt.verify(token, process.env.JWT_KEY!) as UserPayload;
    req.user = payload;
  } catch (err) {
    throw new NotAuthorizeError();
  }

  next();
};
