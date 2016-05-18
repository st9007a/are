navigator.vibrate = navigator.vibrate|| navigator.webkitVibrate|| navigator.mozVibrate|| navigator.msVibrate;


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
	$.cookie('gameStage', 3);
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