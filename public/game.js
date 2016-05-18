var longitude;
var latitude;
var id_game_interval;
navigator.vibrate = navigator.vibrate|| navigator.webkitVibrate|| navigator.mozVibrate|| navigator.msVibrate;

$(document).ready(function(){
	$.ajax({
		type : 'post',
		url : '/getPlayerData',
		data : {
			id : $.cookie('usrd')
		},
		success : function(data){
			$.cookie('storyStage', data.storyStage);
			$.cookie('gameStage', data.gameStage);
			$.cookie('story', '', {expires: -1});

		},
		error : function(err){
			console.log(err);
		}
	});
});
function getCoords(callback){
	if (navigator.geolocation) {
		var geo=navigator.geolocation;
		var option={
			enableAcuracy:true,
			maximumAge:0.5,
		};
		geo.getCurrentPosition(
			function(position){
				callback(position);
			},
			function(){
				console.log("error to get position ");
				callback(false);
			},
			option
		);
	}
};
setInterval(
	function(){
		getCoords(function(position){
			longitude = position.coords.longitude;
			latitude = position.coords.latitude;
		});
	}
, 1000);

function game(){
	
	/////////////////////////////
	//要設置一個queue
	/////////////////////////////
	if($.cookie('storyStage') == 2&& $.cookie('gameStage') == 0&& $.cookie('story') != 1){
		
		$.cookie('story',1);
		console.log($.cookie('storyStage').toString()+$.cookie('gameStage').toString()+$.cookie('story').toString());
		//飛入效果
		$('#giveLeaflet').slideDown(2000, function(){
			
			$('#giveLeaflet').hide();
			$.cookie('gameStage', 1);
			id_game_interval = setInterval(game, 1000);
			
		});
	}
	if($.cookie('storyStage') == 2&& $.cookie('gameStage') == 1&& (longitude > 115 && longitude < 125)&& (latitude > 18 && latitude < 25)){
		console.log('123');
		clearInterval(id_game_interval);
		$.cookie('gameStage', 2);
		//飛入效果
		$('#leaflet').show();
	}
	if($.cookie('storyStage') == 3&& $.cookie('gameStage') == 2&& $.cookie('story') != 1){
		$.cookie('story', 1);
		$('#timeBack').show();
		timeBack();
	}
	if($.cookie('storyStage') == 4&& $.cookie('gameStage') == 3&& $.cookie('story') != 1){
		$.cookie('story', 1);
		$('#inputPwd').show();
	}
};

var time = 180;
function timeBack(){
	if(time > 0){
		time--;
		$('#timeBackLabel').html(time);
		setTimeout(timeBack, 1000);
	}
	else{
		if (navigator.vibrate) {
			navigator.vibrate(300);
		}
		$.cookie('story', '', {expires: -1});
		$.cookie('gameStage', 3);
	}
};
