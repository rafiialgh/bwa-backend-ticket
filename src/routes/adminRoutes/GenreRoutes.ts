import express from 'express';
import { deleteGenre, getGenreDetail, getGenres, postGenre, putGenre } from '../../controllers/GenreController';
import { validateRequest } from '../../middleware/validateRequest';
import { genreSchema } from '../../utils/zodSchema';

const genreRoutes = express.Router();

genreRoutes.get('/genres', getGenres);
genreRoutes.get('/genres/:id', getGenreDetail);
genreRoutes.post('/genres', validateRequest(genreSchema), postGenre);
genreRoutes.put('/genres/:id', validateRequest(genreSchema), putGenre)
genreRoutes.delete('/genres/:id', deleteGenre)

export default genreRoutes;
