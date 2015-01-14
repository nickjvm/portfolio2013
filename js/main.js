$(function() {
	$("nav a").on("click",function(e) {
		var self = this;
		e.preventDefault();

		var target = $(self).data("target");
		_gaq.push(['_trackPageview', target]);

		if($(self).closest(".front").length) {
			//front page stuff
			$.scrollTo($(self).attr("href"),300,{offset:-100});
		} else {
			//give 100 milliseconds for the ga queue to update.
			setTimeout(function() {
				window.location = $(self).attr("href");	
			},100);
			
		}


	});

	$("footer a").on("click",function() {
		target = $(this).data("target");
		_gaq.push(['_trackEvent', 'Social Media', 'Click', target]);
	})


	$.getJSON('get-tweets.php',function(feeds) {
	    var date = parseTwitterDate(feeds[0].created_at);
	    var entry = "@nickjvm: " + feeds[0].text + " — " + moment(date).fromNow();

	    $("#twitter .tweet").html(entry.parseURL().parseUsername().parseHashtag());
	    $("#twitter .tweet").fadeIn();
	});

	$('.email').magnificPopup({
		type: 'inline',
		preloader: false,
		focus: '#name',
		mainClass:"mfp-zoom-in",
		removalDelay: 300,
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
		_gaq.push(['_trackPageview', "/sendmail"]);

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

	var egg = function() {
		$.magnificPopup.open({
			type: 'iframe',
			mainClass:"mfp-zoom-in",
			removalDelay: 300,
			preloader: false,
			items: {
				src:'http://www.youtube.com/watch?v=xDMNHvnIxic'
			}
		});

		_gaq.push(['_trackEvent', 'Easter Egg', 'Keyed', "Found Easter Egg!"]);

	}

	var easter_egg = new Konami();
	easter_egg.code = function() { egg() }
	easter_egg.load();

});

var clearForm = function(selector) {
	$(selector).find(":input").val("").prop("checked",false);
}
var headerHeight = $("header:first").outerHeight();

$(window).on("resize",function() {
	//update header hight based on new window width
	headerHeight = $("header:first").outerHeight();
})

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
	var contentTop = $("#content").offset().top - headerHeight;

	if($(window).scrollTop() > contentTop) {
		$("header").addClass("shrink");
	} else {
		$("header").removeClass("shrink");
	}
}

function parseTwitterDate(text) {
	//IE doesn't like twitter's created_at date format, need to move a few things around
	var date = text.split(" ");
	return new Date(date[0] + " " + date[1] + " " + date[2] + " " + date[5] + " " + date[3] + " " + date[4]);
}

String.prototype.parseURL = function() {
	return this.replace(/[A-Za-z]+:\/\/[A-Za-z0-9-_]+\.[A-Za-z0-9-_:%&~\?\/=]+/g, function(url) {
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
		return t.link("https://twitter.com/search?q="+tag);
	});
};
