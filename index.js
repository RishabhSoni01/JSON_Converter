// const express = require('express');
// const fs = require('fs');
// const path = require('path');
// require('dotenv').config();
// const User = require('./user');

// const app = express();
// const port = process.env.PORT;
// const csvFilePath = process.env.CSV_FILE_PATH;
// const jsonFilePath = path.join(process.cwd(), 'output.json');

// // Route to handle CSV to JSON conversion and database operations
// app.get('/', async (req, res) => {
//   try {
//     const users = await readCSVAndConvertToJSON();
//     await processJSONData(users);
//     res.send('Data insertion process completed.');
//   } catch (error) {
//     console.error('Error:', error);
//     res.status(500).send('Internal Server Error');
//   }
// });

// // Function to read CSV, convert to JSON, and return JSON data
// async function readCSVAndConvertToJSON() {
//   return new Promise((resolve, reject) => {
//     fs.readFile(csvFilePath, 'utf-8', (err, data) => {
//       if (err) {
//         reject(err);
//         return;
//       }

//       const rows = data.trim().split('\n');
//       const headers = rows[0].split(',');
//       const users = [];

//       for (let i = 1; i < rows.length; i++) {
//         const row = rows[i].split(',');
//         const user = {};

//         for (let j = 0; j < headers.length; j++) {
//           const header = headers[j];
//           const value = row[j];

//           if (header === 'name.firstName' || header === 'name.lastName') {
//             if (!user.name) {
//               user.name = {};
//             }
//             user.name[header.split('.')[1]] = value;
//           } else if (header === 'age') {
//             user.age = parseInt(value, 10);
//           } else if (header.startsWith('address.')) {
//             if (!user.address) {
//               user.address = {};
//             }
//            user.address[header.split('.')[1]] = value;
//           } else {
//             user[header] = value;
//           }
//         }

//         users.push(user);
//       }

//       // Save JSON data to local file
//       fs.writeFile(jsonFilePath, JSON.stringify(users, null, 2), (err) => {
//         if (err) {
//           reject(err);
//           return;
//         }

//         console.log('CSV data successfully converted to JSON format and saved to output.json');
//       });

//       // Save JSON data to PostgreSQL
//       const client = new Client({ connectionString: process.env.DB_CONNECTION_STRING });
//       client.connect();

//       client.query(`INSERT INTO users (data) VALUES ($1)`, [JSON.stringify(users)], (err, res) => {
//         if (err) {
//           reject(err);
//           return;
//         }

//         console.log('CSV data successfully converted to JSON format and saved to PostgreSQL');
//         resolve(users);
//       });
//     });
//   });
// }

// // Function to process JSON data and perform database operations
// async function processJSONData(users) {
//   try {
//     const user = new User();
//     await user.createTable();
//     await user.insertData(users);
//   } catch (error) {
//     throw error;
//   }
// }

// // Start the server
// app.listen(port, () => {
//   console.log(`Server is running on port ${port}`);
// });


const fs = require('fs');
const path = require('path');
require('dotenv').config();
const csvFilePath = process.env.CSV_FILE_PATH;
const jsonFilePath = path.join(process.cwd(), 'output.json');
// const { Pool } = require('pg');

// const pool = new Pool({
//   user: process.env.DB_USER,
//   host: process.env.DB_HOST,
//   database: process.env.DB_NAME,
//   password: process.env.DB_PASSWORD,
//   port: process.env.DB_PORT,
// });

const users = [];
const ageDistribution = {
  '< 20': 0,
  '20-40': 0,
  '40-60': 0,
  '> 60': 0
};

fs.readFile(csvFilePath, 'utf-8', (err, data) => {
  if (err) {
    console.error('Error reading CSV file:', err);
    return;
  }

  const rows = data.trim().split('\n');
  const headers = rows[0].split(',');

  for (let i = 1; i < rows.length; i++) {
    const row = rows[i].split(',');
    const user = {};

    for (let j = 0; j < headers.length; j++) {
      const header = headers[j];
      const value = row[j];

      if (header === 'name.firstName' || header === 'name.lastName') {
        if (!user.name) {
          user.name = {};
        }
        user.name[header.split('.')[1]] = value;
      } else if (header === 'age') {
        user.age = parseInt(value, 10);
      } else if (header.startsWith('address.')) {
        if (!user.address) {
          user.address = {};
        }
        user.address[header.split('.')[1]] = value;
      } else {
        user[header] = value;
      }

      if (user.age < 20) {
        ageDistribution['< 20']++;
      } else if (user.age >= 20 && user.age < 40) {
        ageDistribution['20-40']++;
      } else if (user.age >= 40 && user.age < 60) {
        ageDistribution['40-60']++;
      } else {
        ageDistribution['> 60']++;
      }
    }

    users.push(user);
  }

  fs.writeFile(jsonFilePath, JSON.stringify(users, null, 2), (err) => {
    if (err) {
      console.error('Error writing JSON file:', err);
      return;
    }

    console.log('CSV data successfully converted to JSON format and saved to output.json');
    console.log('Age distribution:');
    console.log(ageDistribution);
  });
});