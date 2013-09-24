$(function() {

  $(window).on("scroll",function() {
    n = Math.ceil($(window).scrollTop() / 2.5),
    contentTop = $(window).width() < 480 ? 150 : 360
	$("#hero").css("-webkit-transform", "translateY(-" + n + "px)");
      if($(window).scrollTop() > contentTop) {
        $("header").addClass("shrink");
      } else {
        $("header").removeClass("shrink");
      }
  });

});
