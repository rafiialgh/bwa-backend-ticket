import express from 'express';
import genreRoutes from './GenreRoutes';
import theaterRoutes from './TheaterRoutes';
import movieRoutes from './MovieRoutes';
import customerRoutes from './CustomerRoutes';
import { verifyRole, verifyToken } from '../../middleware/verifyToken';

const adminRoutes = express.Router();

adminRoutes.use(verifyToken);
adminRoutes.use(verifyRole('admin'));
adminRoutes.use(genreRoutes);
adminRoutes.use(theaterRoutes);
adminRoutes.use(movieRoutes);
adminRoutes.use(customerRoutes);

export default adminRoutes;
