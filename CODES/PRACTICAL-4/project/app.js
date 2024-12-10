var express = require('express');
var app = express();

app.get('/', function(req, res){
   res.send("Hello docker is running");
});

app.listen(3000);