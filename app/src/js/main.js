class Accordion {
	constructor(target, config) {
		this._el = typeof target === 'string' ? document.querySelector(target) : target;
		const defaultConfig = {
			alwaysOpen: true,
			duration: 350,
			itemClass: 'accordion__item',
			headerClass: 'accordion__header',
			bodyClass: 'accordion__body',
		};
		this._config = Object.assign(defaultConfig, config);
		this.addEventListener();
	}
	addEventListener() {
		this._el.addEventListener('click', (e) => {
			const elHeader = e.target.closest('.' + this._config.headerClass);

			if (!elHeader) {
				return;
			}
			if (!this._config.alwaysOpen) {
				const elOpenItem = this._el.querySelector('.show');
				if (elOpenItem) {
					elOpenItem !== elHeader.parentElement ? this.toggle(elOpenItem) : null;
				}
			}
			this.toggle(elHeader.parentElement);
		});
	}
	show(el) {
		const elBody = el.querySelector('.' + this._config.bodyClass);
		if (elBody.classList.contains('collapsing') || el.classList.contains('show')) {
			return;
		}
		elBody.style.display = 'block';
		const height = elBody.offsetHeight;
		elBody.style.height = 0;
		elBody.style.overflow = 'hidden';
		elBody.style.transition = `height ${this._config.duration}ms ease`;
		elBody.classList.add('collapsing');
		el.classList.add('slidedown');
		elBody.offsetHeight;
		elBody.style.height = `${height}px`;
		window.setTimeout(() => {
			elBody.classList.remove('collapsing');
			el.classList.remove('slidedown');
			elBody.classList.add('collapse');
			el.classList.add('show');
			elBody.style.display = '';
			elBody.style.height = '';
			elBody.style.transition = '';
			elBody.style.overflow = '';
		}, this._config.duration);
	}
	hide(el) {
		const elBody = el.querySelector('.' + this._config.bodyClass);
		if (elBody.classList.contains('collapsing') || !el.classList.contains('show')) {
			return;
		}
		elBody.style.height = `${elBody.offsetHeight}px`;
		elBody.offsetHeight;
		elBody.style.display = 'block';
		elBody.style.height = 0;
		elBody.style.overflow = 'hidden';
		elBody.style.transition = `height ${this._config.duration}ms ease`;
		elBody.classList.remove('collapse');
		el.classList.remove('show');
		elBody.classList.add('collapsing');
		window.setTimeout(() => {
			elBody.classList.remove('collapsing');
			elBody.classList.add('collapse');
			elBody.style.display = '';
			elBody.style.height = '';
			elBody.style.transition = '';
			elBody.style.overflow = '';
		}, this._config.duration);
	}
	toggle(el) {
		el.classList.contains('show') ? this.hide(el) : this.show(el);
	}
}

$(document).ready(function () {

	$('.lazy').Lazy();

	/**
	 * Menu fixation
	 */

	// let headerFixation = function () {
	// 	let header = $(".header");
	// 	let body = $("body");

	// 	if ($(window).scrollTop() > 100) {
	// 		header.addClass("header--fixed");
	// 		body.css('padding-top', header.outerHeight() + 'px');
	// 	} else {
	// 		if (!$('html').hasClass('modal-opened')) {
	// 			header.removeClass("header--fixed");
	// 			body.css('padding-top', '');
	// 		}
	// 	}
	// }

	// headerFixation();
	// $(window).on("scroll", headerFixation);


	/**
	 * Open mobile menu
	 */

	$('.header__open-menu-btn').on('click', function () {
		$('.header__bottom').addClass('header__bottom--showed');
	});
	$('.header__close-menu-btn').on('click', function () {
		$('.header__bottom').removeClass('header__bottom--showed');
	});
	$(window).on("resize", function () {
		$('.header__bottom').removeClass('header__bottom--showed');
	});


	/**
	 * Post sliders
	 */

	let postSliders = $('.posts-slider');

	postSliders.each(function () {
		$(this).find('.posts-slider__list').slick({
			infinite: false,
			speed: 300,
			slidesToShow: 3,
			prevArrow: $(this).find('.posts-slider__arrow--prev'),
			nextArrow: $(this).find('.posts-slider__arrow--next'),
			responsive: [
				{
					breakpoint: 768,
					settings: {
						slidesToShow: 2,
					}
				},
				{
					breakpoint: 576,
					settings: {
						slidesToShow: 1,
					}
				},
			]
		})
	});


	/**
	 * Accordion
	 */

	let faq = document.querySelector('.faq__list');

	if (faq) {
		new Accordion('.faq__list', {
			alwaysOpen: false,
			duration: 350,
			itemClass: 'faq__item',
			headerClass: 'faq__item-head',
			bodyClass: 'faq__item-body',
		});
	}

});