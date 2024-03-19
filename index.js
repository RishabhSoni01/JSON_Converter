const fs = require("fs");
const express = require("express");
const { Client } = require('pg');
const dotenv = require('dotenv');
const app = express();
dotenv.config()
const client = new Client({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    port: process.env.DB_PORT,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME
});

client.connect(
  console.log('Connected DB')
);

app.get("/", (req, res) => {
    // Reading the file using default fs npm package
    const csv = fs.readFileSync("data.csv", "utf-8");

    // Convert the CSV data to an array of objects
    const rows = csv.split('\n').slice(1); // Exclude header row
    const result = rows.map(row => {
        // Split the row into individual fields
        const fields = row.split(',');

        // Ensure that the row contains the expected number of fields
        if (fields.length !== 8) {
            console.error("Invalid row:", row);
            return null; // Skip this row
        }

        // Extract individual fields
        const [firstName, lastName, age, line1, line2, city, state, gender] = fields;

        // Construct the address object
        const address = {
            line1: line1.trim(),
            line2: line2.trim(),
            city: city.trim(),
            state: state.trim()
        };

        // Construct the name object
        const name = {
            firstName: firstName.trim(),
            lastName: lastName.trim()
        };

        // Construct the additional_info object
        const additional_info = {
            gender: gender.trim()
        };

        // Assign mandatory properties directly
        const obj = {
            name,
            age: parseInt(age.trim()),
            address,
            additional_info
        };

        return obj;
    }).filter(row => row !== null); // Remove null values (invalid rows)

    // Inserting data into PostgreSQL table
    result.forEach((row, index) => {
        const { name, age, address, additional_info } = row;

        const query = {
            text: 'INSERT INTO public.users (name, age, address, additional_info) VALUES ($1, $2, $3, $4) RETURNING *',
            values: [name.firstName + ' ' + name.lastName, age, JSON.stringify(address), JSON.stringify(additional_info)]
        };

        client.query(query, (err, dbRes) => {
            if (err) {
                console.error(err);
                return;
            }
            console.log("Inserted:", dbRes.rows[0]);

            // Calculate age distribution and print report if it's the last row
            if (index === result.length - 1) {
                calculateAgeDistribution();
            }
        });
    });

    res.send("Data uploaded to PostgreSQL database.");
});

function calculateAgeDistribution() {
    const query = {
        text: 'SELECT age FROM public.users'
    };

    client.query(query, (err, dbRes) => {
        if (err) {
            console.error(err);
            return;
        }

        const ages = dbRes.rows.map(row => row.age);
        const totalUsers = ages.length;

        const ageDistribution = {
            '< 20': 0,
            '20 to 40': 0,
            '40 to 60': 0,
            '> 60': 0
        };

        ages.forEach(age => {
            if (age < 20) {
                ageDistribution['< 20']++;
            } else if (age >= 20 && age <= 40) {
                ageDistribution['20 to 40']++;
            } else if (age > 40 && age <= 60) {
                ageDistribution['40 to 60']++;
            } else {
                ageDistribution['> 60']++;
            }
        });

        console.log("Age-Group       % Distribution");
        console.log("< 20            ", ((ageDistribution['< 20'] / totalUsers) * 100).toFixed(2));
        console.log("20 to 40        ", ((ageDistribution['20 to 40'] / totalUsers) * 100).toFixed(2));
        console.log("40 to 60        ", ((ageDistribution['40 to 60'] / totalUsers) * 100).toFixed(2));
        console.log("> 60            ", ((ageDistribution['> 60'] / totalUsers) * 100).toFixed(2));
    });
}


const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});