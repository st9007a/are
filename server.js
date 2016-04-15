var app = require('express')();
var express = require('express');
var http = require('http').Server(app);
var bodyParser = require('body-parser');

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static(__dirname + '/public'));


app.post('/hw', function(req, res){
    console.log(req.body);
    if(req.body.id == 'e24026551'){
	    res.send('吳哲銘')
	}
	else if(req.body.id == 'c54036071'){
	    res.send('史蕓瑄')
	}
	else if(req.body.id == 'f74034025'){
	    res.send('郭子瑋')
	}
	else{
	    res.send('not found');
	}
});
app.get('/', function(req, res){
    res.sendfile('public/index.html');
});
app.get('/hw', function(req, res){
    res.sendfile('public/hw.html');
});
http.listen(8011);
