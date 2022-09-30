import express from 'express';
import { getGames, postGames } from '../controllers/gamesController.js';
import { categoryExistsValidation, newGameValidation, gamesSchemaValidation } from '../middlewares/gamesValidation.js';

const gamesRouter = express.Router();

gamesRouter.get(
    '/games',
    getGames
);

gamesRouter.post(
    '/games',
    gamesSchemaValidation,
    newGameValidation,
    categoryExistsValidation,
    postGames
);

export default gamesRouter;