const express = require("express");
const cors = require("cors");
import { Request, Response } from 'express';
import router from "./routes";
import config from "./config";

const app = express();

app.use(cors({ origin: "*" }));
app.use(express.json());
app.use("/api", router);

app.get('/', (_req: Request, res: Response) => {
    res.send('Server is running!');
});

app.listen(config.server_port, () => {
    console.log(`Backend Server running at http://${config.server_host}:${config.server_port}/`);
});

export default app;
