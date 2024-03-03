
import { Request, Response } from "express";
import AuthService from '../Service/authService';
import UserService from '../Service/userService';





class AuthController{
    private auth: AuthService;
    private user: UserService;

    constructor(userService: UserService, authService: AuthService){
        this.auth = authService;
        this.user = userService;
        
    }

    // 用户登录
    loginUser(req: Request, res: Response): void{
        return this.auth.loginUser(req, res);
    }
    


}

export default AuthController;
