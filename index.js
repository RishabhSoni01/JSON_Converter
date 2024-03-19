const express = require('express');
const fs = require('fs');
const path = require('path');
require('dotenv').config();
const User = require('./user');

const app = express();
const port = process.env.PORT || 3000;
const csvFilePath = process.env.CSV_FILE_PATH;
const jsonFilePath = path.join(process.cwd(), 'output.json');

// Route to handle CSV to JSON conversion and database operations
app.get('/', async (req, res) => {
  try {
    const users = await readCSVAndConvertToJSON();
    await processJSONData(users);
    res.send('Data insertion process completed.');
  } catch (error) {
    console.error('Error:', error);
    res.status(500).send('Internal Server Error');
  }
});

// Function to read CSV, convert to JSON, and return JSON data
async function readCSVAndConvertToJSON() {
  return new Promise((resolve, reject) => {
    fs.readFile(csvFilePath, 'utf-8', (err, data) => {
      if (err) {
        reject(err);
        return;
      }

      const rows = data.trim().split('\n');
      const headers = rows[0].split(',');
      const users = [];

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
        }

        users.push(user);
      }

      fs.writeFile(jsonFilePath, JSON.stringify(users, null, 2), (err) => {
        if (err) {
          reject(err);
          return;
        }

        console.log('CSV data successfully converted to JSON format and saved to output.json');
        resolve(users);
      });
    });
  });
}

// Function to process JSON data and perform database operations
async function processJSONData(users) {
  try {
    const user = new User();
    await user.createTable();
    await user.insertData(users);
  } catch (error) {
    throw error;
  }
}

// Start the server
app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
