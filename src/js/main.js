const header = $('.header');
const mockup = $('#mockup');
let mockupPosition = 100;
mockup.length ? mockupPosition = mockup.position().top + mockup.height() : mockupPosition = 100;

$(window).on('load', function () {
	$(window).scrollTop(0);
	setTimeout(function () {
		$(window).scroll(function () {
			let scroll = $(window).scrollTop();
			if (scroll >= mockupPosition) {
				header.addClass('scrolled');
			} else {
				header.removeClass('scrolled');
			}
		});

	}, 2000);
	AOS.init();

	$(window).resize(function () {
		AOS.refresh();
	});

	header.addClass('loaded');
});

$(window).resize(function () {
	AOS.refresh;
});

