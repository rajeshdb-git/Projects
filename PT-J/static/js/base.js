document.addEventListener("DOMContentLoaded", function () {

    const menuButton =
        document.getElementById("menu-button");

    const navigation =
        document.getElementById("header_ryt");

    const services =
        document.querySelector(".services");


    /* MOBILE MENU */

    if (menuButton && navigation) {

        menuButton.addEventListener("click", function () {

            navigation.classList.toggle("active");

            const icon =
                menuButton.querySelector("i");

            if (navigation.classList.contains("active")) {

                icon.classList.remove("fa-bars");

                icon.classList.add("fa-xmark");

            } else {

                icon.classList.remove("fa-xmark");

                icon.classList.add("fa-bars");

            }

        });

    }


    /* MOBILE SERVICES DROPDOWN */

    if (services) {

        const serviceLink =
            services.querySelector(".header-a");


        serviceLink.addEventListener("click", function (event) {

            if (window.innerWidth <= 768) {

                event.preventDefault();

                services.classList.toggle("active");

            }

        });

    }

});

document.addEventListener("DOMContentLoaded", function () {


    /* =========================================
       MOBILE MENU
       ========================================= */

    const menuButton =
        document.getElementById("menu-button");

    const navigation =
        document.getElementById("header_ryt");

    const services =
        document.querySelector(".services");


    if (menuButton && navigation) {

        menuButton.addEventListener(
            "click",
            function () {

                navigation.classList.toggle("active");

                const icon =
                    menuButton.querySelector("i");


                if (
                    navigation.classList.contains("active")
                ) {

                    icon.classList.remove("fa-bars");

                    icon.classList.add("fa-xmark");

                } else {

                    icon.classList.remove("fa-xmark");

                    icon.classList.add("fa-bars");

                }

            }
        );

    }


    /* =========================================
       MOBILE SERVICES DROPDOWN
       ========================================= */

    if (services) {

        const serviceLink =
            services.querySelector(".header-a");


        if (serviceLink) {

            serviceLink.addEventListener(
                "click",
                function (event) {

                    if (window.innerWidth <= 768) {

                        event.preventDefault();

                        services.classList.toggle(
                            "active"
                        );

                    }

                }
            );

        }

    }


    /* =========================================
       BOOK APPOINTMENT POPUP
       ========================================= */

    const appointmentOverlay =
        document.getElementById(
            "appointment-overlay"
        );

    const appointmentClose =
        document.getElementById(
            "appointment-close"
        );


    /*
       We use querySelectorAll because
       you may have Book Appointment buttons
       in different sections of the Home page.
    */

    const appointmentButtons =
        document.querySelectorAll(
            "#open-appointment, .open-appointment"
        );


    /* OPEN POPUP */

    appointmentButtons.forEach(
        function (button) {

            button.addEventListener(
                "click",
                function () {

                    appointmentOverlay.classList.add(
                        "active"
                    );

                    document.body.style.overflow =
                        "hidden";

                }
            );

        }
    );


    /* CLOSE POPUP */

    if (appointmentClose) {

        appointmentClose.addEventListener(
            "click",
            closeAppointment
        );

    }


    /* CLICK OUTSIDE */

    if (appointmentOverlay) {

        appointmentOverlay.addEventListener(
            "click",
            function (event) {

                if (
                    event.target ===
                    appointmentOverlay
                ) {

                    closeAppointment();

                }

            }
        );

    }


    /* ESC KEY */

    document.addEventListener(
        "keydown",
        function (event) {

            if (
                event.key === "Escape" &&
                appointmentOverlay &&
                appointmentOverlay.classList.contains(
                    "active"
                )
            ) {

                closeAppointment();

            }

        }
    );


    function closeAppointment() {

        appointmentOverlay.classList.remove(
            "active"
        );

        document.body.style.overflow = "";

    }


});
document.addEventListener("DOMContentLoaded", function () {


    /* =========================================
       MOBILE MENU
       ========================================= */

    const menuButton =
        document.getElementById("menu-button");

    const navigation =
        document.getElementById("header_ryt");


    if (menuButton && navigation) {

        menuButton.addEventListener(
            "click",
            function () {

                navigation.classList.toggle("active");


                const icon =
                    menuButton.querySelector("i");


                if (
                    navigation.classList.contains("active")
                ) {

                    icon.classList.remove("fa-bars");

                    icon.classList.add("fa-xmark");

                } else {

                    icon.classList.remove("fa-xmark");

                    icon.classList.add("fa-bars");

                }

            }
        );

    }


    /* =========================================
       SERVICES MOBILE DROPDOWN
       ========================================= */

    const services =
        document.querySelector(".services");


    if (services) {

        const serviceLink =
            services.querySelector(".header-a");


        if (serviceLink) {

            serviceLink.addEventListener(
                "click",
                function (event) {

                    if (window.innerWidth <= 768) {

                        event.preventDefault();

                        services.classList.toggle(
                            "active"
                        );

                    }

                }
            );

        }

    }


    /* =========================================
       APPOINTMENT POPUP
       ========================================= */

    const appointmentOverlay =
        document.getElementById(
            "appointment-overlay"
        );


    const appointmentClose =
        document.getElementById(
            "appointment-close"
        );


    const appointmentButtons =
        document.querySelectorAll(
            ".open-appointment"
        );


    /* OPEN */

    appointmentButtons.forEach(
        function (button) {

            button.addEventListener(
                "click",
                function () {

                    if (appointmentOverlay) {

                        appointmentOverlay.classList.add(
                            "active"
                        );

                        document.body.style.overflow =
                            "hidden";

                    }

                }
            );

        }
    );


    /* CLOSE */

    if (appointmentClose) {

        appointmentClose.addEventListener(
            "click",
            function () {

                closeAppointment();

            }
        );

    }


    /* CLICK OUTSIDE */

    if (appointmentOverlay) {

        appointmentOverlay.addEventListener(
            "click",
            function (event) {

                if (
                    event.target ===
                    appointmentOverlay
                ) {

                    closeAppointment();

                }

            }
        );

    }


    /* ESCAPE */

    document.addEventListener(
        "keydown",
        function (event) {

            if (
                event.key === "Escape" &&
                appointmentOverlay &&
                appointmentOverlay.classList.contains(
                    "active"
                )
            ) {

                closeAppointment();

            }

        }
    );


    function closeAppointment() {

        if (appointmentOverlay) {

            appointmentOverlay.classList.remove(
                "active"
            );

        }

        document.body.style.overflow = "";

    }

});