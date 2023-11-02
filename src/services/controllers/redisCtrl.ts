import express, { Router, Request, Response } from 'express';
import Redis from "ioredis";

const router: Router = express.Router();

//get route
router.post("/get", async (req: Request, res: Response) => {
    if (!req.body.host) { res.json({ error: "No Host name" }); return; };
    if (!req.body.key) { res.json({ error: "No redis key" }); return; };
    const key = req.body.key;
    const host = req.body.host;

    const redis = new Redis({
        host: host, //"r-d9j83yzngns5sh5gpf.redis.ap-southeast-5.rds.aliyuncs.com",
        port: 6379, // Default Redis port
    });
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