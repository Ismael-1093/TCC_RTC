const sql2 = require("mysql2");
const dotenv = require("dotenv");


dotenv.config();

const db = sql2.createConnection({
    host: "localhost",
    port: 3306, 
    user: "root", 
    password: "root", 
    database: "NewCargo" 
});

module.exports = db;
