var sequelize = require('sequelize');
var sql = new sequelize(undefined, undefined, undefined, {
    'dialect' : 'sqlite',
    'storage' : 'basic_sqlite.sqlite'
});

var todo = sql.define('todo', {
    description : {
        type : sequelize.STRING,
        allowNull : false,
        validate : {
            notEmpty : true,
            len : [1, 250]
        }
    },
    completed : {
        type : sequelize.BOOLEAN,
        allowNull : false,
        defaultValue : false
    }
})

sql.sync().then(function () {
    console.log('sync done!');
    
    todo.create({
        description : "Walk dog",
        completed : false
    }).then(function(todo){
        console.log('finished');
        console.log(todo);
    })
})