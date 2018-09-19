//import '../vendor/owlcarousel/owl.carousel';
import '../../node_modules/slick-carousel/slick/slick';

window.app = window.app || {};
//var $ = jQuery.noConflict();

(function () {
	var lastTime = 0;
	var vendors = ['ms', 'moz', 'webkit', 'o'];
	for (var x = 0; x < vendors.length && !window.requestAnimationFrame; ++x) {
		window.requestAnimationFrame = window[vendors[x] + 'RequestAnimationFrame'];
		window.cancelAnimationFrame = window[vendors[x] + 'CancelAnimationFrame'] ||
			window[vendors[x] + 'CancelRequestAnimationFrame'];
	}

	if (!window.requestAnimationFrame)
		window.requestAnimationFrame = function (callback, element) {
			var currTime = new Date().getTime();
			var timeToCall = Math.max(0, 16 - (currTime - lastTime));
			var id = window.setTimeout(function () {
					callback(currTime + timeToCall);
				},
				timeToCall);
			lastTime = currTime + timeToCall;
			return id;
		};

	if (!window.cancelAnimationFrame)
		window.cancelAnimationFrame = function (id) {
			clearTimeout(id);
		};
}());

function debounce(func, wait, immediate) {
	var timeout, args, context, timestamp, result;
	return function () {
		context = this;
		args = arguments;
		timestamp = new Date();
		var later = function () {
			var last = (new Date()) - timestamp;
			if (last < wait) {
				timeout = setTimeout(later, wait - last);
			} else {
				timeout = null;
				if (!immediate) result = func.apply(context, args);
			}
		};
		var callNow = immediate && !timeout;
		if (!timeout) {
			timeout = setTimeout(later, wait);
		}
		if (callNow) result = func.apply(context, args);
		return result;
	};
}

var requesting = false;

var killRequesting = debounce(function () {
	requesting = false;
}, 100);

app = (function (app, $, window, document) {
	"use strict";

	app = app || {};

	var components = {
		documentReady: [],
		documentReadyDeferred: [],
		windowLoad: [],
		windowLoadDeferred: []
	};

	app.status = {
		documentReadyRan: false,
		windowLoadPending: false
	};

	$(document).ready(documentReady);
	$(window).on("load", windowLoad);

	function documentReady(context) {
		context = typeof context === typeof undefined ? $ : context;
		components.documentReady.concat(components.documentReadyDeferred).forEach(function (component) {
			component(context);
		});
		app.status.documentReadyRan = true;
		if (app.status.windowLoadPending) {
			windowLoad(app.setContext());
		}
	}

	function windowLoad(context) {
		if (app.status.documentReadyRan) {
			app.status.windowLoadPending = false;
			context = typeof context === "object" ? $ : context;
			components.windowLoad.concat(components.windowLoadDeferred).forEach(function (component) {
				component(context);
			});
		} else {
			app.status.windowLoadPending = true;
		}
	}

	app.setContext = function (contextSelector) {
		var context = $;
		if (typeof contextSelector !== typeof undefined) {
			return function (selector) {
				return $(contextSelector).find(selector);
			};
		}
		return context;
	};

	app.components = components;
	app.documentReady = documentReady;
	app.windowLoad = windowLoad;

	return app;
}(window.app, $, window, document));

app = (function (app, $, window, document) {
	"use strict";
	app.util = {};

	app.util.removeHash = function () {
		history.pushState("", document.title, window.location.pathname + window.location.search);
	}

	app.util.parsePixels = function (text) {
		var windowHeight = $(window).height(),
			value;
		if (/^[1-9]{1}[0-9]*[p][x]$/.test(text)) {
			return parseInt(text.replace('px', ''), 10);
		} else if (/^[1-9]{1}[0-9]*[v][h]$/.test(text)) {
			value = parseInt(text.replace('vh', ''), 10);
			return windowHeight * (value / 100);
		} else {
			return -1;
		}
	};

	app.util.pauseVideo = function (context) {
		var elems = context.is('video') ? context : context.find('video');

		elems.each(function (index, video) {
			var playingVideo = $(video).get(0);
			playingVideo.pause();
		});
	};

	app.util.activateIdleSrc = function (context, selector) {
		selector = (typeof selector !== typeof undefined) ? selector : '';
		var elems = context.is(selector + '[data-src]') ? context : context.find(selector + '[data-src]');
		elems.each(function (index, elem) {
			elem = $(elem);
			var dataSrc = elem.attr('data-src');
			elem.attr('src', dataSrc);
		});
	};

	app.util.idleSrc = function (context, selector) {

		selector = (typeof selector !== typeof undefined) ? selector : '';
		var elems = context.is(selector + '[src]') ? context : context.find(selector + '[src]');

		elems.each(function (index, elem) {
			elem = $(elem);
			var currentSrc = elem.attr('src'),
				dataSrc = elem.attr('data-src');

			if (typeof dataSrc === typeof undefined) {
				elem.attr('data-src', currentSrc);
			}

			elem.attr('src', '');

		});
	};

	app.util.pauseVideo = function (context) {
		var elems = context.is('video') ? context : context.find('video');

		elems.each(function (index, video) {
			var playingVideo = $(video).get(0);
			playingVideo.pause();
		});
	};

	return app;
}(window.app, $, window, document));

