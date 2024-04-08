import { Router } from 'express';
import AuthService from '../services/authService';
import AuthController from '../controllers/authController';
import {UserService} from '../services/userService';

const authService = new AuthService();
const userService = new UserService();
const authController = new AuthController(userService, authService);

const router = Router();



// User login route
router.post('/login', (req, res) => authController.loginUser(req, res));

// Route for verifying the user token
router.get('/verify', (req, res) => authController.verifyUser(req, res));




export default router;
