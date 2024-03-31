import { Router } from 'express';
import AuthService from '../services/authService';
import AuthController from '../controllers/authController';
import UserService from '../services/userService';
import { pool } from '../db';

const authService = new AuthService(pool);
const userService = new UserService(pool);
const authController = new AuthController(userService, authService);

const router = Router();

router.post('/login', (req, res) => authController.loginUser(req, res));

export default router;
