$( document ).ready(function() {
    $("[rel='tooltip']").tooltip();    
 
    $('.thumbnail').hover(
        function(){
            $(this).find('.caption').fadeIn(250); //slideDown(250)
        },
        function(){
            $(this).find('.caption').fadeOut(250); //.slideDown(205)
        }
    );

    $(".disabled-link").hover(
    	function() {
    		$(this).find('.error').preventDefault();
    	}
    ); 
});