app = (function (app, $, window, document) {
	"use strict";

	app.isMobile = {
		Android: function () {
			return navigator.userAgent.match(/Android/i);
		},
		BlackBerry: function () {
			return navigator.userAgent.match(/BlackBerry/i);
		},
		iOS: function () {
			return navigator.userAgent.match(/iPhone|iPad|iPod/i);
		},
		Opera: function () {
			return navigator.userAgent.match(/Opera Mini/i);
		},
		Windows: function () {
			return navigator.userAgent.match(/IEMobile/i);
		},
		any: function () {
			return (this.Android() || this.BlackBerry() || this.iOS() || this.Opera() || this.Windows());
		}
	};

	return app;
}(window.app, $, window, document));

app = (function (app, $, window, document) {
	"use strict";

	app.window = {};
	app.window.height = $(window).height();
	app.window.width = $(window).width();

	$(window).on('resize', function () {
		app.window.height = $(window).height();
		app.window.width = $(window).width();
	});

	return app;
}(app, $, window, document));

app = (function (app, $, window, document) {
	"use strict";

	app.init = {};

	var $body = $('body');

	var documentReady = function ($) {
		responsiveClasses();
		lazyLoad();
	};

	var responsiveClasses = function () {
		if (typeof jRespond === 'undefined') {
			console.log('responsiveClasses: jRespond не определен.');
			return true;
		}

		var jRes = jRespond([{
			label: 'smallest',
			enter: 0,
			exit: 575
		}, {
			label: 'handheld',
			enter: 576,
			exit: 767
		}, {
			label: 'tablet',
			enter: 768,
			exit: 991
		}, {
			label: 'laptop',
			enter: 992,
			exit: 1199
		}, {
			label: 'desktop',
			enter: 1200,
			exit: 10000
		}]);
		jRes.addFunc([{
			breakpoint: 'desktop',
			enter: function () {
				$body.addClass('device-xl');
			},
			exit: function () {
				$body.removeClass('device-xl');
			}
		}, {
			breakpoint: 'laptop',
			enter: function () {
				$body.addClass('device-lg');
			},
			exit: function () {
				$body.removeClass('device-lg');
			}
		}, {
			breakpoint: 'tablet',
			enter: function () {
				$body.addClass('device-md');
			},
			exit: function () {
				$body.removeClass('device-md');
			}
		}, {
			breakpoint: 'handheld',
			enter: function () {
				$body.addClass('device-sm');
			},
			exit: function () {
				$body.removeClass('device-sm');
			}
		}, {
			breakpoint: 'smallest',
			enter: function () {
				$body.addClass('device-xs');
			},
			exit: function () {
				$body.removeClass('device-xs');
			}
		}]);
	};

	var lazyLoad = function () {
		var lazyLoadEl = $('[data-lazyload]');
		if (!$().appear) {
			console.log('lazyLoad: Appear не определен.');
			return true;
		}

		if (lazyLoadEl.length > 0) {
			lazyLoadEl.each(function () {
				var element = $(this),
					elementImg = element.attr('data-lazyload');

				element.attr('src', 'assets/blank.svg').css({
					'background': 'url(assets/preloader.gif) no-repeat center center #FFF'
				});

				element.appear(function () {
					element.css({
						'background': 'none'
					}).removeAttr('width').removeAttr('height').attr('src', elementImg);
				}, {
					accX: 0,
					accY: 120
				}, 'easeInCubic');
			});
		}
	};

	app.documentReady = documentReady;

	app.components.documentReady.push(documentReady);

	return app;
}(app, $, window, document));

