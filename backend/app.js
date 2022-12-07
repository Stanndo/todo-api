const express = require('express');
// test
const db = require('./data/database');
const todoroutes = require('./routes/todo.routes');

const app = express();
const port = 3000;
app.use(express.json());

app.use('/todos', todoroutes);

app.use(function(error, req, res, next) {
    res.status(500).json({
        message: "Something went wrong!"
    });
});

db.initDb().then(function() {
    app.listen(port);
}).catch(function(error) {
    console.log("Connecting to the database failed!");
})


