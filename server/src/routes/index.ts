import { Router } from "express";
import userRoutes from "./userRoutes";
import authRoutes from "./authRoutes";
import albumRoutes from "./albumRoutes";
import trackRoutes from "./trackRoutes";
import playlistRoutes from "./playlistRoutes";
import artistRoutes from "./artistRoutes";

const router = Router();

router.use(userRoutes);
router.use(authRoutes);
router.use(albumRoutes);
router.use(trackRoutes);
router.use(playlistRoutes);
router.use(artistRoutes);

export default router;
