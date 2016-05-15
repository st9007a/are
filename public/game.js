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
};
function lookLeafletOnLevel2(){
	$('#leaflet').show();
};
var count = 0;
$('#te-next').click(function(){
	count ++ ;
	if(count>2){
		$('#leaflet').hide();
		$.cookie('gameStage', 2 );
		$.cookie('story', {expire: -1});
	}
});
function InputPasswordOnLevel2(){
	$('#pwdOn2').show();
};
$('#submitPwdOn2').click(function(){
	if($('#inputOn2').val() == '0501'){
		$.cookie('gameStage', 3);
		//答對
	}
	else{
		//答錯
	}
});
function getMoneyOnLevel2(){
	$.ajax({
		type : 'post',
		url : '/backpack',
		data : {
			id : $.cookie('usrd'),
			parameter : 1,
			object : 'Money'
		},
		success : function(data){
			//修改遊戲階段
			$.cookie('gameStage', 4);
			
			//前端背包操作~
		},
		error : function(err){
			console.log(err);
		}
	});
};
function game(){
	if ($.cookie('story') != 1 && $.cookie('storyStage') == 2 && $.cookie('gameStage') == 0){
		getLeafletOnLevel2();
	}
	if($.cookie('story') != 1 && $.cookie('storyStage') == 3 && $.cookie('gameStage') == 1){
		$.cookie('story', 1);
		lookLeafletOnLevel2();
	}
	if($.cookie('story') != 1 && $.cookie('storyStage') == 4 && $.cookie('gameStage') == 2){
		$.cookie('story', 1);
		InputPasswordOnLevel2();
	}
	if($.cookie('story') != 1 && $.cookie('storyStage') == 5 && $.cookie('gameStage') == 3){
		getMoneyOnLevel2();
	}
	
};
function saveData(){
	
}
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