import { Pool, QueryResult } from 'pg';
import { Request, Response } from "express";
import jwt from "jsonwebtoken";
const config = require('../config.json')


const privateKey = config.privateKey;


class AuthService{
  private pool: Pool;
  constructor(pool: Pool){
    this.pool = pool;
  }

  // 用户登录
  loginUser = (req: Request, res: Response) => {
    const { username, password } = req.body;
    if (username === "admin" && password === "admin") {
      const token = this.generateToken({ username });
      res.json({ token });
    } else {
      res.status(401).json({ message: "用户名或密码错误" });
    }
  }

  generateToken = (payload: any): string =>{
    return jwt.sign(payload, privateKey, { expiresIn: "1h" });
  };




  
}

export default AuthService;
