import connection from "../database/db.js";
import dayjs from "dayjs";

let now = dayjs();
const date = now.format("DD/MM/YYYY");

async function getRentals(req, res) {
    const customerId = req.query.customerId;
    const gameId = req.query.gameId;
    let rentals = [];
    try {
        if (customerId === undefined && gameId === undefined) {
            rentals = await connection.query(`
            SELECT
                rentals.*,
                json_build_object(
                    'id', customers.id,
                    'name', customers.name
                ) AS customer,
                json_build_object(
                    'id', games.id,
                    'name', games.name,
                    'categoryId', games."categoryId",
                    'categoryName', categories.name
                ) AS game
            FROM rentals
            JOIN customers
                ON rentals."customerId" = customers.id
            JOIN games
                ON rentals."gameId" = games.id
            JOIN categories
                ON games."categoryId" = categories.id;
            `);
        } else if (customerId === undefined && gameId != undefined) {
            rentals = await connection.query(`
                SELECT
                    rentals.*,
                    json_build_object(
                        'id', customers.id,
                        'name', customers.name
                    ) AS customer,
                    json_build_object(
                        'id', games.id,
                        'name', games.name,
                        'categoryId', games."categoryId",
                        'categoryName', categories.name
                    ) AS game
                FROM rentals
                JOIN customers
                    ON rentals."customerId" = customers.id
                JOIN games
                    ON rentals."gameId" = games.id
                JOIN categories
                    ON games."categoryId" = categories.id
                WHERE "gameId" = $1;
                `, [gameId]
            );
        } else if (customerId != undefined && gameId === undefined) {
            rentals = await connection.query(`
                SELECT
                    rentals.*,
                    json_build_object(
                        'id', customers.id,
                        'name', customers.name
                    ) AS customer,
                    json_build_object(
                        'id', games.id,
                        'name', games.name,
                        'categoryId', games."categoryId",
                        'categoryName', categories.name
                    ) AS game
                FROM rentals
                JOIN customers
                    ON rentals."customerId" = customers.id
                JOIN games
                    ON rentals."gameId" = games.id
                JOIN categories
                    ON games."categoryId" = categories.id
                WHERE "customerId" = $1;
                `, [customerId]
            );
        };
        res.status(201).send(rentals.rows);
    } catch (error) {
        res.status(500).send(error.message);
    };
};

async function postRentals(req, res) {
    const { customerId, gameId, daysRented } = req.body;

    const pricePerDay = res.locals.pricePerDay;
    const originalPrice = pricePerDay * daysRented;

    try {
        await connection.query(`
            INSERT INTO rentals ("customerId", "gameId", "rentDate", "daysRented", "originalPrice")
            VALUES ($1, $2, $3, $4, $5);
            `, [customerId, gameId, date, daysRented, originalPrice]
        );
        res.sendStatus(201);
    } catch (error) {
        res.status(500).send(error.message);
    };
};

async function postRentalsReturn(req, res) {
    const id = req.params.id;
    const isReturned = res.locals.isReturned;

    if (isReturned) {
        return res.status(400).send('Jogo já devolvido!');
    };

    try {
        const rentDate = dayjs(res.locals.rental.rentDate);
        const originalPrice = res.locals.rental.originalPrice;
        const daysRented = res.locals.rental.daysRented;

        const daysDiff = now.diff(rentDate, 'd');
        let delay = daysDiff - daysRented;
        if (delay < 0) {
            delay = 0
        };
        const delayFee = originalPrice * delay;

        await connection.query(`
            UPDATE rentals
            SET "returnDate" = $1, "delayFee" = $2
            WHERE id = $3;
            `, [date, delayFee, id]
        );
        res.sendStatus(200);
    } catch (error) {
        res.status(500).send(error.message);
    };
};

async function deleteRentalsById(req, res) {
    const id = req.params.id;
    const isReturned = res.locals.isReturned;

    if (!isReturned) {
        return res.status(400).send('Jogo ainda não devolvido!');
    };

    try {
        await connection.query(`
            DELETE FROM rentals
            WHERE id = $1;
            `, [id]
        );
        res.sendStatus(200);
    } catch (error) {
        res.status(500).send(error.message);
    };
};

export { getRentals, postRentals, postRentalsReturn, deleteRentalsById };