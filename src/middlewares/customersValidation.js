import joi from 'joi';
import connection from '../database/db.js';

const customersSchema = joi.object({
    name: joi.string().required(),
    phone: joi.string().required().pattern(/^[0-9]+$/, 'numbers').min(10).max(11),
    cpf: joi.string().required().pattern(/^[0-9]+$/, 'numbers').min(11).max(11),
    birthday: joi.string().isoDate().required()
});

async function customersSchemaValidation(req, res, next) {
    const validation = customersSchema.validate(req.body, {abortEarly: false});
    if (validation.error) {
        const error = validation.error.details.map(details => details.message);
        return res.status(400).send(error);
    };
    next();
};

async function newCpfValidation(req, res, next) {
    const cpf = req.body.cpf;
    const customers = await connection.query(`
        SELECT * FROM customers
        WHERE cpf = $1;
        `, [cpf]
    );
    if (customers.rows.length > 0) {
        return res.status(400).send('CPF já cadastrado');
    };
    next();
};

async function findCustomer(req, res, next) {
    const id = req.params.id;
    const customer = await connection.query(`
        SELECT * FROM customers
        WHERE id = $1;
        `, [id]
    );
    if (!customer.rows[0]) {
        return res.status(404).send("Cliente não encontrado");
    };
    next();
};

export { customersSchemaValidation, newCpfValidation, findCustomer };