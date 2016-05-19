$('#leaflet1').click(function(){
	$('#leaflet1').fadeOut(500, function(){
		$('#leaflet2').fadeIn(500);
	});
});
$('#leaflet2').click(function(){
	$('#leaflet2').fadeOut(500, function(){
		$('#leaflet3').fadeIn(500);
	});
});
$('#leaflet3').click(function(){
	$('#leaflet3').hide();
	$.cookie('story', {expire : -1});
	$.cookie('gameStage', 2);
});

$('#checkPwd').click(function(){
	if($('#Pwd').val() == '0501'){
		$('#inputPwd').fadeOut(500, function(){
			$.cookie('story', '', {expires: -1});
			$.cookie('gameStage', 4);
			
		});
	}
	else{
		if (navigator.vibrate) {
			navigator.vibrate(300);
		}
		$('#Pwd').val('');
	}
});

var selectObj = [];
var ansObj = ['3select','5select'];
$('.obj').click(function(){
	var id = $(this).attr('id') + 'select';
	
	var a = selectObj.indexOf(id);
	
	if(a = -1){
		selectObj.push(id);
		$(id).show();
	}
	else{
		selectObj.splice(a, 1);
		$(id).hide();
	}
});
$('#checkSelect').click(function(){
	
	var ans = true;
	
	if(selectObj.length != ansObj.length){	
		ans = false;	
	}
	else{
		for(i=0;i<selectObj.length;i++){
			var a = ansObj.indexOf(selectObj[i]);
			if(a == -1){
				ans = false;
			}
		}
	}
	
	if(!ans){
		selectObj = [];
		$('.select').hide();
		
		//震動
		if (navigator.vibrate) {
			navigator.vibrate(300);
		}
	}
	else{
		$('.select').hide();
		$('#findObj').hide();
		$('#objData').show();
	}
});

$('#objDataBtn').click(function(){
	$('#objData').animate({
		bottom : '+='+screen.height+'px',
		left : '+='+screen.width+'px',
		opacity : '0'
	}, 
	500,
	function(){
		$('#objData').hide();
		$.cookie('gameStage', 6);
		
		//血條出問題
	});
});