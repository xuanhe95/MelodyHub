import { Request, Response } from "express";
import UserService from "../services/userService";

class UserController {
    private user: UserService;

    constructor(userService: UserService) {
        this.user = userService;
    }
    // 通过id获取用户信息
    async getUserById(req: Request, res: Response): Promise<void> {
        const user = await this.user.getUserById(req, res);
        if (user) {
            res.json(user);
        } else {
            res.status(404).json({ message: "User not found" });
        }
    }
    // 通过用户名获取用户信息
    async getUserByName(req: Request, res: Response): Promise<void> {
        const user = await this.user.getUserByName(req, res);
        if (user) {
            res.json(user);
        } else {
            res.status(404).json({ message: "User not found" });
        }
    }
    // 用户注册
    async registerUser(req: Request, res: Response): Promise<void> {
        const ok: boolean = await this.user.registerUser(req, res);
        if (ok) {
            res.status(201).json({ message: "User created" });
        } else {
            res.status(500).json({ message: "Internal Server Error" });
        }
    }
    async test(req: Request, res: Response): Promise<void> {
        //console.log("test");
        res.json({ message: "test" });
    }
}

export default UserController;
