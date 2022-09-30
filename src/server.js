import express from 'express';
import cors from "cors";

import categoriesRouter from './routes/categoriesRouter.js';
import gamesRouter from './routes/gamesRouter.js';
import customersRouter from './routes/customersRouter.js';

const server = express();
server.use(express.json());
server.use(cors());

server.use(categoriesRouter);
server.use(gamesRouter);
server.use(customersRouter);

server.get('/status', (req, res) => {
    res.send('ok');
})

server.listen(4000, () => console.log("Listen on http://localhost:4000"));