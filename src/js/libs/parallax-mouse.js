/**
 * Модуль параллакса мышью
 * (c) Фрилансер по жизни, Хмурый Кот
 * Документация:
 *
 * Предмету, который будет двигаться за мышью указать атрибут data-prlx-mouse.
 *
 * Если нужны дополнительные настройки - указать
 * Атрибут											      Значение по умолчанию
 * ----------------------------------------------------------------------------------------------------------
 * data-prlx-cx="коэффициент_х"				100							      значение больше - меньше процент сдвига
 * data-prlx-cy="коэффициент_y"				100							      значение больше - меньше процент сдвига
 * data-prlx-dxr																		        против оси X
 * data-prlx-dyr																		        против оси Y
 * data-prlx-a="скорость_анимации"		50							      больше значение - больше скорость
 *
 * Если нужно считывать движение мыши в блоке-родителе - тому родителю указать атрибут data-prlx-mouse-wrapper
 * Если в параллаксе картинка - расстянуть ее на >100%.
 * Например: {
 *  width: 130%;
 * 	height: 130%;
 * 	top: -15%;
 * 	left: -15%;
 * }
 * */
export class MousePRLX {
	constructor(props) {
		const defaultConfig = {
			init: true,
		};

		this.config = Object.assign(defaultConfig, props);

		if (this.config.init) {
			const parallaxElements = document.querySelectorAll('[data-prlx-mouse]');

			if (parallaxElements.length) {
				this.init(parallaxElements);
			}
		}
	}

	init(parallaxElements) {
		parallaxElements.forEach((element) => {
			const parallaxMouseWrapper = element.closest('[data-prlx-mouse-wrapper]');

			/** Коэффициент X */
			const paramCoefficientX = element.dataset.prlxCx
			                          ? Number(element.dataset.prlxCx)
			                          : 100;

			/** Коэффициент. У */
			const paramCoefficientY = element.dataset.prlxCy
			                          ? Number(element.dataset.prlxCy)
			                          : 100;

			/** Направление Х и Y */
			const directionX = element.hasAttribute('data-prlx-dxr') ? -1 : 1;
			const directionY = element.hasAttribute('data-prlx-dyr') ? -1 : 1;

			/** Скорость анимации */
			const paramAnimation = element.dataset.prlxA
			                       ? Number(element.dataset.prlxA)
			                       : 50;

			let positionX = 0;
			let positionY = 0;
			let coordXPercent = 0;
			let coordYPercent = 0;

			setMouseParallaxStyle();

			/** Проверка на наличие родителя, в котором будет считываться положение мыши */
			if (parallaxMouseWrapper) {
				mouseMoveParallax(parallaxMouseWrapper);
			} else {
				mouseMoveParallax();
			}

			function setMouseParallaxStyle() {
				positionX += ((coordXPercent - positionX) * paramAnimation) / 1000;
				positionY += ((coordYPercent - positionY) * paramAnimation) / 1000;

				const transformX = (directionX * positionX) / (paramCoefficientX / 10);
				const transformY = (directionY * positionY) / (paramCoefficientY / 10);

				element.style.transform = `translate3D(${transformX}%, ${transformY}%, 0)`;

				requestAnimationFrame(setMouseParallaxStyle);
			}

			function mouseMoveParallax(wrapper = window) {
				wrapper.addEventListener('mousemove', ({ clientX, clientY }) => {
					const offsetTop =
						element.getBoundingClientRect().top + window.scrollY;

					if (
						offsetTop >= window.scrollY ||
						offsetTop + element.offsetHeight >= window.scrollY
					) {
						/** Получение ширины и высоты блока */
						const parallaxWidth = window.innerWidth;
						const parallaxHeight = window.innerHeight;

						/** Ноль посередине */
						const cordX = clientX - parallaxWidth / 2;
						const cordY = clientY - parallaxHeight / 2;

						/** Получение значений координат в процентах */
						coordXPercent = (cordX / parallaxWidth) * 100;
						coordYPercent = (cordY / parallaxHeight) * 100;
					}
				});
			}
		});
	}
}
