var app = require('express')();
var express = require('express');
var http = require('http').Server(app);
var bodyParser = require('body-parser');
var https = require('spdy');
var LEX = require('letsencrypt-express');
var fs = require('fs');
var child = require('child_process');
var sha1 = require('sha1');

var mongoose = require('mongoose');
var USER_PASSWD = process.argv[2];

var lex = LEX.create({
	configDir: require('os').homedir() + '/letsencrypt/etc'
	, approveRegistration: function (hostname, cb) { // leave `null` to disable automatic registration
		// Note: this is the place to check your database to get the user associated with this domain
		cb(null, {
			domains: [hostname]
			, email: 'st9007a@gmail.com' // user@example.com
			, agreeTos: true
		});
	}
});

app.use(express.static(__dirname + '/public'));

lex.onRequest = app;


https.createServer(lex.httpsOptions, LEX.createAcmeResponder(lex, app)).listen(8012);
app.use(bodyParser.json({limit: '50mb'}));
app.use(bodyParser.urlencoded({ extended: true , limit: '50mb'}));
app.use(express.static(__dirname + '/public'));
mongoose.connect('mongodb://groupA:'+USER_PASSWD+'@localhost/groupA' , function(){
	console.log('database connect');
});

var db = mongoose.connection;

db.on('error', function (err) {
	console.log('connection error', err);
});
db.once('open', function () {

    var Schema = mongoose.Schema;
	
	var storyData = new Schema({
		account: {type: String, unique : true},
		name : {type : String},
		hp : {type : Number},
		data : {type: Array},
		gameStage : {type: Number}
	});
	var storyCoords = new Schema({
		stage : {type : Number, unique : true},
		longitudeUpperBound : {type : Number},
		longitudeLowerBound : {type : Number},
		latitudeUpperBound : {type : Number},
		latitudeLowerBound : {type : Number}
	});
	
	var story = mongoose.model('story' , storyData);
	var storyCoord = mongoose.model('storyCoord', storyCoords);
	
	//主線NPC說話順序
	var storyOrder = [0,1,2,0,0,0,3,0,4,0,0,0,0];
	var storyHint = [[],[],[],[],[],[],[],[],[],[],[],[],[]];
	
	
	app.post('/login',function(req,res){
		//req = facebook user id
		var path = 'usr/'+sha1(req.body.id);
		var cp = child.spawn('mkdir',[path]);

		cp.stderr.on('data', function(buf) {
			console.log('[STR] stderr "%s"', String(buf));
		});

		new story({
			account : sha1(req.body.id).toString(),
			name : req.body.name,
			hp : 100,
			data : [1,0,0,0,0,0,0,0,0,0,0,0,0],
			gameStage : 0
		}).save();
		console.log(req.body);
		res.send(sha1(req.body.id).toString());
	});
	
	app.post('/getPlayerData', function(req,res){
		story.findOne({account:req.body.id}, function(error, result){
			if(result != null){
				
				var storyStage;
				for(i=0;i<result.data.length;i++){
					if(result.data[i] == 1&& (result.data[i+1] == 0 || result.data[i+1]==undefined)){
						storyStage = i;
						break;
					}
				}
				var data = {
					name : result.name,
					storyStage : i,
					gameStage : result.gameStage,
					hp : result.hp
				};
				res.send(data);
				
			}
		});
	});
	
	//讀NPC說話的內容
	app.post('/content', function(req, res){
		
		//遊戲階段
		var gameStage;
		
	    //讀使用者的故事進度資料
	    story.findOne({account:req.body.account} , function(error, result){
		    if(result != null){
			    var data = result.data;        //故事進度
				var fileName = req.body.id;    //要讀取的文字檔檔名
				
				//檢查故事進度到哪個階段
				for(i=0;i<data.length;i++){
				    //讀取主線劇情
				    if(data[i-1] == 1 &&data[i] == 0){
					    //故事進度與主線NPC符合
						if(storyOrder[i] == req.body.id ){
							
							//儲存遊戲階段
							gameStage = i;
							
							//文字檔檔名改成主線劇情的文字檔
							fileName = i+'main';

							//故事進度推進
							data[i] = 1;	
								
							//更新使用者的故事進度
							story.update({account:req.body.account}, {$set:{data:data}}, function(){
								console.log({account : result.account , Event : 'update to stage' + i});
							});							
													
						}
						//提示NPC的判定
						else{
							//儲存遊戲階段
							gameStage = (i-1);
							
						    for(j=0;j<storyHint[i].length;j++){
							    //如果id有存在該階段的提示裡
							    if(req.body.id == storyHint[i][j]){
								
								    //檔名改成提示用NPC的文字檔(檔名為 : "階段"-"NPCID"hint)
								    fileName = i + '-' + req.body.id + 'hint';
									break;
								}
							}
						}
						break;
					}
				}
				//讀取文字檔
				fs.readFile('public/npccontent/'+fileName+'.txt', function(err, data){
						
					if(err){
						console.log(err);
						res.send('read file error');
					}
					else{
						var storyContent = {
							stage : gameStage,
							content : data.toString()
						}; 
						res.send(storyContent);
					}
				});
								
            }			
		});	
	});
	
	app.post('/triggerContent', function(req, res){
		story.findOne({account:req.body.account} , function(error, result){
			
		    if(result != null){
			    var data = result.data;        //故事進度
				var fileName = req.body.id;    //要讀取的文字檔檔名
				var progress;                  //故事進度第' ? '階段

				//檢查故事進度到哪個階段
				for(i=0;i<data.length;i++){
					
				    //讀取主線劇情
				    if(data[i-1]==1 && data[i]==0){	    
						progress = i;
						break;
					}
				}
				
				//故事進度與主線NPC符合
				if(storyOrder[progress] == req.body.id ){	
					
					storyCoord.findOne({
						longitudeUpperBound : {$gte : req.body.longitude},
						longitudeLowerBound : {$lte : req.body.longitude},
						latitudeUpperBound : {$gte : req.body.latitude},
						latitudeLowerBound : {$lte : req.body.latitude},
						stage : progress
					}, 
					function(err, resu){
						if(resu.stage == progress){	
							fileName = progress+'main';
							//故事進度推進
							data[progress] = 1;
										
							//更新使用者的故事進度
							story.update({account:req.body.account}, {$set:{data:data}}, function(){
								console.log({account : result.account , Event : 'update to stage' + progress});
							});			
							fs.readFile('public/npccontent/'+fileName+'.txt', function(err, data){
								if(err){
									console.log(err);
									res.send('read file error');
								}
								else{
									var storyContent = {
										stage : progress,
										content : data.toString()
									};
									res.send(storyContent);
								}
							});				
						}
						else{
							res.send(false);
						}
					});
													
				}	
				else{
					res.send(false);
				}
            }			
		});
	});
	
	
});

