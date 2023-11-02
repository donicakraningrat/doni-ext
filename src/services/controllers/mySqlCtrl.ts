import { Request, Response } from 'express';
// import { mySql } from './MySql';
import mysql from 'mysql2';

class MySqlCtrl {
    async query(req: Request, res: Response) {
        if (!req.body.dbConfig) {
            res.json({ err_msg: "please set db config" });
            return;
        }if (!req.body.type) {
            res.json({ err_msg: "please set type Is 'query' or 'execute'" });
            return;
        } if (!req.body.query) {
            res.json({ err_msg: "No query or script" });
            return;
        }
        let dbConfig = req.body.dbConfig
        // let dbConfig = {
        //     host: process.env.MYSQL_HOST||"",
        //     user: process.env.MYSQL_USER||"",
        //     password: process.env.MYSQL_PASSWORD||"",
        //     port: parseInt(process.env.MYSQL_PORT||"0"),
        //     connectTimeout: parseInt(process.env.MYSQL_CONNECTTIMEOUT||"0"),
        // };
        try {
            let connection = mysql.createConnection(dbConfig);
            if (req.body.type === "query" || req.body.type==='q' )
                connection?.query(req.body.query,req.body.params || [], (err, result) => {
                    if (!err) {
                        res.json(result);
                    }
                });
            if (req.body.type === "execute" || req.body.type==='exec' )
                connection?.execute(req.body.query,req.body.params || [], (err, result) => {
                    if (!err) {
                        res.json(result);
                    }
                });
            connection?.end();
        } catch (error) {
            res.json({ err_msg: JSON.stringify(error) });
        }
    }
}

export const mySqlCtrl = new MySqlCtrl();