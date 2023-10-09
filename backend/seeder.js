const fs = require('fs');
const path = require('path');
const db = require('./database/sqlite');

function runSeed(seedName, callback) {
  const seedPath = path.join(__dirname, 'seeds', seedName);
  const seedContent = fs.readFileSync(seedPath, 'utf-8');

  const database = db.getConnection();
  const sqlCommands = seedContent.trim().split('\n');

  sqlCommands.forEach((command) => {
    database.serialize(() => {
      database.run(command);
    });
  });

  callback();
}

module.exports = runSeed;
