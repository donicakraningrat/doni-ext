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

router.post("/keys", async (req: Request, res: Response) => {
    if (!req.body.config) { res.json({ error: "No config name" }); return; };
    if (!req.body.key) { res.json({ error: "No redis key" }); return; };
    const key = req.body.key;
    const config = req.body.config;
    console.log("redis Config:",config);
    
    const redis = new Redis(config);
    redis.keys(key)
        .then((value) => {
            if (value !== null) {
                res.json({value:value});
                console.log(`Keys for regex "${key}": ${value}`);
            } else {
                res.json({error:`Key regex "${key}" not found in Redis`});
                console.log(`Key regex "${key}" not found in Redis`);
            }
        })
        .catch((error) => {
            res.json({error: 'Error getting keys from Redis:'});
            console.error('Error getting keys from Redis:', error);
        })
        .finally(() => {
            redis.quit(); // 
            console.log("Close the Redis connection");
        });
});
router.delete("/delete", async (req: Request, res: Response) => {
    if (!req.body.config) { res.json({ error: "No config name" }); return; };
    if (!req.body.key) { res.json({ error: "No redis key" }); return; };
    const key = req.body.key;
    const config = req.body.config;
    console.log("redis Config:",config);
    
    const redis = new Redis(config);
    redis.del(key)
        .then((value) => {
            if (value !== null) {
                res.json({value:value});
                console.log(`Delete key "${key}": ${value}`);
            } else {
                res.json({error:`Delete key "${key}" not found in Redis`});
                console.log(`Delete key "${key}" not found in Redis`);
            }
        })
        .catch((error) => {
            res.json({error: 'Error getting keys from Redis:'});
            console.error('Error getting keys from Redis:', error);
        })
        .finally(() => {
            redis.quit(); // 
            console.log("Close the Redis connection");
        });
});
export default router;