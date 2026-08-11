document.addEventListener("DOMContentLoaded", function () {

    const body = document.body;

    body.classList.add("secpack-ready");

    const cards = document.querySelectorAll(
        ".card, .knowledge-card, .why-card"
    );

    cards.forEach(function (card, index) {
        card.style.setProperty(
            "--card-delay",
            `${index * 70}ms`
        );
    });


    const buttons = document.querySelectorAll(
        "button, .primary-action, .secondary-action, .support-action, .hero-link"
    );

    buttons.forEach(function (button) {

        button.addEventListener("click", function () {

            button.classList.add("secpack-clicked");

            setTimeout(function () {
                button.classList.remove("secpack-clicked");
            }, 180);

        });

    });


    const currentPath = window.location.pathname;

    document.querySelectorAll(".site-navigation a").forEach(function (link) {

        const linkPath = new URL(
            link.href,
            window.location.origin
        ).pathname;

        if (linkPath === currentPath) {
            link.classList.add("active");
        }

    });


    const languageButtons = document.querySelectorAll(
        ".languages button"
    );

    const savedLanguage =
        localStorage.getItem("secpack_language") || "en";

    languageButtons.forEach(function (button) {

        const language = button.textContent
            .trim()
            .toLowerCase();

        if (language === savedLanguage) {
            button.classList.add("active-language");
        }

        button.addEventListener("click", function () {

            languageButtons.forEach(function (item) {
                item.classList.remove("active-language");
            });

            button.classList.add("active-language");

        });

    });


    const internalLinks = document.querySelectorAll(
        'a[href$=".html"]'
    );

    internalLinks.forEach(function (link) {

        link.addEventListener("click", function () {

            const destination = link.getAttribute("href");

            if (!destination || destination.startsWith("#")) {
                return;
            }

            sessionStorage.setItem(
                "secpack_last_page",
                window.location.pathname
            );

        });

    });


    const sections = document.querySelectorAll(
        "section"
    );

    if ("IntersectionObserver" in window) {

        const observer = new IntersectionObserver(
            function (entries) {

                entries.forEach(function (entry) {

                    if (entry.isIntersecting) {
                        entry.target.classList.add(
                            "section-visible"
                        );
                    }

                });

            },
            {
                threshold: 0.08
            }
        );

        sections.forEach(function (section) {
            observer.observe(section);
        });

    } else {

        sections.forEach(function (section) {
            section.classList.add("section-visible");
        });

    }

});
