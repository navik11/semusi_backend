import dotenv from "dotenv";
import pg from "pg";
dotenv.config({ path: "././.env" });

//////////////////////////////// PostgreSQL Connection ////////////////////////////////

const { Pool } = pg;

const pool = new Pool({
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    host: process.env.DB_HOST,
    port: process.env.DB_PORT,
    database: process.env.DB_NAME,
});

/*
If you are using Heroku, Render etc Postgres, you can use the following code snippet to connect to the database:

const pool = new Pool({
    connectionString: process.env.DBConnLink,
    ssl: {
        rejectUnauthorized: false,
    },
});

*/

// Function to store data into PostgreSQL
const storeQuoteDataInPostgres = async (data) => {
    const createTableQuery = `
        CREATE TABLE IF NOT EXISTS quotes (
            id SERIAL PRIMARY KEY,
            quote TEXT NOT NULL,
            author VARCHAR(255) NOT NULL
        );
    `;

    const insertQuery = "INSERT INTO quotes (quote, author) VALUES ($1, $2)";

    try {
        // Ensure the table exists
        await pool.query(createTableQuery);

        // Insert data into the table
        for (const quote of data) {
            const values = [quote.quote, quote.author];
            await pool.query(insertQuery, values);
        }

        console.log("Data stored in PostgreSQL successfully.");
    } catch (error) {
        console.error("Error storing data in PostgreSQL:", error.message);
    }
};

// Function to store data into PostgreSQL
const deleteAllQoutes = async () => {
    const createTableQuery = `
        DROP TABLE quotes CASCADE;
    `;

    try {
        // Ensure the table exists
        await pool.query(createTableQuery);
        console.log("All qoutes deleted successfully.");
        return 1;
    } catch (error) {
        throw new Error("Error deleting data in PostgreSQL:", error);
    }
};

const queryPG = async (query) => {
    try {
        const pgRes = await pool.query(query);
        console.log("PG Query successful.");
        return pgRes.rows; 
    } catch (error) {
        throw new Error("Error quering the PostgreSQL:", error);
    }
};

export { deleteAllQoutes, storeQuoteDataInPostgres, queryPG };



//////////////////////////////// MySQL Connection ////////////////////////////////


import mysql from 'mysql2/promise';

const sql_pool = mysql.createPool({
    host: process.env.SQL_HOST,
    user: process.env.SQL_USER,
    password: process.env.SQL_PASSWORD,
    database: process.env.SQL_DB,
});

const querySQL = async (query) => {
    try {
        const [rows] = await sql_pool.query(query);
        console.log("SQL Query successful.");
        return rows;
    } catch (error) {
        throw new Error("Error quering the MySQL:", error);
    }
};

export { sql_pool, querySQL };