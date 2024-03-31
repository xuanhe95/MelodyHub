import dotenv from 'dotenv';
dotenv.config();

interface Config {
    server_port: number;
    server_host: string;
    rds_user: string;
    rds_host: string;
    rds_db: string;
    rds_password: string;
    rds_port: number;
}

const config: Config = {
    server_port: parseInt(process.env.SERVER_PORT || '3000'),
    server_host: process.env.SERVER_HOST || 'localhost',
    rds_user: process.env.RDS_USER || '',
    rds_host: process.env.RDS_HOST || 'localhost',
    rds_db: process.env.RDS_DB || '',
    rds_password: process.env.RDS_PASSWORD || '',
    rds_port: parseInt(process.env.RDS_PORT || '5432'),
};

export default config;
