import { Request, Response } from "express";
import AuthService from "../services/authService";
import {UserService} from "../services/userService";

class AuthController {
    private authService: AuthService;
    private userService: UserService;

    constructor(userService: UserService, authService: AuthService) {
        this.authService = authService;
        this.userService = userService;
    }

    // User login
    async loginUser(req: Request, res: Response): Promise<void> {
        const { username, password } = req.body;
        const token = await this.authService.loginUser(username, password);
        if (token) {
            res.json({ token: token });
        } else {
            res.status(401).json({ message: "Invalid username or password" });
        }
    }

    // Verify user
    async verifyUser(req: Request, res: Response): Promise<void> {
        const token = req.headers.authorization?.split(' ')[1];
        if (!token) {
            res.status(401).json({ message: "Token is missing" });
            return;
        }

        const result = this.authService.verifyToken(token);
        if (result) {
            res.json(result);
        } else {
            res.status(401).json({ message: "Invalid or expired token" });
        }
    }
}

export default AuthController;