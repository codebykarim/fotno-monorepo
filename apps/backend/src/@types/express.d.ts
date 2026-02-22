declare namespace Express {
  export interface Request {
    user?: {
      id: string;
      role?: string;
    };
    toCache: boolean;
    privateCache: boolean;
  }
}
