import connection from "../database/db.js";
import dayjs from "dayjs";

let now = dayjs();
const date = now.format("DD/MM/YYYY");

// async function getRentals(req, res) {
//     const customerId = req.query.customerId;
//     const gameId = req.query.gameId;

//     let rentals = [];
//     let response = {};
//     try {
//         const customer = await connection.query(`
//             SELECT
//                 customers.id,
//                 customers.name
//             FROM customers
//             WHERE id = $1;
//             `, [customerId]
//         );

//         const game = await connection.query(`
//             SELECT
//                 games.id,
//                 games.name,
//                 games."categoryId",
//                 categories.name AS "categoryName"
//             FROM games
//             JOIN categories
//                 ON games."categoryId" = categories.id
//             WHERE games.id = $1;
//             `, [gameId]
//         );

//         if (customerId === undefined && gameId === undefined) {
//             rentals = await connection.query(`
//                 SELECT * FROM rentals
//                 WHERE "gameId" = $1
//                 AND "customerId" = $2;
//                 `, [gameId, customerId]
//             );
//             response = [
//                 {
//                     ...rentals.rows[0],
//                     customer: customer.rows[0],
//                     game: game.rows[0]
//                 }
//             ];
//         } else if (customerId === undefined && gameId != undefined) {
//             rentals = await connection.query(`
//                 SELECT * FROM rentals
//                 WHERE "gameId" = $1;
//                 `, [gameId]
//             );
//             response = [
//                 {
//                     ...rentals.rows[0],
//                     game: game.rows[0]
//                 }
//             ];
//         } else if (customerId != undefined && gameId === undefined) {
//             rentals = await connection.query(`
//                 SELECT * FROM rentals
//                 WHERE "customerId" = $1;
//                 `, [customerId]
//             );
//             response = [
//                 {
//                     ...rentals.rows[0],
//                     customer: customer.rows[0]
//                 }
//             ];
//         } else {
//             rentals = await connection.query(`
//                 SELECT * FROM rentals
//                 WHERE "gameId" = $1
//                 AND "customerId" = $2;
//                 `, [gameId, customerId]
//             );
//             response = [
//                 {
//                     ...rentals.rows[0],
//                     customer: customer.rows[0],
//                     game: game.rows[0]
//                 }
//             ];
//         };
        
//         console.log(response);
//         res.status(201).send(response);
//     } catch (error) {
//         res.status(500).send(error.message);
//     };
// };

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