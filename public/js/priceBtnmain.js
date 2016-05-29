


jQuery(document).ready(function($){
	var stat=false;
	var is_bouncy_nav_animating = false;
	//open bouncy navigation
	$('.cd-bouncy-nav-trigger').click(function(){
		$('#cover').show();
		//$('#prizeBtnhit').show();
		triggerBouncyNav(true);
		stat=true;
		
	});
	//$('.cd-bouncy-nav-trigger').mouseup(function(){
       // $('#prizeBtnhit').hide();
    //);
	
	//close bouncy navigation
	$('#cover').click( function(){
		$('#cover').hide();
		if(stat){
			triggerBouncyNav(false);
			stat = false;
		}
	});
	$('.cd-bouncy-nav-modal').click( function(event){
		if($(event.target).is('.cd-bouncy-nav-modal')) {
			triggerBouncyNav(false);
		}
	});

	
	
	function triggerBouncyNav($bool) {
		//check if no nav animation is ongoing
		if( !is_bouncy_nav_animating) {
			is_bouncy_nav_animating = true;
			
			//toggle list items animation
			$('.cd-bouncy-nav-modal').toggleClass('fade-in', $bool).toggleClass('fade-out', !$bool).find('li:last-child').one('webkitAnimationEnd oanimationend msAnimationEnd animationend', function(){
				$('.cd-bouncy-nav-modal').toggleClass('is-visible', $bool);
				if(!$bool) $('.cd-bouncy-nav-modal').removeClass('fade-out');
				is_bouncy_nav_animating = false;
			});
			
			//check if CSS animations are supported... 
			if($('.cd-bouncy-nav-trigger').parents('.no-csstransitions').length > 0 ) {
				$('.cd-bouncy-nav-modal').toggleClass('is-visible', $bool);
				is_bouncy_nav_animating = false;
			}
		}
	}
});