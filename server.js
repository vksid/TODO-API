var express = require('express');
var bodyParser = require('body-parser');
var _ = require('underscore');
var db = require('./db.js');
var bcrypt = require('bcryptjs');

var app = express();
var PORT = process.env.PORT || 3000;

app.use(bodyParser.json());

app.delete('/todos/:id', function (req, res) {
    var todoid = parseInt(req.params.id, 10);
    
    db.todo.destroy({
        where : {
            id : todoid
        }
    }).then(function (rowsDeleted) {
        
        if(rowsDeleted === 0){
            res.status(404).json({
                error : 'No todo with id'
            });
        } else {
            res.status(204).send();
        }
        
    }, function (error) {
        res.status(500).send();
    }) 
})

app.put('/todos/:id', function (req, res) {
    var todoid = parseInt(req.params.id, 10);
    var body = _.pick(req.body, 'description', 'completed');
    var attribute ={};
    
    if(body.hasOwnProperty('completed')){
        attribute.completed = body.completed;
    }
    
    if(body.hasOwnProperty('description')){
        attribute.description = body.description;
    }
    
    db.todo.findById(todoid).then(function (todo) {
        
        if(todo){
            return todo.update(attribute).then(function (todo) {
                    res.json(todo.toJSON());
                }, function (error) {
                    res.status(400).json(error);
                });
        } else{
            res.status(404).send();
        }
        
    }, function(error) {
        res.send(500).send();
    })
})

app.post('/todos', function (req, res) {
    var body = _.pick(req.body, 'description', 'completed');
    
    db.todo.create(body).then(function (todo) {
        res.json(todo.toJSON());
    }, function (error) {
        res.status(400).json(error);
    });
})

app.post('/users', function (req, res) {
    var body = _.pick(req.body, 'email', 'password');
    
    db.user.create(body).then(function (user) {
        res.json(user.toPublicJSON());
    }, function (error) {
        res.status(400).json(error);
    })
})

app.post('/users/login', function (req, res) {
    var body = _.pick(req.body, 'email', 'password');
    
    db.user.authenticate(body).then(function (user) {
        res.json(user.toPublicJSON());
    }, function (e) {
        res.status(401).send();
    })
})

app.get('/', function (req, res) {
    res.send('TODO API Root');
})

app.get('/todos', function (req, res) {
    var query = req.query;
    var where = {};
    
    if(query.hasOwnProperty('completed') && query.completed === 'true'){
        where.completed = true;
    } else if(query.hasOwnProperty('completed') && query.completed === 'false'){
        where.completed = false;
    }
    
    if(query.hasOwnProperty('q') && query.q.length > 0){
        where.description = {
            $like : '%' + query.q + '%'
        };
    }
    
    db.todo.findAll({where: where}).then(function(todos){
        res.json(todos);
    }, function(error){
        res.status(500).send();
    });
})

app.get('/todos/:id', function (req, res) {
    var todoid = parseInt(req.params.id, 10);
    
    db.todo.findById(todoid).then(function (todo) {
        if(!!todo){
            res.json(todo.toJSON());
        }
        else{
            res.status(404).send();
        }
    }, function (error) {
        res.status(500).send();
    })
})

db.sequelize.sync({force : true}).then(function (params) {
    app.listen(PORT, function () {
        console.log('Express Server Started');
    })
})

