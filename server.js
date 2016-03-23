var express = require('express');
var bodyParser = require('body-parser');
var _ = require('underscore');

var app = express();
var PORT = 3000;
var todos = [];
var todoNextId = 1;

app.use(bodyParser.json());

app.post('/todos', function (req, res) {
    var body = req.body;
    
    if(!_.isBoolean(body.completed) || !_.isString(body.description) || body.description.trim().length === 0)
    {
       return res.status(400).send();
    }
    
    
    body.id = todoNextId++;
    body.description = body.description.trim();
    todos.push(_.pick(body,'id', 'description', 'completed')); 
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
    var matchedtodo = _.findWhere(todos, {id: todoid});

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