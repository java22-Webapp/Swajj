const express = require('express');
const app = express();
const port= 3000;
const db = require('./database/mySql.js')

app.get('/', async (req, res) => {
    try {
        db.getConnection();
        res.send('Hello World!');
    } catch (error){
        res.send('Error connecting..')
    }
});

app.listen(port, async () => {
    console.log('App listening on port ${port}');
    try {
        await db.initializeDB();
    } catch (error){
        console.log('Failed to connect...')
    }
});

//const cors to allow requests from other URL's
//const socketIO
//const server = http.createServer(app))
