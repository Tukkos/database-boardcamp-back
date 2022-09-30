import express from 'express';
import { getCustomers, getCustomersById, postCustomers } from '../controllers/customersController.js';
import { customersSchemaValidation, newCpfValidation } from '../middlewares/customersValidation.js';

const customersRouter = express.Router();

customersRouter.get(
    '/customers',
    getCustomers
);

customersRouter.get(
    '/customers/:id',
    getCustomersById
);

customersRouter.post(
    '/customers',
    customersSchemaValidation,
    newCpfValidation,
    postCustomers
);

export default customersRouter;