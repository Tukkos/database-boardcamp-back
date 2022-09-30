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

export { getCustomers };