app.post('/img',function(req,res){
	
	
	var imgData = req.body.img;                                            //取得base64編碼
	var base64Data = imgData.replace(/^data:image\/\w+;base64,/, "");      //過濾編碼
	var dataBuffer = new Buffer(base64Data, 'base64');                     //將編碼放入buffer

	//將buffer存成png檔
	fs.writeFile('public/cv/'+req.body.imgName+'.png', dataBuffer, function(err) {
		//儲存失敗回傳錯誤訊息
		if(err){
			console.log(err);
		    res.send(err);
		}else{
			/*
			//儲存成功進入圖形比對
			//呼叫child.cpp
			var cp = child.spawn('./child',[]);
		    
			//輸入檔案路徑給child.cpp
		    cp.stdin.write(new Buffer('usr/'+req.body.name+'/'+req.body.imgName+'\n'));
		    cp.stdin.write(new Buffer('public/img/'+req.body.imgName));
		    cp.stdin.end();
			
			//接收child.cpp輸出的資料
		    cp.stdout.on('data',function(data){
				//刪除使用者存的圖片
				var rm = child.spawn('rm', ['usr/'+req.body.name+'/'+req.body.imgName]);
				
				//回傳判斷結果
				if(data.toString()=='1'){
					res.send(true);
				}
				else{
					res.send(false);
				}//res.send(data.toString());
				
		    });
			
			//錯誤處理
			cp.stderr.on('data',function(data){
				var rm = child.spawn('rm', ['usr/'+req.body.name+'/'+req.body.imgName]);
				res.send('error on ./child');
			});
			*/
			res.send('success');
		}
	});
});



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
    res.sendfile('public/fin.html');
});
app.get('/hw', function(req, res){
    res.sendfile('public/hw.html');
});
app.get('/game', function(req, res){
    res.sendfile('public/game.html');
});
app.get('/about', function(req, res){
    res.sendfile('public/about.html');
});
app.get('/story', function(req, res){
	res.sendfile('public/story.html');
});
app.get('/snap', function(req,res){
	res.sendfile('public/snop.html');
});
