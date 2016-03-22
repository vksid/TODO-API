var express = require('express');
var app = express();
var PORT = 3000;

app.get('/', function (req, res) {
    res.send('TODO API Root');
})

app.listen(PORT, function () {
    console.log('Express Server Started');
})