import { Request, Response, NextFunction } from 'express';

export default function requestLogger(req: Request, res: Response, next: NextFunction) {
    console.log(`[${new Date().toISOString()}] ${req.method} ${req.path}`);
    next();
}