import connection from "../database/db.js";

async function getCustomers (req, res) {
    const cpf = req.query.cpf;
    let customers = [];

    try {
        if (cpf === undefined) {
            customers = await connection.query(`
                SELECT * FROM customers;
            `);
        } else {
            customers = await connection.query(`
                SELECT * FROM customers
                WHERE cpf LIKE $1;`
                , [`%${cpf}%`]
            );
        };
        res.status(201).send(customers.rows);
    } catch (error) {
        res.status(500).send(error.message);
    };
};

async function getCustomersById (req, res) {
    const id = req.params.id;
    try {
        const customers = await connection.query(`
            SELECT * FROM customers
            WHERE id = $1;
            `, [id]
        );
        if (customers.rows[0] === undefined) {
            return res.sendStatus(404);
        }
        res.status(201).send(customers.rows[0]);
    } catch (error) {
        res.status(500).send(error.message);
    };
};

async function postCustomers (req, res) {
    const { name, phone, cpf, birthday } = req.body;
    try {
        await connection.query(`
            INSERT INTO customers (name, phone, cpf, birthday)
            VALUES ($1, $2, $3, $4);
            `, [name, phone, cpf, birthday]
        );
        res.sendStatus(201);
    } catch (error) {
        res.status(500).send(error.message);
    };
};

export { getCustomers, getCustomersById, postCustomers };