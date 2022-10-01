import express from 'express';
import { getRentals, postRentals } from '../controllers/rentalsController.js';
import { doesCustomerExists, doesGameExists, gameIsAvaliable, rentalSchemaValidation } from '../middlewares/rentalsValidation.js';

const rentalsRouter = express.Router();

rentalsRouter.get(
    '/rentals',
    getRentals
);

rentalsRouter.post(
    '/rentals',
    rentalSchemaValidation,
    doesCustomerExists,
    doesGameExists,
    gameIsAvaliable,
    postRentals
);

export default rentalsRouter;