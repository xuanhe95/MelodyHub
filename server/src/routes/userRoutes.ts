import { Router } from 'express';
import { UserService } from '../services/userService';
import { UserController } from '../controllers/userController';

const userService = new UserService();
const userController = new UserController(userService);

const router = Router();

router.get('/user/:id', (req, res) => userController.getUserById(req, res));
router.get('/user/byName/:name', (req, res) => userController.getUserByName(req, res));
router.post('/user', (req, res) => userController.registerUser(req, res));

export default router;