import joi from 'joi';
import connection from "../database/db.js";


const categoriesSchema = joi.object({
    name: joi.string().required()
});

async function categoriesSchemaValidation(req, res, next) {
    const validation = categoriesSchema.validate(req.body, {abortEarly: false});
    if (validation.error) {
        const error = validation.error.details.map(details => details.message);
        return res.status(400).send(error);
    };
    next();
};

async function categoriesDuplicateValidation(req, res, next) {
    const name = req.body;
    const categories = await connection.query(`SELECT * FROM categories WHERE name = '${name}';`);
    if (categories) {
        return res.status(409).send('Categoria já existente');
    };
    next();
};

export { categoriesSchemaValidation, categoriesDuplicateValidation };