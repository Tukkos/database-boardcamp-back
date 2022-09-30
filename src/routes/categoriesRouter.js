import express from 'express';

import { getCategories, postCategories } from '../controllers/categoriesController.js';
import { categoriesDuplicateValidation, categoriesSchemaValidation } from '../middlewares/categoriesValidation.js';

const categoriesRouter = express.Router();

categoriesRouter.get(
    '/categories',
    getCategories
);

categoriesRouter.post(
    '/categories',
    categoriesSchemaValidation,
    categoriesDuplicateValidation,
    postCategories
);

export default categoriesRouter;