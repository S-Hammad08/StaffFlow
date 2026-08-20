declare global {
  namespace Express {
    interface Request {
      user?: {
        id: string;
        role: "admin";
      };
      validated?: {
        body?: unknown;
        query?: unknown;
        params?: unknown;
      };
    }
  }
}

export {};
