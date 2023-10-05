// eslint-disable-next-line no-undef
const express = require('express');
const app = express();
const port = 3000;
// eslint-disable-next-line no-undef
const db = require('./database/sqlite.js');
// eslint-disable-next-line no-undef
const runSeed = require('./seeder');




app.get('/', (req, res) => {
  try {
    let database = db.getConnection();
    if (database) {
      res.send('Connected to SQLite!');
    } else {
      res.send('No connection...');
    }
  } catch (error) {
    res.send('Error connecting..');
  }
});

app.listen(port, () => {
  db.initializeDB((err) => {
    if (err) {
      console.log('Failed to connect to SQLite:', err);
    } else {
      console.log(`App listening on port ${port}`);
      runSeed('questions.sql', () => {
        console.log('questions.sql seeded');
      })
    }
  });
});






//npm install axios
// axios: library for making HTTP requests from Vue to
// an express backend

//npm install cors
// (cross-origin resource sharing)
// used as a middleware in an express server