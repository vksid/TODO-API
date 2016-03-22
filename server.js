var express = require('express');
var app = express();
var PORT = 3000;
var todos = [{
    id : 1,
    description : "Meet Mom for lunch",
    completed : false
},{
    id : 2,
    description : "Get Some Fruits",
    completed : false
}, {
    id : 3,
    description : "See Lecture",
    completed : true
}];


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