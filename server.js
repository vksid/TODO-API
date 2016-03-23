var express = require('express');
var bodyParser = require('body-parser');

var app = express();
var PORT = 3000;
var todos = [];
var todoNextId = 1;

app.use(bodyParser.json());

app.post('/todos', function (req, res) {
    var body = req.body;
    body.id = todoNextId++;

    todos.push(body);
    res.json(body);
})

app.get('/', function (req, res) {
    res.send('TODO API Root');
})

app.get('/todos', function (req, res) {
    res.json(todos);
})

app.get('/todos/:id', function (req, res) {
    var todoid = parseInt(req.params.id, 10);
    var matchedtodo;
    
    todos.forEach(function(todo) {
        if (todo.id === todoid){
            matchedtodo = todo;
        }
    });
    
    if (matchedtodo){
        res.json(matchedtodo);
    }
    else{
        res.status(404).send();
    }
})

app.listen(PORT, function () {
    console.log('Express Server Started');
})