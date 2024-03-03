import { Pool, QueryResult } from 'pg';
import { Request, Response } from "express";
import jwt from "jsonwebtoken";
const config = require('../config.json')


const privateKey = config.privateKey;


class UserService{
  private pool: Pool;
  constructor(pool: Pool){
    this.pool = pool;
  }
  
 // 用户注册
 async registerUser(req: Request, res: Response) : Promise<void>{
  try{
    const currentDate = new Date();
    const now = currentDate.toISOString();
    const { username, password } = req.body;
    const sql = "INSERT INTO users (username, password, created_at, last_login_at) VALUES ($1, $2, $3, $4)"
    const result: QueryResult = await this.pool.query(sql, [username, password, now, now]);
    const user = result.rows[0];
    res.json(user);
  } catch(err){
    console.error(err);
    res.status(500).json({message: 'Internal Server Error'});
  }
}

// 获取用户信息
async getUserById(req: Request, res: Response) : Promise<void>{
  try{
    //const pool = (req as any).pool;
    const userId: number =parseInt(req.params.userId, 10);
    const result: QueryResult = await this.pool.query('SELECT * FROM users WHERE id = $1', [userId]);

    if(result.rows.length === 0){
      res.status(404).json({message: 'User not found'});
    } else{
      const user = result.rows[0];
      res.json(user);
    }
  } catch(err){
    console.error(err);
    res.status(500).json({message: 'Internal Server Error'});
  }
}

async getUserByName(req: Request, res: Response) : Promise<void>{
  try{
    const sql = "SELECT password FROM users WHERE username=$1";
    //const pool = (req as any).pool;
    const name: string = req.params.name;
    const result: QueryResult = await this.pool.query(sql, [name]);

    if(result.rows.length === 0){
      res.status(404).json({message: 'User not found'});
    } else{
      const user = result.rows[0];
      res.json(user);
    }
  } catch(err){
    console.error(err);
    res.status(500).json({message: 'Internal Server Error'});
  }
}
  


}

export default UserService;
