document.addEventListener("DOMContentLoaded", function () {

    const viewMoreButton =
        document.getElementById(
            "view-more-conditions"
        );


    const extraCards =
        document.querySelectorAll(
            ".extra-condition"
        );


    if (!viewMoreButton) {
        return;
    }


    viewMoreButton.addEventListener(
        "click",
        function () {

            const isOpen =
                viewMoreButton.classList.contains(
                    "active"
                );


            extraCards.forEach(function (card) {

                if (isOpen) {

                    card.classList.remove("show");

                } else {

                    card.classList.add("show");

                }

            });


            viewMoreButton.classList.toggle(
                "active"
            );


            const text =
                viewMoreButton.querySelector(
                    "span"
                );


            if (isOpen) {

                text.textContent = "View More";

            } else {

                text.textContent = "View Less";

            }

        }
    );

});