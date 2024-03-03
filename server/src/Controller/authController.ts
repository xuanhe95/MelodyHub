
import { Request, Response } from "express";
import AuthService from '../Service/authService';
import UserService from '../Service/userService';
import { JwtPayload } from "jsonwebtoken";





class AuthController{
    private auth: AuthService;
    private user: UserService;

    constructor(userService: UserService, authService: AuthService){
        this.auth = authService;
        this.user = userService;
        
    }

    // 用户登录
    async loginUser(req: Request, res: Response): Promise<void>{
        const token = this.auth.loginUser(req, res);
        if(token){
        token.then((result) => {
            if(result){
                res.json({token: result});
            } else{
                res.status(401).json({message: "用户名或密码错误"});
            }
        });
        } else{
            res.status(401).json({message: "用户名不存在"});
        }
    }

    // 用户验证
    async verifyUser(req: Request, res: Response): Promise<void>{
        const token = req.headers.authorization;
        if(!token){
            res.status(401).json({message: "Token缺失"});
            return;
        }
        const result = this.auth.verifyToken(token);
        if(result){
            res.json(result);
        } else{
            res.status(401).json({message: "Token无效"});
        }
    }
    


}

export default AuthController;
