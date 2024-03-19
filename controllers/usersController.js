const fs = require("fs");
const db = require('../config/db');

exports.calculateAgeDistribution = (res) => { // Receive 'res' object as parameter
    const query = {
        text: 'SELECT age FROM public.users'
    };

    db.query(query, (err, dbRes) => {
        if (err) {
            console.error(err);
            res.status(500).send("Error calculating age distribution.");
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

        const ageDistributionPercentage = {
            '< 20': ((ageDistribution['< 20'] / totalUsers) * 100).toFixed(2),
            '20 to 40': ((ageDistribution['20 to 40'] / totalUsers) * 100).toFixed(2),
            '40 to 60': ((ageDistribution['40 to 60'] / totalUsers) * 100).toFixed(2),
            '> 60': ((ageDistribution['> 60'] / totalUsers) * 100).toFixed(2)
        };

        const ageGroupArray = Object.keys(ageDistributionPercentage);
        console.log("Age-Group       % Distribution");
        ageGroupArray.forEach(ageGroup => {
            console.log(ageGroup.padEnd(15), ageDistributionPercentage[ageGroup]);
        });

        // res.status(200).json({ ageDistributionPercentage }); // Remove this line
    });
};

exports.uploadData = (req, res) => {
    try {
        // Reading the file using default fs npm package
        const csv = fs.readFileSync("./public/uploads/data.csv", "utf-8");

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

            db.query(query, (err, dbRes) => {
                if (err) {
                    console.error(err);
                    return;
                }
                console.log("Inserted:", dbRes.rows[0]);

                // Calculate age distribution and print report if it's the last row
                if (index === result.length - 1) {
                    exports.calculateAgeDistribution(res); // Pass 'res' object
                    res.send("Data uploaded to PostgreSQL database."); // Send response here
                }
            });
        });

        // Do not send response here
    } catch (error) {
        console.error("Error uploading data:", error);
        res.status(500).send("Error uploading data to PostgreSQL database.");
    }
};