import express, { Router, Request, Response } from 'express';
import Redis from "ioredis";

const router: Router = express.Router();

//get route
router.post("/get", async (req: Request, res: Response) => {
    if (!req.body.config) { res.json({ error: "No config name" }); return; };
    if (!req.body.key) { res.json({ error: "No redis key" }); return; };
    const key = req.body.key;
    const config = req.body.config;
    console.log("redis Config:",config);
    
    const redis = new Redis(config);
    redis.get(key)
        .then((value) => {
            if (value !== null) {
                res.json({value:value});
                console.log(`Value for key "${key}": ${value}`);
            } else {
                res.json({error:`Key "${key}" not found in Redis`});
                console.log(`Key "${key}" not found in Redis`);
            }
        })
        .catch((error) => {
            res.json({error: 'Error getting value from Redis:'});
            console.error('Error getting value from Redis:', error);
        })
        .finally(() => {
            redis.quit(); // 
            console.log("Close the Redis connection");
        });
});

export default router;