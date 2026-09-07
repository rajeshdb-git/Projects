document.addEventListener("DOMContentLoaded", () => {
    const navigationLinks = [...document.querySelectorAll(".nav a")];
    const sections = navigationLinks
        .map((link) => document.querySelector(link.getAttribute("href")))
        .filter(Boolean);
    const contactForm = document.querySelector("#contact-form");
    const formStatus = document.querySelector(".form-status");
    const hireButton = document.querySelector(".hire-button");

    const setActiveLink = (sectionId) => {
        navigationLinks.forEach((link) => {
            link.classList.toggle("active", link.getAttribute("href") === `#${sectionId}`);
        });
    };

    navigationLinks.forEach((link) => {
        link.addEventListener("click", () => setActiveLink(link.getAttribute("href").slice(1)));
    });

    if ("IntersectionObserver" in window) {
        const sectionObserver = new IntersectionObserver(
            (entries) => {
                const visibleSection = entries
                    .filter((entry) => entry.isIntersecting)
                    .sort((first, second) => second.intersectionRatio - first.intersectionRatio)[0];

                if (visibleSection) {
                    setActiveLink(visibleSection.target.id);
                }
            },
            { rootMargin: "-25% 0px -60%", threshold: [0, 0.25, 0.5] }
        );

        sections.forEach((section) => sectionObserver.observe(section));
    }

    hireButton?.addEventListener("click", () => {
        document.querySelector("#contact")?.scrollIntoView({ behavior: "smooth" });
        document.querySelector("input[name='name']")?.focus({ preventScroll: true });
    });

    contactForm?.addEventListener("submit", (event) => {
        event.preventDefault();
        const fields = [...contactForm.querySelectorAll("input, textarea")];
        const invalidFields = fields.filter((field) => !field.value.trim() || !field.checkValidity());

        fields.forEach((field) => field.classList.toggle("invalid", invalidFields.includes(field)));

        if (invalidFields.length > 0) {
            formStatus.textContent = "Please enter a valid name, email address, and message.";
            formStatus.className = "form-status error";
            invalidFields[0].focus();
            return;
        }

        const name = contactForm.elements.name.value.trim();
        const email = contactForm.elements.email.value.trim();
        const message = contactForm.elements.message.value.trim();
        const whatsappMessage = `Hello Rajesh,\n\nName: ${name}\nEmail: ${email}\nMessage: ${message}`;
        const whatsappUrl = `https://wa.me/917204750258?text=${encodeURIComponent(whatsappMessage)}`;

        window.open(whatsappUrl, "_blank", "noopener,noreferrer");
        formStatus.textContent = "Opening WhatsApp with your message...";
        formStatus.className = "form-status success";
        contactForm.reset();
    });
});