app = (function (app, $, window, document) {
	"use strict";

	app.slider = {};

	var $sliderParallaxEl = $('.slider-parallax'),
		$window = $(window),
		$sliderElement = $('.slider-element'),
		$body = $('body');

	function onScrollSliderParallax() {
		if (!requesting) {
			requesting = true;
			requestAnimationFrame(function () {
				app.slider.sliderParallax();
			});
		}
		killRequesting();
	}

	var documentReady = function ($) {
		if ($sliderElement.length > 0) {
			parallaxOffsetTop = $sliderParallaxEl.offset().top;
			app.slider.sliderParallax();
			window.addEventListener('scroll', onScrollSliderParallax, false);
		}
	};

	var parallaxOffsetTop = null;

	app.slider.sliderParallax = function () {
		if ($sliderParallaxEl.length < 1) {
			return true;
		}

		var parallaxElHeight = $sliderParallaxEl.outerHeight();

		if (($body.hasClass('device-xl') || $body.hasClass('device-lg')) && !app.isMobile.any()) {
			if ((parallaxElHeight + parallaxOffsetTop + 50) > $window.scrollTop()) {
				$sliderParallaxEl.addClass('slider-parallax-visible').removeClass('slider-parallax-invisible');
				if ($window.scrollTop() > parallaxOffsetTop) {
					var tranformAmount = (($window.scrollTop() - parallaxOffsetTop) / 1.5).toFixed(0),
						tranformAmount2 = (($window.scrollTop() - parallaxOffsetTop) / 7).toFixed(0);
					$sliderParallaxEl.css({
						'transform': 'translateY(' + tranformAmount + 'px)'
					});
					$('.slider-parallax .slider-caption').css({
						'transform': 'translateY(' + -tranformAmount2 + 'px)'
					});
				} else {
					$('.slider-parallax,.slider-parallax .slider-caption').css({
						'transform': 'translateY(0px)'
					});
				}
			} else {
				$sliderParallaxEl.addClass('slider-parallax-invisible').removeClass('slider-parallax-visible');
			}
			if (requesting) {
				requestAnimationFrame(function () {
					app.slider.sliderParallax();
				});
			}
		} else {
			$('.slider-parallax,.slider-parallax .slider-caption').css({
				'transform': 'translateY(0px)'
			});
		}
	};

	app.documentReady = documentReady;

	app.components.documentReady.push(documentReady);

	return app;
}(app, $, window, document));
/*
app = (function (app, $, window, document) {
	"use strict";

	app.carousel = {};

	var documentReady = function ($) {
		carousel();
	};

	var carousel = function () {
		if (!$().owlCarousel) {
			console.log('carousel: Owl Carousel не определено.');
			return true;
		}

		var $carousel = $('.carousel-widget');
		if ($carousel.length < 1) {
			return true;
		}

		$carousel.each(function () {
			var element = $(this),
				elementItems = element.attr('data-items'),
				elementLoop = element.attr('data-loop'),
				elementAutoPlay = element.attr('data-autoplay'),
				elementSpeed = element.attr('data-speed'),
				elementAnimateIn = element.attr('data-animate-in'),
				elementAnimateOut = element.attr('data-animate-out'),
				elementNav = element.attr('data-nav'),
				elementPagi = element.attr('data-pagi'),
				elementMargin = element.attr('data-margin'),
				elementStage = element.attr('data-stage-padding'),
				elementMerge = element.attr('data-merge'),
				elementStart = element.attr('data-start'),
				elementRewind = element.attr('data-rewind'),
				elementSlideBy = element.attr('data-slideby'),
				elementCenter = element.attr('data-center'),
				elementLazy = element.attr('data-lazyload'),
				elementVideo = element.attr('data-video'),
				elementAutoPlayTime = 5000,
				elementAutoPlayHoverPause = true;

			if (!elementItems) {
				elementItems = 1;
			}
			if (!elementSpeed) {
				elementSpeed = 250;
			}
			if (!elementMargin) {
				elementMargin = 20;
			}
			if (!elementStage) {
				elementStage = 0;
			}
			if (!elementStart) {
				elementStart = 0;
			}

			if (!elementSlideBy) {
				elementSlideBy = 1;
			}
			if (elementSlideBy == 'page') {
				elementSlideBy = 'page';
			} else {
				elementSlideBy = Number(elementSlideBy);
			}
			if (elementLoop == 'true') {
				elementLoop = true;
			} else {
				elementLoop = false;
			}
			if (!elementAutoPlay) {
				elementAutoPlay = false;
				elementAutoPlayHoverPause = false;
			} else {
				elementAutoPlayTime = Number(elementAutoPlay);
				elementAutoPlay = true;
			}
			if (!elementAnimateIn) {
				elementAnimateIn = false;
			}
			if (!elementAnimateOut) {
				elementAnimateOut = false;
			}
			if (elementNav == 'false') {
				elementNav = false;
			} else {
				elementNav = true;
			}
			if (elementPagi == 'false') {
				elementPagi = false;
			} else {
				elementPagi = true;
			}
			if (elementRewind == 'true') {
				elementRewind = true;
			} else {
				elementRewind = false;
			}
			if (elementMerge == 'true') {
				elementMerge = true;
			} else {
				elementMerge = false;
			}
			if (elementCenter == 'true') {
				elementCenter = true;
			} else {
				elementCenter = false;
			}
			if (elementLazy == 'true') {
				elementLazy = true;
			} else {
				elementLazy = false;
			}
			if (elementVideo == 'true') {
				elementVideo = true;
			} else {
				elementVideo = false;
			}

			element.owlCarousel({
				margin: Number(elementMargin),
				loop: elementLoop,
				stagePadding: Number(elementStage),
				merge: elementMerge,
				startPosition: Number(elementStart),
				rewind: elementRewind,
				slideBy: elementSlideBy,
				center: elementCenter,
				lazyLoad: elementLazy,
				nav: elementNav,
				navText: ['<i class=""></i>', '<i class=""></i>'],
				autoplay: elementAutoPlay,
				autoplayTimeout: elementAutoPlayTime,
				autoplayHoverPause: elementAutoPlayHoverPause,
				dots: elementPagi,
				smartSpeed: Number(elementSpeed),
				fluidSpeed: Number(elementSpeed),
				video: elementVideo,
				animateIn: elementAnimateIn,
				animateOut: elementAnimateOut,
				onInitialized: function () {}
			});
		});
	};

	app.documentReady = documentReady;

	app.components.documentReady.push(documentReady);

	return app;
}(app, $, window, document));*/

