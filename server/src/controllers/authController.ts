import { Request, Response } from "express";
import AuthService from "../services/authService";
import {UserService} from "../services/userService";

import{NextFunction} from 'express';

class AuthController {
    private authService: AuthService;
    private userService: UserService;

    constructor(userService: UserService, authService: AuthService) {
        this.authService = authService;
        this.userService = userService;
        this.authUser = this.authUser.bind(this);
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

    async authUser(req: Request, res: Response, next: NextFunction): Promise<void> {
        const authHeader = req.headers['authorization'];
        const token = authHeader && authHeader.split(' ')[1];
        console.log('Token:', token);
        // console.log('AuthHeader:', authHeader);
        if (token === null || token === undefined) {
            res.sendStatus(401);
            return;
        }
        try{
            const user = await this.authService.verifyToken(token);
            console.log('User:', user);
            if(user){

                res.locals.user = user;
                console.log(req.body.userId);

                // res.json(user);
                
                next();
            }else{
                res.sendStatus(403);
                next();
            }
        } catch (error) {
            console.error('Error verifying token:', error);
            res.status(500);
        }
    }
}

export default AuthController;