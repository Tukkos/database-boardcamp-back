import express, { application } from 'express';

import categoriesRouter from './routes/categoriesRouter.js';

const server = express();
server.use(express.json());
server.use(categoriesRouter);

server.get('/status', (req, res) => {
    res.send('ok');
})

server.listen(4000, () => console.log("Listen on http://localhost:4000"));