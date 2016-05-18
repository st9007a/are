var id_game_interval;

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
function game(){

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

var time = 10;
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
		$('#timeBack').hide();
		$.cookie('story', '', {expires: -1});
		$.cookie('gameStage', 3);	
	}
};
