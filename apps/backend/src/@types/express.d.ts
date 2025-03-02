import { User } from "better-auth/types";

declare namespace Express {
  export interface Request {
    user: User;
    toCache: boolean;
    privateCache: boolean;
  }
}
