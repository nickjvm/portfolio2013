$(function() {

  $(window).on("scroll",function() {
    
  });

});

if(!navigator.userAgent.match(/(iPod|iPhone|iPad)/)) {
	window.onscroll = function() {
		n = Math.ceil($(window).scrollTop() / 2.5),
		contentTop = $(window).width() < 480 ? 150 : 360;
		$("#hero").css("-webkit-transform", "translateY(-" + n + "px)");
		if($(window).scrollTop() > contentTop) {
			$("header").addClass("shrink");
		} else {
			$("header").removeClass("shrink");
		}
	}
} else if( navigator.userAgent.match(/(iPad)/)) {
	document.ontouchmove = function() {
		n = Math.ceil($(window).scrollTop() / 2.5),
		contentTop = $(window).width() < 480 ? 150 : 360;

		$("#hero").css("-webkit-transform", "translateY(-" + n + "px)");
		if($(window).scrollTop() > contentTop) {
			$("header").addClass("shrink");
		} else {
			$("header").removeClass("shrink");
		}
	}
}