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
let askedQuestions = [];
let askedQuestionsMultiplayer = [];
const roomState = {};
const roomAnswers = {};
const gameResults = {};

let gameState = {
  isStarted: false
};

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

  socket.on("set-host-nickname", (data) => {
    if(!gameResults[data.roomId]) gameResults[data.roomId] = [];
    const isHost = gameResults[data.roomId].length === 0; // true om det är den första användaren i rummet
    const newUser = {
      user_id: socket.id,
      score: 0,
      nickname: data.nickname,
      isHost
    };

    gameResults[data.roomId].push(newUser);
    socket.roomId = data.roomId;
    console.log("GAMERESULTS::: ", gameResults[data.roomId].map(user => user.nickname));
    socket.to(data.roomId).emit("update-player-list", gameResults[data.roomId].map(user => user.nickname));
    socket.emit("update-player-list", gameResults[data.roomId].map(user => user.nickname))
  });

  socket.on("send-update", (roomId) => {
    if (gameResults[roomId]) {
      socket.to(roomId).emit("update-player-list", gameResults[roomId].map(user => user.nickname));
      socket.emit("update-player-list", gameResults[roomId].map(user => user.nickname));
    }
  })

 /* socket.on("newPlayer", (data) => {
    if (!players.includes(data)) {
      socket.playerName = data;
      players.push(playerName);
      console.log("A new player connected: ", socket.playerName);
      io.emit("update-player-list", players);
    }
  });*/

  // Let clients/users the game room
  socket.on("joinRoom", (roomId) => {
    socket.join(roomId);
    socket.roomId = roomId;
    console.log(`Socket ${socket.id} joined room ${roomId}`);
  });

  // Frontend uses this to get a newQuestion
  socket.on("requestNewQuestion", () => {
    if (gameResults[socket.roomId]) {
      const userIndex = gameResults[socket.roomId].findIndex(user => user.user_id === socket.id);
      if (userIndex !== -1) {
        gameResults[socket.roomId][userIndex].hasAnswered = false;
      }
    }
    io.in(socket.roomId).emit("update-answers-status", gameResults[socket.roomId]);
    fetchNewQuestion(socket.roomId);
  });

  socket.on("timer-expired", (roomId) => {
    console.log("IN TIMER-EXPIRED BACKEND");

    if (!roomAnswers[roomId]) {
      roomAnswers[roomId] = [];
    }

    roomAnswers[roomId].push({ clientId: socket.id, answerIndex: -1 });

    if (roomAnswers[roomId].length === io.sockets.adapter.rooms.get(roomId).size) {
      handleRoundCompletion(roomId);
    }
  });

  socket.on("user-selected-answer", (data) => {
    console.log("CALLING 'user-selected-answer' BACKEND");
    const { roomId, answerIndex } = data;

    const currentQuestion = roomState[roomId].currentQuestion;
    const isAnswerCorrect = currentQuestion.isCorrect[answerIndex] === 1;

    const clientsInRoom = io.sockets.adapter.rooms.get(roomId);
    const numberOfClients = clientsInRoom ? clientsInRoom.size : 0;


    const userIndex = gameResults[roomId].findIndex(user => user.user_id === socket.id)
    if (userIndex !== -1) {
      gameResults[roomId][userIndex].hasAnswered = true;
    }

    io.in(roomId).emit("update-answers-status", gameResults[roomId]);

    socket.emit("answer-result", {
      correct: isAnswerCorrect,
      isCorrectArray: currentQuestion.isCorrect
    });


    if(!gameResults[roomId]) gameResults[roomId] = [];

    let existingUserIndex = gameResults[roomId].findIndex(user => user.user_id === socket.id);

    if (existingUserIndex === -1) {
      console.log("GAMERESULTS::: ", gameResults);
      existingUserIndex = gameResults[roomId].findIndex(user => user.user_id === socket.id);
    }

    if (isAnswerCorrect) {
      gameResults[roomId][existingUserIndex].score = gameResults[roomId][existingUserIndex].score + 1;
      console.log("GAMERESULTS SCORE::: ", gameResults);
    }

    if (!roomAnswers[roomId]) {
      roomAnswers[roomId] = [];
    }

    if (roomAnswers[roomId].some(answer => answer.clientId === socket.id)) {
      console.log(`Client ${socket.id} has already answered this round.`);
      return;
    }

    roomAnswers[roomId].push({ clientId: socket.id, answerIndex });

    if (roomAnswers[roomId] && roomAnswers[roomId].length === numberOfClients) {
      handleRoundCompletion(roomId);
    }
  });

  console.log("Waiting for request-results");

  socket.on("request-results", (roomId) => {
    console.log("GAMERESULTS - ROOM ID::: ", gameResults[roomId]);
    socket.emit("results-for-room", gameResults[roomId]);
  })

  // Lobby leader is emitting(calling) this from LobbyMultiplayer.vue to start the game
  // Clients are listening (in InviteeView.vue) for the "gameStarted" emit with the corresponding roomId
  socket.on("startGame", (data) => {
    if (!data || !data.roomId || !data.settings) {
      console.log("Missing data for startGame event: ", data);
      return;
    }

    const { roomId, settings } = data;

    if (!roomState[roomId]) {
      roomState[roomId] = { isStarted: false, players: [], settings: {} };
    }

    roomState[roomId].settings = settings;

    const clientsInRoom = io.sockets.adapter.rooms.get(roomId);
    const numberOfClients = clientsInRoom ? clientsInRoom.size : 0;

    console.log(`NUMBER OF CLIENTS IN ROOM ${roomId} : `, numberOfClients);

    if (!roomState[roomId].isStarted) {
      io.to(data.roomId).emit("gameStarted", data.settings);
      roomState[roomId].isStarted = true;
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
  console.log("All clients have answered or the timer has run out!");
  setTimeout(() => {
    io.in(roomId).emit("round-completed");
    roomAnswers[roomId] = [];
  }, 2000);
}

// Get a single question per request. The idea is that we call this function each time we go to a new game round
function fetchNewQuestion(roomId) {

  if (!roomState[roomId]) {
    console.log(`No state found for room ID: ${roomId}`);
    return;
  }

  const roomSettings = roomState[roomId].settings;
  if (!roomSettings) {
    console.log(`No settings found for room ID: ${roomId}`);
    return;
  }

  console.log("MODE: ", roomSettings.kidsMode);
  console.log("LANGUAGE: ", roomSettings.english)
  console.log("ROUNDS: ", roomSettings.rounds)
  console.log("TIME: ", roomSettings.time)

  const query = `SELECT id, question_text
                 FROM questions
                 WHERE mode_id = ?
                   AND language_id = ?
                   AND id NOT IN (${askedQuestionsMultiplayer.join(",") || 0})
                 ORDER BY random()
                 LIMIT 1`;

  const answersQuery = "SELECT id, answers_text, is_correct FROM answers WHERE questions_id = ?";

  db.get(query, [roomSettings.kidsMode, roomSettings.english], (error, question) => {
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

      roomState[roomId].currentQuestion = questionObject;
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


// we can remove the callbacks here
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
  console.log("Received req to /play-again");
  askedQuestions = [];
  res.status(200).end();
});

app.get("/play-again-multiplayer", (req, res) =>{
  console.log("RESCIVED fom ::: play-again-multiplayer")
  askedQuestionsMultiplayer = [];
  res.status(200).end();

})


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

