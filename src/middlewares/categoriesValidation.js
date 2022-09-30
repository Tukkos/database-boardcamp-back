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

async function newCategoryValidation(req, res, next) {
    const categoryName = req.body.name;
    const categories = await connection.query(`
        SELECT * FROM categories
        WHERE name = $1;
        `, [categoryName]
    );
    if (categories.rows.length > 0) {
        return res.status(409).send('Categoria já existente');
    };
    next();
};

export { categoriesSchemaValidation, newCategoryValidation };