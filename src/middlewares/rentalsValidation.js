import joi from 'joi';
import connection from '../database/db.js';

const rentalSchema = joi.object({
    customerId: joi.number().required().integer().min(1),
    gameId: joi.number().required().integer().min(1),
    daysRented: joi.number().required().integer().min(1)
});

async function rentalSchemaValidation(req, res, next) {
    const validation = rentalSchema.validate (req.body, {abortEarly: false});
    if (validation.error) {
        const error = validation.error.details.map(details => details.message);
        return res.status(400).send(error);
    };
    next();
};

async function doesCustomerExists(req, res, next) {
    const id = req.body.customerId;
    const customer = await connection.query(`
        SELECT * FROM customers
        WHERE id = $1;
        `, [id]
    );
    if (!customer.rows[0]) {
        return res.status(400).send("Cliente não encontrado");
    };
    next();
};

async function doesGameExists(req, res, next) {
    const id = req.body.gameId;
    const game = await connection.query(`
        SELECT * FROM games
        WHERE id = $1;
        `, [id]
    );
    if (!game.rows[0]) {
        return res.status(400).send("Jogo não encontrado");
    };
    console.log(game.rows[0].stockTotal)
    res.locals.pricePerDay = game.rows[0].pricePerDay;
    res.locals.stockTotal = game.rows[0].stockTotal;
    next();
};

async function gameIsAvaliable(req, res, next) {
    const stockTotal = res.locals.stockTotal;
    const gameId = req.body.gameId;
    const rentals = await connection.query(`
        SELECT * FROM rentals
        WHERE "gameId" = $1;
        `, [gameId]
    );
    console.log(rentals.rows.length);
    if (rentals.rows.length >= stockTotal) {
        return res.status(400).send("Sem estoque do jogo!");
    };
    next();
};

export { rentalSchemaValidation, doesCustomerExists, doesGameExists, gameIsAvaliable };