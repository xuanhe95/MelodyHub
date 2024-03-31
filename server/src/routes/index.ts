import { Router } from "express";
import userRoutes from "./userRoutes";
import authRoutes from "./authRoutes";
import albumRoutes from "./albumRoutes";
import trackRoutes from "./trackRoutes";

const router = Router();

router.use(userRoutes);
router.use(authRoutes);
router.use(albumRoutes);
router.use(trackRoutes);

export default router;
