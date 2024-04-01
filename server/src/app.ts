const express = require("express");
const cors = require("cors");
import 'dotenv/config';
import { Request, Response } from 'express';
import router from './routes';
import config from './config';
import { AppDataSource } from './db';

const app = express();

app.use(cors({ origin: '*' }));
app.use(express.json());
app.use('/api', router);

console.log("Starting application...");

const startServer = async () => {
    try {
        console.log("Initializing data source...");
        await AppDataSource.initialize();
        console.log("Data Source has been initialized!");

        // Start the express server
        app.listen(config.server_port, () => {
            console.log(`Backend Server running at http://${config.server_host}:${config.server_port}/`);
        });

        // Define the root route
        app.get('/', (_req: Request, res: Response) => {
            res.send('Server is running!');
        });
    } catch (error) {
        console.error("Error during Data Source initialization:", error);
        process.exit(1);
    }
};

startServer();

export default app;
