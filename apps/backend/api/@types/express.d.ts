declare namespace Express {
  export interface Request {
    user: {
      authId: string;
      identitynumber: string;
      id: string;
    };
    toCache: boolean;
    privateCache: boolean;
  }
}
