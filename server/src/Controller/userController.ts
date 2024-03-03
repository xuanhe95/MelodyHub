
import { Request, Response } from "express";
import UserService from '../Service/userService';


class UserController{
  private user: UserService;

  constructor(userService: UserService){
    this.user = userService;
  }

  async getUserById(req: Request, res: Response) : Promise<void>{
    await this.user.getUserById(req, res);
  }

  async getUserByName(req: Request, res: Response) : Promise<void>{
    await this.user.getUserByName(req, res);
  }

  async registerUser(req: Request, res: Response) : Promise<void>{
    await this.user.registerUser(req, res);
  }
  async test(req: Request, res: Response) : Promise<void>{
    console.log('test');
    res.json({message: 'test'});
  }
 
}

export default UserController;
