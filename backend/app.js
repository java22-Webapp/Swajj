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
const askedQuestionsMultiplayer = [];
const roomState = {};
const roomAnswers = {};


let gameState = {
  isStarted: false
};

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
  console.log(`New connection with socket id: ${socket.id}`);

  socket.on("set-host-nickname", (nickname) => {
    socket.playerName = nickname;
    players.push(nickname);
    console.log("Host connected: ", socket.playerName);

  });

  io.emit("update-player-list", players);

  socket.on("newPlayer", (playerName) => {
    if (!players.includes(playerName)) {
      socket.playerName = playerName;
      players.push(playerName);
      console.log("A new player connected: ", socket.playerName);
      io.emit("update-player-list", players);
    }
  });

  // Let clients/users the game room
  socket.on("joinRoom", (roomId) => {
    socket.join(roomId);
    socket.roomId = roomId;
    console.log(`Socket ${socket.id} joined room ${roomId}`);
  });

  // Frontend uses this to get a newQuestion
  socket.on("requestNewQuestion", () => {
    fetchNewQuestion(socket.roomId);
  });

  socket.on('timer-expired', (roomId) => {
    console.log("IN TIMER-EXPIRED BACKEND")

    if (!roomAnswers[roomId]) {
      roomAnswers[roomId] = [];
    }

    roomAnswers[roomId].push({ clientId: socket.id, answerIndex: -1 })


    if (roomAnswers[roomId].length === io.sockets.adapter.rooms.get(roomId).size) {
      handleRoundCompletion(roomId);
    }
  })

  socket.on("user-selected-answer", (data) => {
    console.log("CALLING 'user-selected-answer' BACKEND");
    const { roomId, answerIndex } = data;

    const currentQuestion = roomState[roomId].currentQuestion;
    const isAnswerCorrect = currentQuestion.isCorrect[answerIndex] === 1;

    const clientsInRoom = io.sockets.adapter.rooms.get(roomId);
    const numberOfClients = clientsInRoom ? clientsInRoom.size : 0;

    socket.emit('answer-result', {
      correct: isAnswerCorrect,
      isCorrectArray: currentQuestion.isCorrect
    });

    if (!roomAnswers[roomId]) {
      roomAnswers[roomId] = [];
    }

    if (roomAnswers[roomId].some(answer => answer.clientId === socket.id)) {
      console.log(`Client ${socket.id} has already answered this round.`);
      return;
    }

    roomAnswers[roomId].push({ clientId: socket.id, answerIndex });

    if (roomAnswers[roomId] && roomAnswers[roomId].length === numberOfClients) {
        handleRoundCompletion(roomId)
    }
  });

  // Lobby leader is emitting(calling) this from LobbyMultiplayer.vue to start the game
  // Clients are listening (in InviteeView.vue) for the "gameStarted" emit with the corresponding roomId
  socket.on("startGame", (roomId) => {

    const clientsInRoom = io.sockets.adapter.rooms.get(roomId);
    const numberOfClients = clientsInRoom ? clientsInRoom.size : 0;

    console.log(`NUMBER OF CLIENTS IN ROOM ${roomId} : `, numberOfClients);

    if (!gameState.isStarted) {
      io.in(roomId).emit("gameStarted");
      gameState.isStarted = true;
    }
  });

  socket.on("disconnect", () => {
    if (socket.roomId) {
      console.log(`Socket ${socket.id} left room ${socket.roomId}`);
      if (roomAnswers[socket.roomId]) {
        roomAnswers[socket.roomId] = roomAnswers[socket.roomId].filter(answer => answer.clientId !== socket.id);
      }
      socket.leave(socket.roomId);
    }
  });
});

function handleRoundCompletion(roomId) {
  console.log("All clients have answered or the timer has run out!")
  setTimeout(() => {
    io.in(roomId).emit('round-completed');
    roomAnswers[roomId] = [];
  }, 2000);
}

// Get a single question per request. The idea is that we call this function each time we go to a new game round
function fetchNewQuestion(roomId) {
  const query = `SELECT id, question_text
                 FROM questions
                 WHERE id NOT IN (${askedQuestionsMultiplayer.join(",") || 0})
                 ORDER BY random()
                 LIMIT 1`;

  const answersQuery = "SELECT id, answers_text, is_correct FROM answers WHERE questions_id = ?";

  db.get(query, [], (error, question) => {
    if (error) {
      console.error("Failed to fetch question:", error.message);
      return;
    }

    db.all(answersQuery, [question.id], (error, answers) => {
      if (error) {
        console.error("Failed to fetch answers:", error.message);
        return;
      }

      askedQuestionsMultiplayer.push(question.id);

      const questionObject = {
        question: question["question_text"],
        answers: answers.map(a => a.answers_text),
        isCorrect: answers.map(a => a.is_correct),
        answerId: answers.map(a => a.id)
      };

      roomState[roomId] = {
        currentQuestion: questionObject
      };
      io.in(roomId).emit("new-question", questionObject);
    });
  });
}

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
});


// For single player only
app.get("/get-question", (req, res) => {
  const query = `SELECT id, question_text
                 FROM questions
                 WHERE mode_id = ?
                   AND language_id = ?
                   AND id NOT IN (${askedQuestions.join(",")})
                 ORDER BY random()
                 LIMIT 1`;
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
  gameState[uniqueRoomId] = { isStarted: false, players: [] };
  const gameLink = `http://localhost:5173/join/?roomId=${uniqueRoomId}`;
  res.json({ gameLink });
});


app.get("/join", (req, res) => {
  const roomId = req.query;
  res.send(`received room ID: ${roomId}`);
});

