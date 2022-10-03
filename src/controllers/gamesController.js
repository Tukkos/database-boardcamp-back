import connection from "../database/db.js";

async function getGames (req, res) {
    const search = req.query.name;
    let games = [];

    try {
        if (search === undefined) {
            games = await connection.query(`
                SELECT
                    games.name,
                    games.image,
                    games."stockTotal",
                    games."categoryId",
                    games."pricePerDay",
                    categories.name AS "categoryName"
                FROM games
                JOIN categories
                    ON games."categoryId" = categories.id;
            `);
        } else {
            games = await connection.query(`
                SELECT
                    games.name,
                    games.image,
                    games."stockTotal",
                    games."categoryId",
                    games."pricePerDay",
                    categories.name AS "categoryName"
                FROM games
                JOIN categories
                    ON games."categoryId" = categories.id
                WHERE games.name LIKE $1;
                `, [`%${search}%`]
            );
        };
        res.status(201).send(games.rows);
    } catch (error) {
        res.status(500).send(error.message);
    };
};

async function postGames (req, res) {
    const { name, image, stockTotal, categoryId, pricePerDay } = req.body;
    try {
        await connection.query(`
            INSERT INTO games (name, image, "stockTotal", "categoryId", "pricePerDay")
            VALUES ($1, $2, $3, $4, $5);
            `, [name, image, stockTotal, categoryId, pricePerDay]
        );
        res.sendStatus(201);
    } catch (error) {
        res.status(500).send(error.message);
    };
};

export { getGames, postGames };