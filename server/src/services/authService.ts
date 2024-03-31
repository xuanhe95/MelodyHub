import { Pool } from "mysql";
import { Request, Response } from "express";
import jwt, { JwtPayload } from "jsonwebtoken";
const config = require("../config.json");
const privateKey = config.private_key;

class AuthService {
    private db: Pool;
    constructor(db: Pool) {
        this.db = db;
    }

    // 用户登录
    loginUser = async (req: Request, res: Response): Promise<string | null> => {        
        return new Promise((resolve, reject) => {
            const { username, password } = req.body;
            // Change the query syntax to use MySQL's ? placeholder
            const sql = "SELECT * FROM users WHERE username = ?";

            this.db.query(sql, [username], (err, results) => {
                if (err) {
                    console.error('Error fetching user:', err);
                    res.status(500).json({ message: "Internal Server Error" });
                    reject(null);
                    return;
                }

                const user = results[0];
                if (!user) {
                    res.status(401).json({ message: "用户名不存在" });
                    resolve(null);
                    return;
                }

                if (user.password !== password) {
                    res.status(401).json({ message: "用户名或密码错误" });
                    resolve(null);
                } else {
                    const token = this.generateToken({ username });
                    resolve(token);
                }
            });
        });
    }

    // 用户验证
    verifyToken = (token: string): JwtPayload | null => {
        try {
            return jwt.verify(token, privateKey) as JwtPayload;
        } catch (err) {
            return null;
        }
    };
    
    // 生成token
    generateToken = (payload: any): string => {
        return jwt.sign(payload, privateKey, { expiresIn: "1h" });
    };
}

export default AuthService;
