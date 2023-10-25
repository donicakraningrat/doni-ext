import { Request, Response } from 'express';
import jwt from 'jsonwebtoken';

class JwtController {
    async encoded(req: Request, res: Response) {
        try {
            const jwtInfo = req.body;
            const token = jwt.sign(jwtInfo.payload, jwtInfo.secretKey, { algorithm: jwtInfo.alg, noTimestamp: true });
            res.json({ token });
        } catch (error) {
            console.log(error);
        }
    }
    async decoded(req: Request, res: Response) {
        try {
            const jwtInfo = req.body
            const decode = jwt.verify(jwtInfo.token, jwtInfo.secretKey);
            res.json(decode);
        } catch (error) {
            console.log(error);
        }
    }
}

export const jwtController = new JwtController();