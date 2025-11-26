// import Sequelize from "sequelize";
import { Sequelize } from "sequelize";
import dotenv from "dotenv";
// import "./models/associations";


dotenv.config();

const DB_HOST       = process.env.DB_HOST || ""
const DB_USER       = process.env.DB_USER || ""
const DB_PASSWORD   = process.env.DB_PASSWORD || ""
const DB_NAME       = process.env.DB_NAME || ""
const DB_PORT       = Number(process.env.DB_PORT) || 3306; // 👈 added
// const DB_PORT       = process.env.DB_PORT


const sequelize = new Sequelize(
  DB_NAME, // database
  DB_USER,          // username
  DB_PASSWORD,      // password
  {
    host: DB_HOST,
    port: DB_PORT, 
    dialect: "mariadb",
    logging: false,
  }
);

// import "./models/associations";

export default sequelize;