import { Pool } from "mysql";
import { Request, Response } from "express";
import { User } from "../models/user";

class UserService {
    private db: Pool;
    constructor(db: Pool) {
        this.db = db;
    }

    // 用户注册
    async registerUser(req: Request, res: Response): Promise<boolean> {
        return new Promise<boolean>((resolve, reject) => {
            const currentDate = new Date();
            const now = currentDate.toISOString();
            const { username, password } = req.body;
            const sql =
                "INSERT INTO users (username, password, created_at, last_login_at) VALUES (?, ?, ?, ?)";
            this.db.query(sql, [username, password, now, now], (error, results) => {
                if (error) {
                    console.error(error);
                    reject(false);
                    return;
                }
                resolve(true);
            })
        
        })
    }

    // 获取用户信息
    async getUserById(req: Request, res: Response): Promise<User | null> {
        return new Promise<User | null>((resolve, reject) => {
            const id: number = parseInt(req.params.id, 10);
            const sql = "SELECT * FROM users WHERE id = ?";
            this.db.query(sql, [id], (error, results) => {
                if (error) {
                    console.error(error);
                    res.status(500).json({ message: "Internal Server Error" });
                    reject(null);
                    return;
                }

                if (results.length === 0) {
                    resolve(null);
                } else {
                    const user = results[0];
                    const userObj: User = {
                        id: user.id,
                        username: user.username,
                        password: user.password,
                        created_at: user.created_at,
                        last_login_at: user.last_login_at,
                    };
                    resolve(userObj);
                }
            })
        
        })
    }

    // 通过用户名获取用户信息
    async getUserByName(req: Request, res: Response): Promise<User | null> {
        return new Promise((resolve, reject) => {
            const sql = "SELECT * FROM users WHERE username = ?";
            const name: string = req.params.name;

        this.db.query(sql, [name], (err, results) => {
            if (err) {
                console.error(err);
                res.status(500).json({ message: "Internal Server Error" });
                reject(null);
            } else if (results.length === 0) {
                resolve(null);
            } else {
                const user = results[0];
                const userObj: User = {
                    id: user.id,
                    username: user.username,
                    password: user.password,
                    created_at: user.created_at,
                    last_login_at: user.last_login_at,
                };
                resolve(userObj);
            }
            });
        });
    }
}

export default UserService;
