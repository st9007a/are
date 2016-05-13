function getLeafletOnLevel2(){
	$.ajax({
		type : 'post',
		url : '/backpack',
		data : {
			id : $.cookie('usrd'),
			parameter : 1,
			object : 'Leaflet'
		},
		success : function(data){
			//修改遊戲階段
			$.cookie('gameStage', 1);
			
			//前端背包操作~
		},
		error : function(err){
			console.log(err);
		}
	});
}
function lookLeafletOnLevel2(){
	$('#leaflet1').show();
}
function game(){
	if ($.cookie('story') != 1 && $.cookie('storyStage') == 2 && $.cookie('gameStage') == 0){
		getLeafletOnLevel2();
	}
	if($.cookie('story') != 1 && $.cookie('storyStage') == 3 && $.cookie('gameStage') == 1){
		lookLeafletOnLevel2();
	}
}
