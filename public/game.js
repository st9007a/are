function getLeafletOnLevel2(){
	$.ajax({
		type : 'post',
		url : '/backpack',
		data : {
			id : 'st9007a'
			parameter : 1,
			object : 'Leaflet'
		},
		success : function(data){
			//修改遊戲階段
			$.cookie('gameStage', 1);
			
			//背包操作~
		},
		error : function(err){
			console.log(err);
		}
	});
}
function game(){
	if ($.cookie('story') != 1 && $.cookie('storyStage') == 2 && $.cookie('gameStage') == 0){
		getLeafletOnLevel2();
	}
}
