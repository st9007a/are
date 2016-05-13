function showContent(data){
	//字串分割
	var contentSplit = data.split('\n');	
	$('#overlay').show();    //顯示overlay
	$('#frame').show();	     //顯示對話框
			
	//打字
	$('#type').typed({
		strings : [contentSplit[0]],
		typeSpeed : 30,
		loop : false
	});	
			
	console.log(contentSplit[0]); 
			
	//移掉以輸出的內容
	contentSplit.shift();
	//其餘內容存進cookie
	$.cookie('content', contentSplit.join('\n'));	
			
}
$('.npc').click(function (){
    var NPCID = $(this).attr('data-id');
	
	//story = true的狀況下 , 無法跳出其他對話框
	$.cookie('story', 1);
	
	$('#type').typed('reset');
	$.ajax({
		data : {
			account : $.cookie('usrd'),
			id : NPCID
		},
		url : 'content',
		type : 'post',
		success : function(data){
			
			//cookie內存入故事進展階段
			$.cookie('storyStage', data.stage);
			
			//顯示出拿到的文字內容
			showContent(data.content);	
		},
		error : function(){
			console.log('error : can not get story content');
		}
	});
				
});	
$('#overlay').click(function(){	

	//cookie裡沒有文字內容就刪掉該cookie
	if($.cookie('content') == ''){
		
		//刪除cookie
		$.cookie('content',  '', { expires: -1 });	 
		$.cookie('story', '', {expire: -1});         
		
		$('#overlay').hide();           //隱藏overlay
		$('#frame').hide();  		//隱藏對話框   
		$('#type').typed('reset');      
	}
	//cookie裡有文字內容則顯示下一段內容
	else{
	    $('#type').typed('reset');
		
		//取出cookie的內容並且分割
	    var contentSplit = $.cookie('content').split('\n');
		
		//打字
		$('#type').typed({
			strings : [contentSplit[0]],
			typeSpeed : 30,
			loop : false
		});		
		console.log(contentSplit[0]);
		
		//移掉已輸出的內容
		contentSplit.shift();
		
		//存進cookie
		$.cookie('content', contentSplit.join('\n'));
	}
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
				console.log("error to get position at story.js");
				callback(false);
			},
			option
		);
	}
}
//跳出對話框確認
setInterval(function(){
	getCoords(function(position){
		if($.cookie('story') != 1){
			$.ajax({
				type : 'POST',
				url : '/triggerContent',
				data : {
					account : $.cookie('usrd'),
					id : 0,
					longitude : position.coords.longitude,
					latitude : position.coords.latitude
				},
				success : function(data){
					
					if(data != false){
						//cookie內存入故事進展階段
						$.cookie('storyStage', data.stage);
						
						//顯示出拿到的文字內容
						showContent(data.content);
					}
				},
				error : function(){
					console.log('error : can not get story content');
				}
			});
		}
	});
},1000);