app = (function (app, $, window, document) {
	"use strict";

	app.slick = {};

	var documentReady = function ($) {
		elementAspectRatio();
		carousel();
	};

	var elementAspectRatio = function () {
		var $aspectRatioEl = $('[data-aspect]');

		if ($aspectRatioEl.length > 0) {
			$aspectRatioEl.each(function () {
				var $el = $(this),
					$wrapper = $('<div>'),
					aspectValues = $el.attr('data-aspect').split(':'),
					aspectRatio = +aspectValues[0] / (+aspectValues[1]) * 100;
				$el.children()
					.appendTo($wrapper);
				$wrapper.appendTo($el)
					.css({
						'width': '100%',
						'height': '0',
						'paddingTop': aspectRatio + '%'
					});
				if ($el.children().children('.slick-widget').length > 0) {
					var $slickSlider = $el.children().children('.slick-widget');
					$slickSlider.on('init', function (event, slick) {
						//slick.$slides
						$(this).find('.slick-slide').css({
							'width': '100%',
							'height': '0',
							'paddingTop': aspectRatio + '%'
						})
					});
				}
			});
		}
	}

	var carousel = function () {
		if (!$().slick) {
			console.log('carousel: Slick Carousel не определено.');
			return true;
		}

		var $carousel = $('.slick-widget');
		if ($carousel.length < 1) {
			return true;
		}

		$carousel.each(function () {
			var element = $(this),
				elementSlidesToShow = element.attr('data-slides-to-show'),
				elementSlidesToScroll = element.attr('data-slides-to-scroll'),
				elementAutoplaySpeed = element.attr('data-autoplay-speed'),
				elementInfinite = element.attr('data-infinite'),
				elementSpeed = element.attr('data-speed'),
				elementArrows = element.attr('data-arrows'),
				elementDots = element.attr('data-dots'),
				elementLazy = element.attr('data-lazy-load'),
				elementVertical = element.attr('data-vertical'),
				elementAutoplay,
				elementVerticalSwiping,
				baseDotsClass = 'slick-slider__dots',
				dotsClass;

			if (!elementSlidesToShow) {
				elementSlidesToShow = 1;
			} else {
				elementSlidesToShow = Number(elementSlidesToShow);
			}
			if (!elementSlidesToScroll) {
				elementSlidesToScroll = 1;
			} else {
				elementSlidesToScroll = Number(elementSlidesToScroll);
			}
			if (!elementSpeed) {
				elementSpeed = 250;
			} else {
				elementSpeed = Number(elementSpeed);
			}
			if (elementInfinite == 'true') {
				elementInfinite = true;
			} else {
				elementInfinite = false;
			}
			if (!elementAutoplaySpeed) {
				elementAutoplaySpeed = 3000;
				elementAutoplay = false;
			} else {
				elementAutoplaySpeed = Number(elementAutoplaySpeed);
				elementAutoplay = true;
			}
			if (elementArrows == 'false') {
				elementArrows = false;
			} else {
				elementArrows = true;
			}
			if (elementDots == 'false') {
				elementDots = false;
			} else {
				elementDots = true;
			}
			if (elementVertical == 'true') {
				elementVertical = true;
				elementVerticalSwiping = true;
				dotsClass = 'dots dots--ori--ver';
			} else {
				elementVertical = false;
				elementVerticalSwiping = false;
				dotsClass = 'dots dots--ori--hor';
			}

			element.on('init', function (event, slick) {
				slick.$dots.find('li')
					.addClass('dot dots__dot')
					.find('button')
					.addClass('dot__inner');
				slick.$slides.each(function (index, el) {
					var $el = $(el),
						$captionNo = $el.find('.caption__no');
					index = index <= 9 ? '0' + String(index) : String(index);
					//if ($captionNo.html().trim().length == 0) {
						$captionNo.html(index);
					//}
				});
			});

			element.slick({
				vertical: elementVertical,
				verticalSwiping: elementVerticalSwiping,
				infinite: elementInfinite,
				slidesToShow: elementSlidesToShow,
				slidesToScroll: elementSlidesToScroll,
				lazyLoad: elementLazy,
				arrows: elementArrows,
				prevArrow: '<i class=""></i>',
				nextArrow: '<i class=""></i>',
				autoplay: elementAutoplay,
				autoplaySpeed: elementAutoplaySpeed,
				dots: elementDots,
				speed: elementSpeed,
				dotsClass: baseDotsClass + ' ' + dotsClass
			});
		});
	};

	app.documentReady = documentReady;

	app.components.documentReady.push(documentReady);

	return app;
}(app, $, window, document));

