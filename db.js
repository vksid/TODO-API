var sequelize = require('sequelize');
var env = process.env.NODE_ENV || 'development';
var sql;

if (env === 'production'){
    sql = new sequelize(process.env.DATABASE_URL, {
        dialect : 'postgres'
    });
} else {
    sql = new sequelize(undefined, undefined, undefined, {
        'dialect' : 'sqlite',
        'storage' : __dirname + '/data/dev-todo-api.sqlite'
    });
}



var db = {};

db.todo = sql.import(__dirname + '/models/todo.js');
db.sequelize = sql;
db.Sequelize = sequelize;

module.exports = db;