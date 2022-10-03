import connection from "../database/db.js";

async function getCategories(req, res) {
    try {
        const categories = await connection.query(`
            SELECT * FROM categories;
        `);
        res.status(201).send(categories.rows);
    } catch (error) {
        res.status(500).send(error.message);
    };
};

async function postCategories(req, res) {
    const { name } = req.body;
    try {
        await connection.query(`
            INSERT INTO categories (name)
            VALUES ($1);
            `, [name]
        );
        res.sendStatus(201);
    } catch (error) {
        res.status(500).send(error.message);
    };
};

export { getCategories, postCategories };