import { Pool, QueryResult } from 'pg';
import { Request, Response } from "express";
import {User} from '../Model/user';
const config = require('../config.json')


const privateKey = config.privateKey;


class UserService{
  private pool: Pool;
  constructor(pool: Pool){
    this.pool = pool;
  }
  
 // 用户注册
 async registerUser(req: Request, res: Response) : Promise<boolean>{
  try{
    const currentDate = new Date();
    const now = currentDate.toISOString();
    const { username, password } = req.body;
    const sql = "INSERT INTO users (username, password, created_at, last_login_at) VALUES ($1, $2, $3, $4)"
    const result: QueryResult = await this.pool.query(sql, [username, password, now, now]);
    const user = result.rows[0];
    return true;
  } catch(err){
    console.error(err);
    res.status(500).json({message: 'Internal Server Error'});
    return false;
  }
}

// 获取用户信息
async getUserById(req: Request, res: Response) : Promise<User | null>{
  try{
    const id: number =parseInt(req.params.id, 10);
    const result: QueryResult = await this.pool.query('SELECT * FROM users WHERE id = $1', [id]);

    if(result.rows.length === 0){
      return null;
    } else{
      const user = result.rows[0];
      const userObj: User = {
        id: user.id,
        username: user.username,
        password: user.password,
        created_at: user.created_at,
        last_login_at: user.last_login_at
      }
      return userObj;
    }
  } catch(err){
    console.error(err);
    res.status(500).json({message: 'Internal Server Error'});
    return null;
  }
}

// 通过用户名获取用户信息
async getUserByName(req: Request, res: Response) : Promise<User | null>{
  try{
    const sql = "SELECT password FROM users WHERE username=$1";
    //const pool = (req as any).pool;
    const name: string = req.params.name;
    const result: QueryResult = await this.pool.query(sql, [name]);
    if(result.rows.length === 0){
      return null;
    } else{
      const user = result.rows[0];
      const userObj: User = {
        id: user.id,
        username: user.username,
        password: user.password,
        created_at: user.created_at,
        last_login_at: user.last_login_at
      }
      return userObj;
    }
  } catch(err){
    console.error(err);
    res.status(500).json({message: 'Internal Server Error'});
    return null;
  }
}
  


}

export default UserService;