app = (function (app, $, window, document) {
	"use strict";

	app.scroll = {};
	var raf = window.requestAnimationFrame ||
		window.mozRequestAnimationFrame ||
		window.webkitRequestAnimationFrame ||
		window.msRequestAnimationFrame;
	app.scroll.listeners = [];
	app.scroll.busy = false;
	app.scroll.y = 0;
	app.scroll.x = 0;

	var documentReady = function ($) {
		$(window).off('scroll.app');

		$(window).on('scroll.app', function (evt) {
			if (app.scroll.busy === false) {
				app.scroll.busy = true;
				raf(function (evt) {
					app.scroll.update(evt);
				});
			}
			if (evt.stopPropagation) {
				evt.stopPropagation();
			}
		});
	};

	app.scroll.update = function (event) {
		app.scroll.y = window.pageYOffset;
		app.scroll.busy = false;

		if (app.scroll.listeners.length > 0) {
			for (var i = 0, l = app.scroll.listeners.length; i < l; i++) {
				app.scroll.listeners[i](event);
			}
		}
	}

	app.scroll.documentReady = documentReady;

	app.components.documentReady.push(documentReady);

	return app;

}(app, $, window, document));

app = (function (app, $, window, document) {
	"use strict";

	app.scroll.classModifiers = {};
	app.scroll.classModifiers.rules = [];

	app.scroll.classModifiers.parseScrollRules = function (element) {
		var text = element.attr('data-scroll-class'),
			rules = text.split(";");

		rules.forEach(function (rule) {
			var ruleComponents, scrollPoint, ruleObject = {};
			ruleComponents = rule.replace(/\s/g, "").split(':');
			if (ruleComponents.length === 2) {
				scrollPoint = app.util.parsePixels(ruleComponents[0]);
				if (scrollPoint > -1) {
					ruleObject.scrollPoint = scrollPoint;
					if (ruleComponents[1].length) {
						var toggleClass = ruleComponents[1];
						ruleObject.toggleClass = toggleClass;
						ruleObject.hasClass = element.hasClass(toggleClass);
						ruleObject.element = element.get(0);
						app.scroll.classModifiers.rules.push(ruleObject);
					}
				} else {
					return false;
				}
			} else {
				return false;
			}
		});

		if (app.scroll.classModifiers.rules.length) {
			return true;
		} else {
			return false;
		}
	};

	app.scroll.classModifiers.update = function (event) {
		var currentScroll = app.scroll.y,
			scrollRules = app.scroll.classModifiers.rules,
			l = scrollRules.length,
			currentRule;

		while (l--) {
			currentRule = scrollRules[l];

			if (currentScroll > currentRule.scrollPoint && !currentRule.hasClass) {
				currentRule.element.classList.add(currentRule.toggleClass);
				currentRule.hasClass = app.scroll.classModifiers.rules[l].hasClass = true;
			}
			if (currentScroll < currentRule.scrollPoint && currentRule.hasClass) {
				currentRule.element.classList.remove(currentRule.toggleClass);
				currentRule.hasClass = app.scroll.classModifiers.rules[l].hasClass = false;
			}
		}
	};

	var fixedElementSizes = function () {
		$('.main-container [data-scroll-class*="pos-fixed"]').each(function () {
			var element = $(this);
			element.css('max-width', element.parent().outerWidth());
			element.parent().css('min-height', element.outerHeight());
		});
	};

	var documentReady = function ($) {
		$('[data-scroll-class]').each(function () {
			var element = $(this);

			if (!app.scroll.classModifiers.parseScrollRules(element)) {
				console.log('Ошибка в разборе правил прокрутки для: ' + element);
			}
		});

		fixedElementSizes();
		$(window).on('resize', fixedElementSizes);

		if (app.scroll.classModifiers.rules.length) {
			app.scroll.listeners.push(app.scroll.classModifiers.update);
		}
	};

	app.components.documentReady.push(documentReady);
	app.scroll.classModifiers.documentReady = documentReady;

	return app;

}(app, $, window, document));

