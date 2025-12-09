const mysql = require('mysql2');
const fs = require('fs');
require('dotenv').config();

const db = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: '',
    multipleStatements: true
});

db.connect((err) => {
    if (err) {
        console.error("❌ Could not connect to MySQL. Is your server running?");
        console.error("Error:", err.message);
        return;
    }
    console.log("Connected to MySQL Server...");

    const createSql = fs.readFileSync('./create_db.sql').toString();
    
    db.query(createSql, (err, result) => {
        if (err) {
            console.error("❌ Error creating database:", err.message);
        } else {
            console.log("✅ Database and Tables created successfully!");

            const insertSql = fs.readFileSync('./insert_test_data.sql').toString();
            
            db.query(insertSql, (err, result) => {
                if (err) {
                    console.error("❌ Error inserting data:", err.message);
                } else {
                    console.log("✅ Test Data inserted successfully!");
                }
                process.exit();
            });
        }
    });
});