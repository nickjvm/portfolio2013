$(function() {

	$.getJSON('get-tweets.php',function(feeds) {

	    var entry = "@nickjvm: " + feeds[0].text + " — " + moment(feeds[0].created_at).fromNow();

	    $("#twitter .tweet").html(entry.parseURL().parseUsername().parseHashtag());
	    $("#twitter").fadeIn();
	});

	$('.email').magnificPopup({
		type: 'inline',
		preloader: false,
		focus: '#name',

		// When elemened is focused, some mobile browsers in some cases zoom in
		// It looks not nice, so we disable it:
		callbacks: {
			beforeOpen: function() {
			  if($(window).width() < 700) {
			    this.st.focus = false;
			  } else {
			    this.st.focus = '#name';
			  }
			},
			beforeClose:function() {
				clearForm("#contact");
				$("#contact").removeClass("thinking");
				validator.resetForm();
			}
		}
	});

	var validator = $("#contact").validate({
		errorPlacement:function() {}
	});

	$("#contact .cancel").on("click",function(e) {
		e.preventDefault();
		validator.resetForm();
		$.magnificPopup.close()
	});

	$("#contact").on("submit",function(e) {
		if(!validator.valid()) { 
			return false;
		}
		var $self = $(this);
		//do some cleanup
		e.preventDefault();
		validator.resetForm();
		$self.addClass("thinking");
		var data = $(this).serialize();
		
		var request = $.ajax({
			type: "POST",
			url: "contact.php",
			data: data
		})

		request.done(function(response,success) {
			$self.removeClass("thinking");
			response = $.parseJSON(response);
			if(response.status) {
				//passed validation - got a good response!
				clearForm("#contact");
				$.magnificPopup.close();
				$("#success").css({
					top:0
				})
				setTimeout(function() {
					$("#success").css({
						top:-40
					})
				},2500);

			} else {
				if(response.code == 1) {
					//something went wrong!
					$.each(response.errors,function() {
						$("#contact [name='"+this+"']").addClass("error");
					});
			 	} else if (response.code == 2) {
			 		$("#contact .alert-error").text("Something went wrong. Please try again later");
			 	}
			}
		});

	});
});
var clearForm = function(selector) {
	$(selector).find(":input").val("").prop("checked",false);
}

var contentTop = $(window).width() < 480 ? 150 : 360;
window.onscroll = function() {
	if(!navigator.userAgent.match(/(iPod|iPhone|iPad)/)) {
		var n = Math.ceil($(window).scrollTop() / 2.5);
		$("#hero").css({
			"-webkit-transform":"translateY(-" + n + "px)",
			"-moz-transform":"translateY(-" + n + "px)",
			"-ms-transform":"translateY(-" + n + "px)",
			"transform":"translateY(-" + n + "px)"
		});
	} 
	if($(window).scrollTop() > contentTop) {
		$("header").addClass("shrink");
	} else {
		$("header").removeClass("shrink");
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
