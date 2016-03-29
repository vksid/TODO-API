var express = require('express');
var bodyParser = require('body-parser');
var _ = require('underscore');
var db = require('./db.js');

var app = express();
var PORT = 3000;
var todos = [];
var todoNextId = 1;

app.use(bodyParser.json());

app.delete('/todos/:id', function (req, res) {
    var todoid = parseInt(req.params.id, 10);
    
    var matchedtodo = _.findWhere(todos, {id : todoid});
    
    if(!matchedtodo){
        res.status(404).json({"error" : "no todo found with that id"});
    }else{
        todos = _.without(todos, matchedtodo);
        res.json(matchedtodo);
    }
})

app.put('/todos/:id', function (req, res) {
    var todoid = parseInt(req.params.id, 10);
    var body = _.pick(req.body, 'description', 'completed');
    var matchedtodo = _.findWhere(todos, {id : todoid});
    var validAttribute ={};
    
    if(!matchedtodo){
        return res.status(404).send();
    }
    
    if(body.hasOwnProperty('completed') && _.isBoolean(body.completed)){
        validAttribute.completed = body.completed;
    } else if (body.hasOwnProperty('completed') ){
        return res.status(400).send();
    }
    
    if(body.hasOwnProperty('description') && _.isString(body.description) && body.description.trim().length > 0){
        validAttribute.description = body.description;
    } else if(body.hasOwnProperty('description')){
        return res.status(400).send();
    }
    
    _.extend(matchedtodo, validAttribute);
    res.json(matchedtodo);
})

app.post('/todos', function (req, res) {
    var body = _.pick(req.body, 'description', 'completed');
    
    db.todo.create(body).then(function (todo) {
        res.json(todo.toJSON());
    }, function (error) {
        res.status(400).json(error);
    });
    
    // if(!_.isBoolean(body.completed) || !_.isString(body.description) || body.description.trim().length === 0)
    // {
    //    return res.status(400).send();
    // }
    
    
    // body.id = todoNextId++;
    // body.description = body.description.trim();
    // todos.push(_.pick(body,'id', 'description', 'completed')); 
    // res.json(body);
    
    
})

app.get('/', function (req, res) {
    res.send('TODO API Root');
})

app.get('/todos', function (req, res) {
    var queryParams = req.query;
    var filteredTodos = todos;
    
    if(queryParams.hasOwnProperty('completed') && queryParams.completed === 'true'){
        filteredTodos = _.where(filteredTodos, {completed : true});
    }else if(queryParams.hasOwnProperty('completed') && queryParams.completed === 'false'){
        filteredTodos = _.where(filteredTodos, {completed : false});
    }
    
    if(queryParams.hasOwnProperty('q') && queryParams.q.length > 0){
        filteredTodos = _.filter(filteredTodos, function(todo){
            return todo.description.toLowerCase().indexOf(queryParams.q.toLowerCase()) > -1;
        })
    }
    
    res.json(filteredTodos);
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

db.sequelize.sync().then(function (params) {
    app.listen(PORT, function () {
        console.log('Express Server Started');
    })
})