app = (function (app, $, window, document) {
	"use strict";

	app.backgrounds = app.backgrounds || {};

	app.backgrounds.documentReady = function ($) {
		$('.background-image-holder').each(function () {
			var imgSrc = $(this).children('img').attr('src');
			$(this).css('background', 'url("' + imgSrc + '")').css('background-position', 'initial').css('opacity', '1');
		});
	};

	app.components.documentReady.push(app.backgrounds.documentReady);
	return app;
}(app, $, window, document));

app = (function (app, $, window, document) {
	"use strict";

	app.bars = app.bars || {};

	app.bars.documentReady = function ($) {
		$('.nav-container .bar[data-scroll-class*="fixed"]:not(.bar--absolute)').each(function () {
			var bar = $(this),
				barHeight = bar.outerHeight(true);
			bar.closest('.nav-container').css('min-height', barHeight);
		});
	};

	app.components.documentReady.push(app.bars.documentReady);
	return app;
}(app, $, window, document));

app = (function (app, $, window, document) {
	"use strict";

	app.dropdowns = app.dropdowns || {};

	app.dropdowns.done = false;

	app.dropdowns.documentReady = function ($) {
		if (!app.dropdowns.done) {
			$(document).on('click', 'body:not(.dropdowns--hover) .dropdown, body.dropdowns--hover .dropdown.dropdown--click', function (event) {
				var dropdown = $(this);
				if ($(event.target).is('.dropdown--active > .dropdown__trigger')) {
					dropdown.siblings().removeClass('dropdown--active').find('.dropdown').removeClass('dropdown--active');
					dropdown.toggleClass('dropdown--active');
				} else {
					$('.dropdown--active').removeClass('dropdown--active');
					dropdown.addClass('dropdown--active');
				}
			});
			$(document).on('click touchstart', 'body:not(.dropdowns--hover)', function (event) {
				if (!$(event.target).is('[class*="dropdown"], [class*="dropdown"] *')) {
					$('.dropdown--active').removeClass('dropdown--active');
				}
			});
			$('body.dropdowns--hover .dropdown').on('click', function (event) {
				event.stopPropagation();
				var hoverDropdown = $(this);
				hoverDropdown.toggleClass('dropdown--active');
			});

			$('.wrapper__header').append('<div class="container containerMeasure" style="opacity:0;pointer-events:none;"></div>');

			app.dropdowns.repositionDropdowns($);
			$(window).on('resize', function () {
				app.dropdowns.repositionDropdowns($);
			});

			app.dropdowns.done = true;
		}
	};

	app.dropdowns.repositionDropdowns = function ($) {
		var OVERLAY_OFFSET = 4;

		$('.dropdown__container').each(function () {
			var $container, containerOffset, masterOffset, menuItemOffset, $content, $menuItemElement, menuItemWidth;

			$(this).css('left', '');

			$container = $(this);
			containerOffset = $container.offset().left;
			masterOffset = $('.containerMeasure').offset().left;
			$menuItemElement = $container.closest('.dropdown');
			menuItemOffset = $menuItemElement.offset().left;
			$content = null;
			menuItemWidth = $menuItemElement.is('.menu-vertical > li') ? $menuItemElement.outerWidth() + OVERLAY_OFFSET : 0;

			$container.css('left', ((-containerOffset) + (masterOffset)));
			if ($container.find('.dropdown__content:not([class*="col-lg-12"])').length) {
				$content = $container.find('.dropdown__content');
				$content.css('left', ((menuItemOffset + menuItemWidth) - (masterOffset)));
			}
			repositionContent.call($content[0]);
		});

		function repositionContent() {
			var $menuChildElement, offset, width, offsetRight, winWidth, leftCorrect, $menuItemElement;

			$menuChildElement = $(this);
			$menuItemElement = $menuChildElement.closest('.dropdown');
			offset = $menuChildElement.offset().left;
			width = $menuChildElement.outerWidth(true);
			offsetRight = offset + width;
			winWidth = $(window).outerWidth(true);

			if (offsetRight > winWidth) {
				if (!$menuItemElement.is('.menu-vertical > li')) {
					leftCorrect = $('.containerMeasure').outerWidth() - width;
					$menuChildElement.css('left', leftCorrect);
				} else {
					var menuItemLeft = $menuItemElement.offset().left;
					leftCorrect = menuItemLeft - ($('.containerMeasure').offset().left + width + OVERLAY_OFFSET);
					$menuChildElement.css('left', leftCorrect);
				}
			}
		}
	};

	app.components.documentReady.push(app.dropdowns.documentReady);
	return app;
}(app, $, window, document));

