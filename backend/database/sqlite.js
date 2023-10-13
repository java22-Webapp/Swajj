function get(query, params, callback) {
  db.get(query, params, (error, row) => {
    callback(error, row);
  });
}

function all(query, params, callback) {
  db.all(query, params, (error, row) => {
    callback(error, row);
  });
}


const sqlite = require('sqlite3').verbose();
let db;


function initializeDB(callback) {
  db = new sqlite.Database('./backend/database.sqlite', (error) => {
    if (error) return callback(error);
    console.log('Connected to the SQLite database.');
    createTables(callback);
  });
}

function getConnection() {
  return db;
}


module.exports = {
  initializeDB,
  getConnection,
  get,
  all
};

function createTables(callback) {
  const createModeTable = `CREATE TABLE IF NOT EXISTS modes
                           (
                               id   INTEGER PRIMARY KEY,
                               name TEXT NOT NULL
                           );`;

  const createLanguageTable = `CREATE TABLE IF NOT EXISTS languages
                               (
                                   id   INTEGER PRIMARY KEY,
                                   name TEXT NOT NULL
                               );`;

  const createQuestionsTable = `CREATE TABLE IF NOT EXISTS questions
                                (
                                    id            INTEGER PRIMARY KEY,
                                    mode_id       INTEGER,
                                    language_id   INTEGER,
                                    question_text TEXT NOT NULL,
                                    FOREIGN KEY (mode_id) REFERENCES modes (id),
                                    FOREIGN KEY (language_id) REFERENCES languages (id)
                                );`;

  const createAnswersTable = `CREATE TABLE IF NOT EXISTS answers
                              (
                                  id           INTEGER PRIMARY KEY,
                                  questions_id INTEGER,
                                  answers_text TEXT    NOT NULL,
                                  is_correct   BOOLEAN NOT NULL DEFAULT 0,
                                  FOREIGN KEY (questions_id) REFERENCES questions (id)
                              );`;

  db.serialize(() => {
    db.run(createModeTable);
    db.run(createLanguageTable);
    db.run(createQuestionsTable);
    db.run(createAnswersTable, callback);
  });
}
