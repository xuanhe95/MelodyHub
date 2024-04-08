// src/controllers/userController.ts
import { Request, Response } from 'express';
import { UserService } from '../services/userService';


export class UserController {
    private userService: UserService;

    constructor(userService: UserService) {
        this.userService = userService;
    }

    async registerUser(req: Request, res: Response): Promise<void> {
        const { username, password } = req.body;
        try {
            const success = await this.userService.createUser(username, password);
            if (success) {
                res.status(201).json({ message: "User created successfully." });
            } else {
                res.status(400).json({ message: "Failed to create user." });
            }
        } catch (error) {
            console.error(error);
            res.status(500).json({ message: "Internal Server Error" });
        }
    }

    async getUserById(req: Request, res: Response): Promise<void> {
        const id = parseInt(req.params.id, 10);
        try {
            const user = await this.userService.getUserById(id);
            if (!user) {
                res.status(404).json({ message: "User not found." });
            } else {
                res.json(user);
            }
        } catch (error) {
            console.error(error);
            res.status(500).json({ message: "Internal Server Error" });
        }
    }

    async getUserByName(req: Request, res: Response): Promise<void> {
        const { name } = req.params;
        try {
            const user = await this.userService.getUserByName(name);
            if (!user) {
                res.status(404).json({ message: "User not found." });
            } else {
                res.json(user);
            }
        } catch (error) {
            console.error(error);
            res.status(500).json({ message: "Internal Server Error" });
        }
    }
}
