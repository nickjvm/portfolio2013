$(function() {

	$.getJSON('get-tweets.php',function(feeds) {

	    var entry = "@nickjvm: " + feeds[0].text + " — " + moment(feeds[0].created_at).fromNow();

	    $("#twitter .tweet").html(entry.parseURL().parseUsername().parseHashtag());
	    $("#twitter").fadeIn();
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

String.prototype.parseURL = function() {
	return this.replace(/[A-Za-z]+:\/\/[A-Za-z0-9-_]+\.[A-Za-z0-9-_:%&~\?\/.=]+/g, function(url) {
		return url.link(url);
	});
};
    String.prototype.parseUsername = function() {
	return this.replace(/[@]+[A-Za-z0-9-_]+/g, function(u) {
		var username = u.replace("@","")
		return u.link("http://twitter.com/"+username);
	});
};
    String.prototype.parseHashtag = function() {
	return this.replace(/[#]+[A-Za-z0-9-_]+/g, function(t) {
		var tag = t.replace("#","%23")
		return t.link("http://search.twitter.com/search?q="+tag);
	});
};