app = (function (app, $, window, document) {
	"use strict";

	app.modals = app.modals || {};

	app.modals.documentReady = function ($) {
		var allPageModals = "<div class=\"all-page-modals\"></div>",
			mainContainer = $('div.main-container');
		if (mainContainer.length) {
			$(allPageModals).insertAfter(mainContainer);
			app.modals.allModalsContainer = $('div.all-page-modals')
		} else {
			$('body').append(allPageModals);
			app.modals.allModalsContainer = $('body div.all-page-modals');
		}

		$('.modal-container').each(function () {
			var modal = $(this),
				$window = $(window),
				modalContent = modal.find('.modal-content');

			if (!modal.find('.modal-close').length) {
				modal.find('.modal-content').append('<div class="modal-close modal-close-icon"></div>');
			}

			if (modalContent.attr('data-width') !== undefined) {
				var modalWidth = modalContent.attr('data-width').substr(0, modalContent.attr('data-width').indexOf('%')) * 1;
				modalContent.css('width', modalWidth + '%');
			}

			if (modalContent.attr('data-height') !== undefined) {
				var modalHeight = modalContent.attr('data-height').substr(0, modalContent.attr('data-width').indexOf('%')) * 1;
				modalContent.css('height', modalHeight + '%');
			}
		});

		$('.modal-instance').each(function (index) {
			var modalInstance = $(this);
			var modal = modalInstance.find('.modal-container');
			var modalContent = modalInstance.find('.modal-content');
			var trigger = modalInstance.find('.modal-trigger');

			trigger.attr('data-modal-index', index);
			modal.attr('data-modal-index', index);

			if (typeof modal.attr('data-modal-id') !== typeof undefined) {
				trigger.attr('data-modal-id', modal.attr('data-modal-id'));
			}

			modal = modal.detach();
			app.modals.allModalsContainer.append(modal);
		});

		$('.modal-trigger').on('click', function () {
			var modalTrigger = $(this);
			var uniqueID, targetModal;

			if (typeof modalTrigger.attr('data-modal-id') !== typeof undefined) {
				uniqueID = modalTrigger.attr('data-modal-id');
				targetModal = app.modals.allModalsContainer.find('.modal-container[data-modal-id="' + uniqueID + '"]');
			} else {
				uniqueID = $(this).attr('data-modal-index');
				targetModal = app.modals.allModalsContainer.find('.modal-container[data-modal-index="' + uniqueID + '"]');
			}

			app.util.activateIdleSrc(targetModal, 'iframe');
			app.modals.autoplayVideo(targetModal);

			app.modals.showModal(targetModal);

			return false;
		});

		$(document).on('click', '.modal-close', app.modals.closeActiveModal);

		$(document).keyup(function (e) {
			if (e.keyCode === 27) {
				app.modals.closeActiveModal();
			}
		});

		$('.modal-container:not(.modal--prevent-close)').on('click', function (e) {
			if (e.target !== this) return;
			app.modals.closeActiveModal();
		});

		if (window.location.href.split('#').length === 2) {
			var modalID = window.location.href.split('#').pop();
			if ($('[data-modal-id="' + modalID + '"]').length) {
				app.modals.closeActiveModal();
				app.modals.showModal($('[data-modal-id="' + modalID + '"]'));
			}
		}

		$(document).on('click', 'a[href^="#"]', function () {
			var modalID = $(this).attr('href').replace('#', '');
			if ($('[data-modal-id="' + modalID + '"]').length) {
				app.modals.closeActiveModal();
				setTimeout(app.modals.showModal, 500, '[data-modal-id="' + modalID + '"]', 0);
			}
		});

		$(document).on('wheel mousewheel scroll', '.modal-content, .modal-content .scrollable', function (evt) {
			if (evt.preventDefault) {
				evt.preventDefault();
			}
			if (evt.stopPropagation) {
				evt.stopPropagation();
			}
			this.scrollTop += (evt.originalEvent.deltaY);
		});
	};

	app.modals.showModal = function (modal, millisecondsDelay) {
		var delay = (typeof millisecondsDelay !== typeof undefined) ? (1 * millisecondsDelay) : 0,
			$modal = $(modal);
		if ($modal.length) {
			setTimeout(function () {
				var openEvent = document.createEvent('Event');
				openEvent.initEvent('modalOpened.modals.app', true, true);
				$(modal).addClass('modal-active').trigger('modalOpened.modals.app').get(0).dispatchEvent(openEvent);
			}, delay);
		}
	}

	app.modals.closeActiveModal = function () {
		if (!$('body div.modal-active').length) {
			return;
		}
		var modal = $('body div.modal-active'),
			closeEvent = document.createEvent('Event');

		app.util.idleSrc(modal, 'iframe');
		app.util.pauseVideo(modal);

		if (modal.length) {
			if (modal.is('[data-modal-id]') && window.location.hash === '#' + modal.attr('data-modal-id')) {
				app.util.removeHash();
			}
		}
		closeEvent.initEvent('modalClosed.modals.app', true, true);
		modal.removeClass('modal-active').trigger('modalClosed.modals.app').get(0).dispatchEvent(closeEvent);
	};

	app.modals.autoplayVideo = function (modal) {
		if (modal.find('video[autoplay]').length) {
			var video = modal.find('video').get(0);
			video.play();
		}
	};

	app.components.documentReady.push(app.modals.documentReady);
	return app;
}(app, $, window, document));

