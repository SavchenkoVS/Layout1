window.mr = window.mr || {};

mr = (function (mr, $, window, document) {
	"use strict";

	mr = mr || {};

	var components = {
		documentReady: [],
		documentReadyDeferred: [],
		windowLoad: [],
		windowLoadDeferred: []
	};

	mr.status = {
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
		mr.status.documentReadyRan = true;
		if (mr.status.windowLoadPending) {
			windowLoad(mr.setContext());
		}
	}

	function windowLoad(context) {
		if (mr.status.documentReadyRan) {
			mr.status.windowLoadPending = false;
			context = typeof context === "object" ? $ : context;
			components.windowLoad.concat(components.windowLoadDeferred).forEach(function (component) {
				component(context);
			});
		} else {
			mr.status.windowLoadPending = true;
		}
	}

	mr.setContext = function (contextSelector) {
		var context = $;
		if (typeof contextSelector !== typeof undefined) {
			return function (selector) {
				return $(contextSelector).find(selector);
			};
		}
		return context;
	};

	mr.components = components;
	mr.documentReady = documentReady;
	mr.windowLoad = windowLoad;

	return mr;
}(window.mr, jQuery, window, document));

mr = (function (mr, $, window, document) {
	"use strict";
	mr.util = {};

	mr.util.removeHash = function () {
		history.pushState("", document.title, window.location.pathname + window.location.search);
	}

	mr.util.parsePixels = function (text) {
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

	mr.util.pauseVideo = function (context) {
		var elems = context.is('video') ? context : context.find('video');

		elems.each(function (index, video) {
			var playingVideo = $(video).get(0);
			playingVideo.pause();
		});
	};

	mr.util.activateIdleSrc = function (context, selector) {
		selector = (typeof selector !== typeof undefined) ? selector : '';
		var elems = context.is(selector + '[data-src]') ? context : context.find(selector + '[data-src]');
		elems.each(function (index, elem) {
			elem = $(elem);
			var dataSrc = elem.attr('data-src');
			elem.attr('src', dataSrc);
		});
	};

	mr.util.idleSrc = function (context, selector) {

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

	mr.util.pauseVideo = function (context) {
		var elems = context.is('video') ? context : context.find('video');

		elems.each(function (index, video) {
			var playingVideo = $(video).get(0);
			playingVideo.pause();
		});
	};

	return mr;
}(window.mr, jQuery, window, document));

mr = (function (mr, $, window, document) {
	"use strict";

	mr.window = {};
	mr.window.height = $(window).height();
	mr.window.width = $(window).width();

	$(window).on('resize', function () {
		mr.window.height = $(window).height();
		mr.window.width = $(window).width();
	});

	return mr;
}(mr, jQuery, window, document));

mr = (function (mr, $, window, document) {
	"use strict";


	mr.scroll = {};
	var raf = window.requestAnimationFrame ||
		window.mozRequestAnimationFrame ||
		window.webkitRequestAnimationFrame ||
		window.msRequestAnimationFrame;
	mr.scroll.listeners = [];
	mr.scroll.busy = false;
	mr.scroll.y = 0;
	mr.scroll.x = 0;

	var documentReady = function ($) {
		jQuery(window).off('scroll.mr');

		jQuery(window).on('scroll.mr', function (evt) {
			if (mr.scroll.busy === false) {
				mr.scroll.busy = true;
				raf(function (evt) {
					mr.scroll.update(evt);
				});
			}
			if (evt.stopPropagation) {
				evt.stopPropagation();
			}
		});
	};

	mr.scroll.update = function (event) {
		mr.scroll.y = window.pageYOffset;
		mr.scroll.busy = false;

		if (mr.scroll.listeners.length > 0) {
			for (var i = 0, l = mr.scroll.listeners.length; i < l; i++) {
				mr.scroll.listeners[i](event);
			}
		}
	}

	mr.scroll.documentReady = documentReady;

	mr.components.documentReady.push(documentReady);

	return mr;

}(mr, jQuery, window, document));

mr = (function (mr, $, window, document) {
	"use strict";

	mr.scroll.classModifiers = {};
	mr.scroll.classModifiers.rules = [];

	mr.scroll.classModifiers.parseScrollRules = function (element) {
		var text = element.attr('data-scroll-class'),
			rules = text.split(";");

		rules.forEach(function (rule) {
			var ruleComponents, scrollPoint, ruleObject = {};
			ruleComponents = rule.replace(/\s/g, "").split(':');
			if (ruleComponents.length === 2) {
				scrollPoint = mr.util.parsePixels(ruleComponents[0]);
				if (scrollPoint > -1) {
					ruleObject.scrollPoint = scrollPoint;
					if (ruleComponents[1].length) {
						var toggleClass = ruleComponents[1];
						ruleObject.toggleClass = toggleClass;
						ruleObject.hasClass = element.hasClass(toggleClass);
						ruleObject.element = element.get(0);
						mr.scroll.classModifiers.rules.push(ruleObject);
					}
				} else {
					return false;
				}
			} else {
				return false;
			}
		});

		if (mr.scroll.classModifiers.rules.length) {
			return true;
		} else {
			return false;
		}
	};

	mr.scroll.classModifiers.update = function (event) {
		var currentScroll = mr.scroll.y,
			scrollRules = mr.scroll.classModifiers.rules,
			l = scrollRules.length,
			currentRule;

		while (l--) {
			currentRule = scrollRules[l];

			if (currentScroll > currentRule.scrollPoint && !currentRule.hasClass) {
				currentRule.element.classList.add(currentRule.toggleClass);
				currentRule.hasClass = mr.scroll.classModifiers.rules[l].hasClass = true;
			}
			if (currentScroll < currentRule.scrollPoint && currentRule.hasClass) {
				currentRule.element.classList.remove(currentRule.toggleClass);
				currentRule.hasClass = mr.scroll.classModifiers.rules[l].hasClass = false;
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

			if (!mr.scroll.classModifiers.parseScrollRules(element)) {
				console.log('Ошибка в разборе правил прокрутки для: ' + element);
			}
		});

		fixedElementSizes();
		$(window).on('resize', fixedElementSizes);

		if (mr.scroll.classModifiers.rules.length) {
			mr.scroll.listeners.push(mr.scroll.classModifiers.update);
		}
	};

	mr.components.documentReady.push(documentReady);
	mr.scroll.classModifiers.documentReady = documentReady;

	return mr;

}(mr, jQuery, window, document));

mr = (function (mr, $, window, document) {
	"use strict";

	mr.backgrounds = mr.backgrounds || {};

	mr.backgrounds.documentReady = function ($) {
		$('.background-image-holder').each(function () {
			var imgSrc = $(this).children('img').attr('src');
			$(this).css('background', 'url("' + imgSrc + '")').css('background-position', 'initial').css('opacity', '1');
		});
	};

	mr.components.documentReady.push(mr.backgrounds.documentReady);
	return mr;
}(mr, jQuery, window, document));

mr = (function (mr, $, window, document) {
	"use strict";

	mr.bars = mr.bars || {};

	mr.bars.documentReady = function ($) {
		$('.nav-container .bar[data-scroll-class*="fixed"]:not(.bar--absolute)').each(function () {
			var bar = $(this),
				barHeight = bar.outerHeight(true);
			bar.closest('.nav-container').css('min-height', barHeight);
		});
	};

	mr.components.documentReady.push(mr.bars.documentReady);
	return mr;
}(mr, jQuery, window, document));

mr = (function (mr, $, window, document) {
	"use strict";

	mr.dropdowns = mr.dropdowns || {};

	mr.dropdowns.done = false;

	mr.dropdowns.documentReady = function ($) {
		if (!mr.dropdowns.done) {
			jQuery(document).on('click', 'body:not(.dropdowns--hover) .dropdown, body.dropdowns--hover .dropdown.dropdown--click', function (event) {
				var dropdown = jQuery(this);
				if (jQuery(event.target).is('.dropdown--active > .dropdown__trigger')) {
					dropdown.siblings().removeClass('dropdown--active').find('.dropdown').removeClass('dropdown--active');
					dropdown.toggleClass('dropdown--active');
				} else {
					$('.dropdown--active').removeClass('dropdown--active');
					dropdown.addClass('dropdown--active');
				}
			});
			jQuery(document).on('click touchstart', 'body:not(.dropdowns--hover)', function (event) {
				if (!jQuery(event.target).is('[class*="dropdown"], [class*="dropdown"] *')) {
					$('.dropdown--active').removeClass('dropdown--active');
				}
			});
			jQuery('body.dropdowns--hover .dropdown').on('click', function (event) {
				event.stopPropagation();
				var hoverDropdown = jQuery(this);
				hoverDropdown.toggleClass('dropdown--active');
			});

			jQuery('.wrapper__header').append('<div class="container containerMeasure" style="opacity:0;pointer-events:none;"></div>');

			mr.dropdowns.repositionDropdowns($);
			jQuery(window).on('resize', function () {
				mr.dropdowns.repositionDropdowns($);
			});

			mr.dropdowns.done = true;
		}
	};

	mr.dropdowns.repositionDropdowns = function ($) {
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

	mr.components.documentReady.push(mr.dropdowns.documentReady);
	return mr;
}(mr, jQuery, window, document));

mr = (function (mr, $, window, document) {
	"use strict";

	mr.modals = mr.modals || {};

	mr.modals.documentReady = function ($) {
		var allPageModals = "<div class=\"all-page-modals\"></div>",
			mainContainer = $('div.main-container');
		if (mainContainer.length) {
			jQuery(allPageModals).insertAfter(mainContainer);
			mr.modals.allModalsContainer = $('div.all-page-modals')
		} else {
			jQuery('body').append(allPageModals);
			mr.modals.allModalsContainer = jQuery('body div.all-page-modals');
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
			mr.modals.allModalsContainer.append(modal);
		});

		$('.modal-trigger').on('click', function () {
			var modalTrigger = $(this);
			var uniqueID, targetModal;

			if (typeof modalTrigger.attr('data-modal-id') !== typeof undefined) {
				uniqueID = modalTrigger.attr('data-modal-id');
				targetModal = mr.modals.allModalsContainer.find('.modal-container[data-modal-id="' + uniqueID + '"]');
			} else {
				uniqueID = $(this).attr('data-modal-index');
				targetModal = mr.modals.allModalsContainer.find('.modal-container[data-modal-index="' + uniqueID + '"]');
			}

			mr.util.activateIdleSrc(targetModal, 'iframe');
			mr.modals.autoplayVideo(targetModal);

			mr.modals.showModal(targetModal);

			return false;
		});

		jQuery(document).on('click', '.modal-close', mr.modals.closeActiveModal);

		jQuery(document).keyup(function (e) {
			if (e.keyCode === 27) {
				mr.modals.closeActiveModal();
			}
		});

		$('.modal-container:not(.modal--prevent-close)').on('click', function (e) {
			if (e.target !== this) return;
			mr.modals.closeActiveModal();
		});

		if (window.location.href.split('#').length === 2) {
			var modalID = window.location.href.split('#').pop();
			if ($('[data-modal-id="' + modalID + '"]').length) {
				mr.modals.closeActiveModal();
				mr.modals.showModal($('[data-modal-id="' + modalID + '"]'));
			}
		}

		jQuery(document).on('click', 'a[href^="#"]', function () {
			var modalID = $(this).attr('href').replace('#', '');
			if ($('[data-modal-id="' + modalID + '"]').length) {
				mr.modals.closeActiveModal();
				setTimeout(mr.modals.showModal, 500, '[data-modal-id="' + modalID + '"]', 0);
			}
		});

		jQuery(document).on('wheel mousewheel scroll', '.modal-content, .modal-content .scrollable', function (evt) {
			if (evt.preventDefault) {
				evt.preventDefault();
			}
			if (evt.stopPropagation) {
				evt.stopPropagation();
			}
			this.scrollTop += (evt.originalEvent.deltaY);
		});
	};

	mr.modals.showModal = function (modal, millisecondsDelay) {
		var delay = (typeof millisecondsDelay !== typeof undefined) ? (1 * millisecondsDelay) : 0,
			$modal = $(modal);
		if ($modal.length) {
			setTimeout(function () {
				var openEvent = document.createEvent('Event');
				openEvent.initEvent('modalOpened.modals.mr', true, true);
				$(modal).addClass('modal-active').trigger('modalOpened.modals.mr').get(0).dispatchEvent(openEvent);
			}, delay);
		}
	}

	mr.modals.closeActiveModal = function () {
		if (!jQuery('body div.modal-active').length) {
			return;
		}
		var modal = jQuery('body div.modal-active'),
			closeEvent = document.createEvent('Event');

		mr.util.idleSrc(modal, 'iframe');
		mr.util.pauseVideo(modal);

		if (modal.length) {
			if (modal.is('[data-modal-id]') && window.location.hash === '#' + modal.attr('data-modal-id')) {
				mr.util.removeHash();
			}
		}
		closeEvent.initEvent('modalClosed.modals.mr', true, true);
		modal.removeClass('modal-active').trigger('modalClosed.modals.mr').get(0).dispatchEvent(closeEvent);
	};

	mr.modals.autoplayVideo = function (modal) {
		if (modal.find('video[autoplay]').length) {
			var video = modal.find('video').get(0);
			video.play();
		}
	};

	mr.components.documentReady.push(mr.modals.documentReady);
	return mr;
}(mr, jQuery, window, document));

mr = (function (mr, $, window, document) {
	"use strict";

	mr.toggleClass = mr.toggleClass || {};

	mr.toggleClass.documentReady = function ($) {
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

	mr.components.documentReady.push(mr.toggleClass.documentReady);
	return mr;

}(mr, jQuery, window, document));

mr = (function (mr, $, window, document) {
	"use strict";

	mr.video = mr.video || {};
	mr.video.options = mr.video.options || {};
	mr.video.options.ytplayer = mr.video.options.ytplayer || {};

	mr.video.documentReady = function ($) {
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
				player.YTPalyer(jQuery.extend({}, themeDefaults, mr.video.options.ytplayer, ao));
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

	mr.components.documentReady.push(mr.video.documentReady);
	return mr;
}(mr, jQuery, window, document));