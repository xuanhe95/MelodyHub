import * as mysql from 'mysql';
import config from "./config";

export const db = mysql.createPool({
    connectionLimit: 10,
    user: config.rds_user,
    host: config.rds_host,
    database: config.rds_db,
    password: config.rds_password,
    port: config.rds_port,
});
