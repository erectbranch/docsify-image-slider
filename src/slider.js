window.$docsify = window.$docsify || {};
window.$docsify.plugins = (window.$docsify.plugins || []).concat((hook, vm) => {
    const slideRegEx = /\[\[slider\]\]\((.+?)\)/g;

    const slideConfig = vm.config.slider || {};
    const auto = slideConfig["auto"] || false;
    const intervalTime = slideConfig["intervalTime"] || 20000;
    const hideToolbar = slideConfig["hideToolbar"] || false;

    function renderSlider(imageUrls) {
        let sliderContent = "";

        sliderContent += `  <div class="image-slider">
        <div class="slider-wrapper">
            <button class="slider-buttons" id="prev-slide">
                <i class="fas fa-arrow-left"></i>
            </button>
            <div class="slider">
                <div class="slide current"></div>
                ${imageUrls.map((_, index) => {
                    if (index === 0) {
                        return "";
                    } else {
                        return `<div class="slide"></div>`;
                    }
                }).join('')}
            </div>
            <button class="slider-buttons" id="next-slide">
                <i class="fas fa-arrow-right"></i>
            </button>`;
        
        if (!hideToolbar) {
            sliderContent += `
            <div class="slider-toolbar">
                <button class="slider-tool-buttons" id="fullscreen">
                    <i class="fa-solid fa-up-right-and-down-left-from-center"></i>
                </button>
            </div>`
        }

        sliderContent += `
            <div class="slider-bullets">
                ${imageUrls.map((_, index) => {
                    return `<span class="bullet${index === 0 ? ' active' : ''}" data-index="${index}"></span>`;
                }).join('')}
            </div>
        </div>
    </div>`

        return sliderContent;
    }

    hook.beforeEach(content => {
        hasSlider = content.includes("[[slider]](");
        
        return content.replace(slideRegEx, (string, urls) => {
            const imageUrls = urls.split('|').map(url => url.trim()).filter(url => url !== "");

            cssStyles = imageUrls.map((url, index) => {
                if (index === 0) {
                    return `.slide:first-child { background: url("${url}"); }`;
                } else {
                    return `.slide:nth-child(${index + 1}) { background: url("${url}"); }`;
                }
            }).join('\n');
            
            return string.replace(
                string, renderSlider(imageUrls)
            );
        });
    });

    hook.doneEach(() => {
        if (!hasSlider) return;

        const sliderPageDiv = document.getElementsByClassName("image-slider")[0];
        sliderPageDiv.innerHTML += `<style>${cssStyles}</style>`;

        let slideInterval;

        const updateBullets = () => {
            const bullets = document.querySelectorAll('.bullet');
            const slides = document.querySelectorAll('.slide');
            const currentIndex = Array.from(slides).findIndex(slide => slide.classList.contains('current'));
            bullets.forEach((b, i) => {
                b.classList.toggle('active', i === currentIndex);
            });
        };
        
        const nextSlide = () => {
            const slides = document.querySelectorAll(".slide");
            const current = document.querySelector(".current");
            current.classList.remove("current");
            if (current.nextElementSibling) {
              current.nextElementSibling.classList.add("current");
            } else {
              slides[0].classList.add("current");
            }
            updateBullets();
        };

        const prevSlide = () => {
            const slides = document.querySelectorAll(".slide");
            const current = document.querySelector(".current");
            current.classList.remove("current");
            if (current.previousElementSibling) {
              current.previousElementSibling.classList.add("current");
            } else {
              slides[slides.length - 1].classList.add("current");
            }
            updateBullets();
        };

        document.addEventListener('click', (event) => {
            if (event.target.id === 'next-slide') {
                nextSlide();
                if (auto) {
                    clearInterval(slideInterval);
                    slideInterval = setInterval(nextSlide, intervalTime);
                }
            }
            if (event.target.id === 'prev-slide') {
                prevSlide();
                if (auto) {
                    clearInterval(slideInterval);
                    slideInterval = setInterval(nextSlide, intervalTime);
                }
            }
            if (event.target.classList.contains('bullet')) {
                const index = parseInt(event.target.getAttribute('data-index'), 10);
                const slides = document.querySelectorAll('.slide');
                document.querySelector('.slide.current').classList.remove('current');
                slides[index].classList.add('current');
                updateBullets();
                if (auto) {
                    clearInterval(slideInterval);
                    slideInterval = setInterval(nextSlide, intervalTime);
                }
            }
            if (event.target.id === 'fullscreen') {
                const sliderWrapper = document.querySelector('.slider-wrapper');
                if (!document.fullscreenElement) {
                    sliderWrapper.requestFullscreen?.() ||
                    sliderWrapper.webkitRequestFullscreen?.() ||
                    sliderWrapper.mozRequestFullScreen?.() ||
                    sliderWrapper.msRequestFullscreen?.();
                } else {
                    document.exitFullscreen?.() ||
                    document.webkitExitFullscreen?.() ||
                    document.mozCancelFullScreen?.() ||
                    document.msExitFullscreen?.();
                }
            }
        });

        if (auto) {
            slideInterval = setInterval(nextSlide, intervalTime);
        }
    });
});