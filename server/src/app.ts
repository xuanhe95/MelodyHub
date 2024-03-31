const express = require("express");
const cors = require("cors");
import { Request, Response } from 'express';
import router from "./routes";
import config from "./config";
import { db } from './db';

const app = express();

app.use(cors({ origin: "*" }));
app.use(express.json());
app.use("/api", router);

// test query to verify db connection before starting app.
db.query('SELECT * FROM TEST', (error, results) => {
    if (error) {
        console.error('Error connecting to the database:', error);
        process.exit(1); // Exit the app if the database connection fails
    }
    console.log("db is connected successfully.");
    console.log(results);

    // Only start the Express server after the database connection is established
    app.listen(config.server_port, () => {
        console.log(`Backend Server running at http://${config.server_host}:${config.server_port}/`);
    });

    app.get('/', (_req: Request, res: Response) => {
        res.send('Server is running!');
    });
});

export default app;
