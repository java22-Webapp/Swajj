const express = require('express');
const app = express();
const port = 3000;
const db = require('./database/sqlite.js');
const runSeed = require('./seeder');
const cors = require('cors');

app.use(cors());

app.get('/', (req, res) => {
  try {
    let database = db.getConnection();
    if (database) {
      res.send('Connected to SQLite!');
    } else {
      res.send('No connection...');
    }
} catch (error) {
    console.error(error);
    res.send('Error connecting..');
  }
});

function populateDatabase() {
  runSeed('modes.sql', () => {
  });
  runSeed('languages.sql', () => {
  });
  runSeed('questions.sql', () => {
  });
  runSeed('answers.sql', () => {
  });
}


app.get('/get-question', (req, res) => {
  const query = "SELECT id, question_text FROM questions ORDER BY random() LIMIT 1";
  const answersQuery = "SELECT answers_text FROM answers WHERE questions_id = ?";

  db.get(query, [], (error, question) => {
    if (error) {
      console.error("database error: ", error.message);
      return res.status(500).json({ error: error.message });

    }

    db.all(answersQuery, [question.id], (error, answers) => {
      if (error) {
        console.error("database error: ", error.message);
        return res.status(500).json({ error: error.message });
      }

      res.json({
        db_question: question["question_text"],
        db_answers: answers.map(a => a.answers_text)
      });
    })
  });
})

app.listen(port, () => {
  db.initializeDB((err) => {
    if (err) {
      console.log('Failed to connect to SQLite:', err);
    } else {
      console.log(`App listening on port ${port}`);
      populateDatabase();
    }
  });
})


