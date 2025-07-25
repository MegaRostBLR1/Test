document.addEventListener('DOMContentLoaded', function() {
    // Получаем элементы
    const burgerBtn = document.querySelector('.header__burger');
    const mobileMenu = document.querySelector('.mobile__menu');
    const closeBtn = document.querySelector('.mobile__close');
    const infoBtn = document.querySelector('.hero__btn');
    const popup = document.querySelector('.popup');
    const popupClose = document.querySelector('.popup__close');


    // Функция для открытия меню
    function openMenu() {
        mobileMenu.style.display = 'block';
        setTimeout(() => {
            mobileMenu.classList.add('active');
            document.querySelector('.mobile__menu-content').classList.add('active');
        }, 10);
        document.body.style.overflow = 'hidden';
    }


    // Функция для закрытия меню
    function closeMenu() {
        mobileMenu.classList.remove('active');
        document.querySelector('.mobile__menu-content').classList.remove('active');
        setTimeout(() => {
            mobileMenu.style.display = 'none';
            document.body.style.overflow = '';
        }, 300);
    }


    // Обработчики событий
    burgerBtn.addEventListener('click', openMenu);
    closeBtn.addEventListener('click', closeMenu);

    // Закрытие меню при клике вне его области
    mobileMenu.addEventListener('click', function(e) {
        if (e.target === mobileMenu) {
            closeMenu();
        }
    });

    function openPopup() {
        popup.style.display = 'flex';
        setTimeout(() => {
            popup.classList.add('active');
        }, 10);
        document.body.style.overflow = 'hidden';
    }

    function closePopup() {
        popup.classList.remove('active');
        setTimeout(() => {
            popup.style.display = 'none';
            document.body.style.overflow = '';
        }, 300);
    }


    // Обработчик клика на кнопку INFO
    infoBtn.addEventListener('click', openPopup);


    // Обработчик клика на крестик
    popupClose.addEventListener('click', closePopup);


    // Закрытие попапа при клике вне его содержимого
    popup.addEventListener('click', function(e) {
        if (e.target === popup) {
            closePopup();
        }
    });


    // Инициализация слайдера
    const sliderContainer = document.querySelector('.slider-container');
    const slides = document.querySelectorAll('.slider-slide');
    const prevBtn = document.querySelector('.slider-arrow--prev');
    const nextBtn = document.querySelector('.slider-arrow--next');
    let currentSlide = 0;
    const slideCount = slides.length;
    let startX = 0;
    let endX = 0;
    const swipeThreshold = 50; // Минимальное расстояние свайпа для смены слайда


    // Обновите функцию goToSlide
    function goToSlide(index, animate = true) {
        if (index < 0) index = Math.ceil(slideCount / 2) - 1;
        if (index >= Math.ceil(slideCount / 2)) index = 0;

        currentSlide = index;
        const slideWidth = slides[0].offsetWidth +
            parseInt(getComputedStyle(sliderContainer).gap);

        if (animate) {
            sliderContainer.style.transition = 'transform 0.3s ease';
        } else {
            sliderContainer.style.transition = 'none';
        }

        // Для планшетов перемещаем на половину ширины контейнера
        if (window.matchMedia('(min-width: 768px) and (max-width: 1024px)').matches) {
            sliderContainer.style.transform = `translateX(-${currentSlide * (slideWidth * 2)}px)`;
        } else {
            sliderContainer.style.transform = `translateX(-${currentSlide * slideWidth}px)`;
        }
    }


    // Обработчики кнопок
    nextBtn.addEventListener('click', () => goToSlide(currentSlide + 1));
    prevBtn.addEventListener('click', () => goToSlide(currentSlide - 1));


    // Обработчики свайпа для тач-устройств
    sliderContainer.addEventListener('touchstart', (e) => {
        startX = e.touches[0].clientX;
    }, { passive: true });

    sliderContainer.addEventListener('touchmove', (e) => {
        endX = e.touches[0].clientX;

        // Вычисляем разницу и перемещаем слайдер
        const diff = startX - endX;
        const slideWidth = slides[0].offsetWidth +
            parseInt(getComputedStyle(sliderContainer).gap);
        const currentOffset = currentSlide * slideWidth;

        // Временно отключаем анимацию для плавного следования за пальцем
        sliderContainer.style.transition = 'none';
        sliderContainer.style.transform = `translateX(calc(-${currentOffset}px + ${-diff}px))`;
    }, { passive: true });

    sliderContainer.addEventListener('touchend', () => {
        const diff = startX - endX;

        if (diff > swipeThreshold) {
            // Свайп влево - следующий слайд
            goToSlide(currentSlide + 1);
        } else if (diff < -swipeThreshold) {
            // Свайп вправо - предыдущий слайд
            goToSlide(currentSlide - 1);
        } else {
            // Возвращаемся к текущему слайду, если свайп недостаточный
            goToSlide(currentSlide);
        }
    }, { passive: true });


    // Обработчики свайпа для мыши (для десктопов)
    sliderContainer.addEventListener('mousedown', (e) => {
        startX = e.clientX;
        sliderContainer.style.cursor = 'grabbing';
    });

    sliderContainer.addEventListener('mousemove', (e) => {
        if (startX === 0) return;

        endX = e.clientX;
        const diff = startX - endX;
        const slideWidth = slides[0].offsetWidth +
            parseInt(getComputedStyle(sliderContainer).gap);
        const currentOffset = currentSlide * slideWidth;

        sliderContainer.style.transition = 'none';
        sliderContainer.style.transform = `translateX(calc(-${currentOffset}px + ${-diff}px))`;
    });

    sliderContainer.addEventListener('mouseup', () => {
        if (startX === 0) return;

        const diff = startX - endX;

        if (diff > swipeThreshold) {
            goToSlide(currentSlide + 1);
        } else if (diff < -swipeThreshold) {
            goToSlide(currentSlide - 1);
        } else {
            goToSlide(currentSlide);
        }

        startX = 0;
        endX = 0;
        sliderContainer.style.cursor = '';
    });

    sliderContainer.addEventListener('mouseleave', () => {
        if (startX !== 0) {
            goToSlide(currentSlide);
            startX = 0;
            endX = 0;
            sliderContainer.style.cursor = '';
        }
    });


    // Адаптация при изменении размера окна
    window.addEventListener('resize', () => {
        if (window.matchMedia('(min-width: 768px) and (max-width: 1024px)').matches) {
            // Для планшетов корректируем currentSlide
            currentSlide = Math.min(currentSlide, Math.ceil(slideCount / 2) - 1);
        }
        goToSlide(currentSlide, false);
    });


    // Инициализация начального положения
    goToSlide(0, false);
});