var app = require('express')();
var express = require('express');
var http = require('http').Server(app);


app.use(express.static(__dirname + '/public'));
app.get('/', function(req, res){
    res.sendfile('public/index.html');
});
http.listen(8011);
