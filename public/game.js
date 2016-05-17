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
			$.cookie('story', {expire: -1});
			

		},
		error : function(err){
			console.log(err);
		}
	});
});

setInterval(function(){
	$.getScript('story.js', function(){
		getCoords(function(position){
			longitude = position.coords.longitude;
			latitude = position.coords.latitude;
		});
	});
}, 1000);

function game(){
	
	
	if($.cookie('storyStage') == 2&& $.cookie('gameStage') == 0&& $.cookie('story') != 1){
		$.cookie('story',1);
		//飛入效果
		$('#giveLeaflet').slideDown(1000, function(){
			$('#giveLeaflet').hide();
			$.cookie('gameStage', 1);
			id_game_interval = setInterval(game, 1000);
		});
	}
	if($.cookie('storyStage') == 2&& $.cookie('gameStage') == 1&& (longitude > 115 && longitude < 125)&& (latitude > 18 && latitude < 25)){
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
		$.cookie('story', {expire : -1});
		$.cookie('gameStage', 3);
	}
};
