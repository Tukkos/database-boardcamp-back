import joi from 'joi';
import connection from '../database/db.js';

const gamesSchema = joi.object({
    name: joi.string().required(),
    image: joi.string().required(),
    stockTotal: joi.number().required().integer().min(1),
    categoryId: joi.number().required().integer().min(1),
    pricePerDay: joi.number().required().integer()
});

async function gamesSchemaValidation(req, res, next) {
    const { name, image, stockTotal, categoryId, pricePerDay } = req.body;
    const validation = gamesSchema.validate(req.body, {abortEarly: false});
    if (validation.error) {
        const error = validation.error.details.map(details => details.message);
        return res.status(400).send(error);
    };
    next();
};

async function newGameValidation(req, res, next) {
    const name = req.body.name;
    const games = await connection.query(`
        SELECT * FROM games
        WHERE name = $1;
        `, [name]
    );
    if (games.rows.length > 0) {
        return res.status(409).send('Jogo já cadastrado');
    };
    next();
};

async function categoryExistsValidation(req, res, next) {
    const categoryId = req.body.categoryId;
    const categories = await connection.query(`
        SELECT * FROM categories
        WHERE id = $1;
        `, [categoryId]
    );
    if (categories.rows.length === 0) {
        return res.status(400).send('Categoria não existente');
    };
    next();
};

export { gamesSchemaValidation, newGameValidation, categoryExistsValidation }