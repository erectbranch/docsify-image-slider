window.$docsify = window.$docsify || {};
window.$docsify.plugins = (window.$docsify.plugins || []).concat((hook, vm) => {
    const slideRegEx = /\[\[slider\]\]\((.+?)\)/g;

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
                string, `<div class="image-slider">
                            <div class="slider-wrapper">
                                <button class="slider-buttons" id="prev-slide">
                                    <i class="fas fa-arrow-left"></i>
                                </button>
                                <div class="slider">
                                    <div class="slide current"></div>
                                    ${imageUrls.map((url, index) => {
                                        console.log(index)
                                        console.log(imageUrls.length)
                                        if (index === 0) {
                                            return "";
                                        } else {
                                            return `<div class="slide"></div>`;
                                        }
                                    }).join('')}
                                </div>
                                <button class="slider-buttons" id="next-slide">
                                    <i class="fas fa-arrow-right"></i>
                                </button>
                            </div>
                        </div>`
            );
        });
    });

    hook.doneEach(() => {
        if (!hasSlider) return;

        const sliderPageDiv = document.getElementsByClassName("image-slider")[0];
        sliderPageDiv.innerHTML += `<style>${cssStyles}</style>`;

        const slideConfig = vm.config.slider || {};
        const auto = slideConfig["auto"] || false;
        const intervalTime = slideConfig["intervalTime"] || 20000;
        let slideInterval;

        const nextSlide = () => {
            const slides = document.querySelectorAll(".slide");
            const current = document.querySelector(".current");
            current.classList.remove("current");
            if (current.nextElementSibling) {
              current.nextElementSibling.classList.add("current");
            } else {
              slides[0].classList.add("current");
            }
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
        });

        if (auto) {
            slideInterval = setInterval(nextSlide, intervalTime);
        }
    });
});