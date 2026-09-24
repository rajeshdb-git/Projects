document.addEventListener("DOMContentLoaded", function () {

    /* =========================================
       OUR PROGRESS - SCROLLING TIMELINE
       ========================================= */

    const timeline = document.querySelector(".progress-timeline");
    const fillLine = document.querySelector(".progress-line-fill");
    const steps = document.querySelectorAll(".progress-step");


    function updateProgress() {

        if (!timeline || !fillLine) {
            return;
        }

        const timelineRect =
            timeline.getBoundingClientRect();

        const viewportCenter =
            window.innerHeight * 0.5;

        let progress =
            (viewportCenter - timelineRect.top) /
            timelineRect.height;

        progress = Math.max(0, Math.min(1, progress));

        fillLine.style.height =
            (progress * 100) + "%";


        steps.forEach(function (step) {

            const stepRect =
                step.getBoundingClientRect();

            const stepCenter =
                stepRect.top +
                (stepRect.height / 2);

            if (stepCenter <= viewportCenter) {

                step.classList.add("active");

            } else {

                step.classList.remove("active");

            }

        });

    }


    window.addEventListener(
        "scroll",
        updateProgress
    );

    window.addEventListener(
        "resize",
        updateProgress
    );

    updateProgress();



    /* =========================================
       OUR SPECIALIZATIONS - CAROUSEL
       ========================================= */

    const track =
        document.getElementById(
            "specializations-track"
        );

    const nextButton =
        document.getElementById(
            "specialization-next"
        );

    const prevButton =
        document.getElementById(
            "specialization-prev"
        );

    const dotsContainer =
        document.getElementById(
            "specialization-dots"
        );

    const cards =
        document.querySelectorAll(
            ".specialization-card"
        );


    /*
       Stop here if the specialization
       section doesn't exist.
    */

    if (!track || !cards.length) {
        return;
    }


    let currentIndex = 0;


    /* =========================================
       CARDS PER VIEW
       ========================================= */

    function getCardsPerView() {

        if (window.innerWidth <= 600) {
            return 1;
        }

        if (window.innerWidth <= 1000) {
            return 2;
        }

        return 4;
    }


    /* =========================================
       MAXIMUM SLIDE
       ========================================= */

    function getMaxIndex() {

        const cardsPerView =
            getCardsPerView();

        return Math.max(
            0,
            cards.length - cardsPerView
        );
    }


    /* =========================================
       UPDATE SLIDER
       ========================================= */

    function updateSlider() {

        const cardWidth =
            cards[0].getBoundingClientRect().width;

        const gap = 18;

        const moveAmount =
            (cardWidth + gap) *
            currentIndex;

        track.style.transform =
            `translateX(-${moveAmount}px)`;

        updateDots();
    }


    /* =========================================
       NEXT BUTTON
       ========================================= */

    if (nextButton) {

        nextButton.addEventListener(
            "click",
            function () {

                const maxIndex =
                    getMaxIndex();

                currentIndex++;

                if (currentIndex > maxIndex) {

                    currentIndex = 0;

                }

                updateSlider();

            }
        );

    }


    /* =========================================
       PREVIOUS BUTTON
       ========================================= */

    if (prevButton) {

        prevButton.addEventListener(
            "click",
            function () {

                const maxIndex =
                    getMaxIndex();

                currentIndex--;

                if (currentIndex < 0) {

                    currentIndex = maxIndex;

                }

                updateSlider();

            }
        );

    }


    /* =========================================
       CREATE DOTS
       ========================================= */

    function createDots() {

        if (!dotsContainer) {
            return;
        }

        dotsContainer.innerHTML = "";

        const maxIndex =
            getMaxIndex();


        for (
            let i = 0;
            i <= maxIndex;
            i++
        ) {

            const dot =
                document.createElement("span");

            dot.classList.add(
                "specialization-dot"
            );


            if (i === currentIndex) {

                dot.classList.add("active");

            }


            dot.addEventListener(
                "click",
                function () {

                    currentIndex = i;

                    updateSlider();

                }
            );


            dotsContainer.appendChild(dot);

        }

    }


    /* =========================================
       UPDATE DOTS
       ========================================= */

    function updateDots() {

        const dots =
            document.querySelectorAll(
                ".specialization-dot"
            );


        dots.forEach(
            function (dot, index) {

                if (index === currentIndex) {

                    dot.classList.add("active");

                } else {

                    dot.classList.remove("active");

                }

            }
        );

    }


    /* =========================================
       WINDOW RESIZE
       ========================================= */

    window.addEventListener(
        "resize",
        function () {

            const maxIndex =
                getMaxIndex();


            if (currentIndex > maxIndex) {

                currentIndex = maxIndex;

            }


            createDots();

            updateSlider();

        }
    );


    /* =========================================
       INITIALIZE
       ========================================= */

    createDots();

    updateSlider();

});