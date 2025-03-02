declare namespace Express {
  export interface Request {
    user: {
      id: string;
    };
    toCache: boolean;
    privateCache: boolean;
  }
}
