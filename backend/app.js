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
  const query = "SELECT id, question_text FROM questions WHERE mode_id = ? AND language_id = ? ORDER BY random() LIMIT 1";
  const answersQuery = "SELECT id, answers_text, is_correct FROM answers WHERE questions_id = ?";

  let kidsMode = req.query.kidsMode;
  let english = req.query.english;

  console.log(`kidsMode: ${kidsMode}, english: ${english}`);


  db.get(query, [kidsMode, english], (error, question) => {
    if (error) {
      console.error("database error: ", error.message);
      return res.status(500).json({ error: error.message });

    }

    if (!question) {
      return res.status(404).send("No questions found");
    }

    db.all(answersQuery, [question.id], (error, answers) => {
      if (error) {
        console.error("database error: ", error.message);
        return res.status(500).json({ error: error.message });
      }

      res.json({
        db_question: question["question_text"],
        db_answers: answers.map(a => a.answers_text),
        db_isCorrect: answers.map(a => a.is_correct),
        db_answerId: answers.map(a => a.id)
      });

    });
  });
});

app.listen(port, () => {
  db.initializeDB((err) => {
    if (err) {
      console.log('Failed to connect to SQLite:', err);
    } else {
      console.log(`App listening on port ${port}`);
      populateDatabase();
    }
  });
});


