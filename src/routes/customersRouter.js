import express from 'express';
import { getCustomers, getCustomersById, postCustomers, updateCustomers } from '../controllers/customersController.js';
import { customersSchemaValidation, findCustomer, newCpfValidation } from '../middlewares/customersValidation.js';

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

customersRouter.put(
    '/customers/:id',
    customersSchemaValidation,
    newCpfValidation,
    findCustomer,
    updateCustomers
)

export default customersRouter;