import { Pool, QueryResult } from 'pg';
import { Request, Response } from "express";
import jwt, { JwtPayload } from "jsonwebtoken";
const config = require('../config.json')


const privateKey = 'private'


class AuthService{
  private pool: Pool;
  constructor(pool: Pool){
    this.pool = pool;
  }

  login = async(user: any, req: Request, res: Response) => {
    
  }

  // 用户登录
  loginUser = async (req: Request, res: Response): Promise<string | null> => {
    const { username, password } = req.body;
    const sql = "SELECT * FROM users WHERE username = $1";
    const result: QueryResult = await this.pool.query(sql, [username]);
    const user = result.rows[0];
    if (!user) {
      res.status(401).json({ message: "用户名不存在" });
      return null;
    }

    if(user.password !== password){
      res.status(401).json({message: "用户名或密码错误"});
      return null;
    } else{
      const token = this.generateToken({username});
      return token;
    }
  }

  verifyToken = (token: string): (JwtPayload | null) => {
    try {
      return jwt.verify(token, privateKey) as JwtPayload;
    } catch (err) {
      return null;
    }
  }

  generateToken = (payload: any): string =>{
    return jwt.sign(payload, privateKey, { expiresIn: "1h" });
  };




  
}

export default AuthService;