app = (function (app, $, window, document) {
	"use strict";

	app.toggleClass = app.toggleClass || {};

	app.toggleClass.documentReady = function ($) {
		$('[data-toggle-class]').each(function () {
			var element = $(this),
				data = element.attr('data-toggle-class').split('|');

			$(data).each(function () {
				var candidate = element,
					dataArray = [],
					toggleClass = '',
					toggleElement = '',
					dataArray = this.split(';');

				if (dataArray.length == 2) {
					toggleElement = dataArray[0];
					toggleClass = dataArray[1];
					$(candidate).on('click', function () {
						if (!candidate.hasClass('toggled-class')) {
							candidate.toggleClass('toggled-class');
						} else {
							candidate.removeClass('toggled-class');
						}
						$(toggleElement).toggleClass(toggleClass);
						return false;
					});
				} else {
					console.log('Ошибка в атрибуте [data-toggle-class].');
				}
			});
		});
	};

	app.components.documentReady.push(app.toggleClass.documentReady);
	return app;

}(app, $, window, document));

app = (function (app, $, window, document) {
	"use strict";

	app.video = app.video || {};
	app.video.options = app.video.options || {};
	app.video.options.ytplayer = app.video.options.ytplayer || {};

	app.video.documentReady = function ($) {
		if ($('youtube-background').length) {
			$('youtube-background').each(function () {
				var player = $(this);

				themeDefaults = {
					containment: "self",
					autoPlay: true,
					mute: true,
					opacity: 1
				}, ao = {};

				ao.videoURL = $(this).attr('data-video-url');
				ao.startAt = $(this).attr('data-start-at') ? parseInt($(this).attr('data-start-at'), 10) : undefined;

				player.closest('.videobg').append('<div class="loading-indicator"></div>');
				player.YTPalyer($.extend({}, themeDefaults, app.video.options.ytplayer, ao));
				player.on("YTPStart", function () {
					player.closest('.videobg').addClass('.video-active');
				});
			});
		}

		if ($('.videobg').find('video').length) {
			$('.videobg').find('video').closest('.videobg').addClass('video-active');
		}

		$('.video-cover:not(.modal-instance)').each(function () {
			var videoCover = $(this);
			if (videoCover.find('iframe[src]').length) {
				videoCover.find('iframe').attr('data-src', videoCover.find('iframe').attr('src'));
				videoCover.find('iframe').attr('src', '');
			}
		});

		$('.video-cover:not(.modal-instance) .video-play-icon').on("click", function () {
			var playIcon = $(this);

			var videoCover = playIcon.closest('.video-cover');

			if (videoCover.find('video').length) {
				var video = videoCover.find('video').get(0);
				videoCover.addClass('reveal-video');
				video.play();
				return false;
			} else if (videoCover.find('iframe').length) {
				var iframe = videoCover.find('iframe');
				iframe.attr('src', iframe.attr('data-src'));
				videoCover.addClass('reveal-video');
				return false;
			}
		});
	};

	app.components.documentReady.push(app.video.documentReady);
	return app;
}(app, $, window, document));