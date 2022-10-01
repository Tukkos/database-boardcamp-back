import connection from "../database/db.js";
import dayjs from "dayjs";

let now = dayjs();
const rentDate = now.format("DD/MM/YYYY");

async function getRentals(req, res) {
    const customerId = req.query.customerId;
    const gameId = req.query.gameId;
    let rentals = [];
    try {
        if (customerId === undefined && gameId === undefined) {
            rentals = await connection.query(`
                    SELECT * FROM rentals;
            `);
        } else if (customerId === undefined && gameId != undefined) {
            rentals = await connection.query(`
                SELECT * FROM rentals
                WHERE "gameId" = $1;
                `, [gameId]
            );
        } else if (customerId != undefined && gameId === undefined) {
            rentals = await connection.query(`
                SELECT * FROM rentals
                WHERE "customerId" = $1;
                `, [customerId]
            );
        } else {
            rentals = await connection.query(`
                SELECT * FROM rentals
                WHERE "gameId" = $1
                AND "customerId" = $2;
                `, [gameId, customerId]
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
        // await connection.query(`
        //     INSERT INTO rentals ("customerId", "gameId", "rentDate", "daysRented", "originalPrice")
        //     VALUES ($1, $2, $3, $4, $5);
        //     `, [customerId, gameId, rentDate, daysRented, originalPrice]
        // );
        res.sendStatus(201);
    } catch (error) {
        res.status(500).send(error.message);
    };
};

export { getRentals, postRentals };