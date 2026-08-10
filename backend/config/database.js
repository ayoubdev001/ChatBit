import { Sequelize } from "sequelize";
import dotenv from "dotenv";

dotenv.config();

export const sequelize = new Sequelize(process.env.DATABASE_URL, {
  dialect: "postgres",
  logging: false
});

export async function connectDatabase() {
    try{
        await sequelize.authenticate();
        console.log("Database connected.");
    } catch (error) {
        console.error("Unable to connect to the database:", error);
        process.exit(1);
    }
};
