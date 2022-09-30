import connection from "../database/db.js";

async function getGames (req, res) {
    const search = req.query.name;
    let games = [];
    try {
        console.log(search);
        if (search === undefined) {
            games = await connection.query(`SELECT * FROM games;`);
        } else {
            games = await connection.query(`SELECT * FROM games WHERE name LIKE $1;`, [`%${search}%`]);
        };
        res.status(201).send(games.rows);
    } catch (error) {
        res.status(500).send(error.message);
    };
};

export { getGames };