import { Router } from 'express';
import addressRoutes from '../modules/address/address_routes';
import authRouter from '../modules/auth/auth_routes';
import bannerRoutes from '../modules/banner/banner_routes';
import brandRoutes from '../modules/brand/brand_routes';
import categoryRouter from '../modules/categories/categories_routes';
import userRoutes from '../modules/user/user_routes';

const router = Router();
router.use('/auth', authRouter);
router.use('/category', categoryRouter);
router.use('/user', userRoutes);
router.use('/address', addressRoutes);
router.use('/banner', bannerRoutes);
router.use('/brand', brandRoutes);

export default router;
