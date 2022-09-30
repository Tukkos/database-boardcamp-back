import express from 'express';

import { getCategories, postCategories } from '../controllers/categoriesController.js';
import { newCategoryValidation, categoriesSchemaValidation } from '../middlewares/categoriesValidation.js';

const categoriesRouter = express.Router();

categoriesRouter.get(
    '/categories',
    getCategories
);

categoriesRouter.post(
    '/categories',
    categoriesSchemaValidation,
    newCategoryValidation,
    postCategories
);

export default categoriesRouter;