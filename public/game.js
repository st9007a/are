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
			
			//背包處理~~
		},
		error : function(err){
			console.log(err);
		}
	});
});