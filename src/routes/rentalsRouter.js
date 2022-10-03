import express from 'express';
import { deleteRentalsById, getRentals, postRentals, postRentalsReturn } from '../controllers/rentalsController.js';
import { doesCustomerExists, doesGameExists, gameIsAvaliable, isRentalReturned, rentalExists, rentalSchemaValidation } from '../middlewares/rentalsValidation.js';

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

rentalsRouter.post(
    '/rentals/:id/return',
    rentalExists,
    isRentalReturned,
    postRentalsReturn
);

rentalsRouter.delete(
    '/rentals/:id',
    rentalExists,
    isRentalReturned,
    deleteRentalsById
)

export default rentalsRouter;