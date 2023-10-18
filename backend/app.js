const express = require("express");
const app = express();
const port = 3000;
const db = require("./database/sqlite.js");
const runSeed = require("./seeder");
const cors = require("cors");

const { v4: uuidv4 } = require("uuid");
const http = require("http");

const socketIo = require("socket.io");
const server = http.createServer(app);

const askedQuestions = [];

let players = [];

const corsOptions = {
  origin: "*",
  methods: ["GET", "POST", "PATCH", "DELETE", "PUT", "HEAD"],
  credentials: true,
  optionsSuccessStatus: 204
};

const io = socketIo(server, {
  cors: {
    origin: "*",
    methods: ["GET", "POST"],
    credentials: true,
    transports: ["websocket", "polling"]
  }
});

app.use(cors(corsOptions));

io.on("connection", (socket) => {

  socket.on('set-host-nickname', (nickname) => {
    socket.playerName = nickname;
    players.push(nickname);
    console.log("Host connected: ", socket.playerName);

  })

    io.emit('update-player-list', players);


  socket.on("newPlayer", (playerName) => {
    socket.playerName = playerName;
    players.push(playerName);
    console.log(players);
    console.log("A user connected", socket.playerName);
    io.emit("update-player-list", players);
  });

  socket.on("disconnect", () => {
    players = players.filter(p => p !== socket.playerName);
    io.emit("update-player-list", players);
  });
});


app.get("/", (req, res) => {
  try {
    let database = db.getConnection();
    if (database) {
      res.send("Connected to SQLite!");
    } else {
      res.send("No connection...");
    }
  } catch (error) {
    console.error(error);
    res.send("Error connecting..");
  }
});

function populateDatabase() {
  runSeed("modes.sql", () => {
  });
  runSeed("languages.sql", () => {
  });
  runSeed("questions.sql", () => {
  });
  runSeed("answers.sql", () => {
  });
}

app.get("/play-again", (req, res) => {
  console.log("Recieved req to /play-again");
  askedQuestions.length = 0;
  res.status(200).end();
})

app.get("/get-question", (req, res) => {
  const query = `SELECT id, question_text FROM questions WHERE mode_id = ? AND language_id = ? AND id NOT IN (${askedQuestions.join(",")}) ORDER BY random() LIMIT 1`;
  const answersQuery = "SELECT id, answers_text, is_correct FROM answers WHERE questions_id = ?";

  let kidsMode = req.query.kidsMode;
  let english = req.query.english;

  db.get(query, [kidsMode, english], (error, question) => {
    if (error) {
      console.error("database error: ", error.message);
      return res.status(500).json({ error: error.message });
    }
    if (!question) {
      return res.status(404).send("No questions found");
    }

    askedQuestions.push(question.id);

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

server.listen(port, () => {
  db.initializeDB((err) => {
    if (err) {
      console.log("Failed to connect to SQLite:", err);
    } else {
      console.log(`App listening on port ${port}`);
      populateDatabase();
    }
  });
});

app.get("/generate-game-link", (req, res) => {
  const uniqueRoomId = uuidv4();
  const gameLink = `http://localhost:5173/join/?roomId=${uniqueRoomId}`;
  res.json({ gameLink });
});

app.get("/join", (req, res) => {
  const roomId = req.query;

  res.send(`received room ID: ${roomId}`);
});
