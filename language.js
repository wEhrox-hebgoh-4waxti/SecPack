(function () {

    const translations = {

        en: {
            direction: "ltr",
            htmlLang: "en",

            nav: {
                home: "Home",
                products: "Products",
                store: "Store",
                dashboard: "Dashboard",
                contact: "Contact"
            },

            language: {
                en: "English",
                fa: "فارسی",
                ar: "العربية"
            },

            common: {
                exploreProducts: "Explore Products",
                requestSolution: "Request a Solution",
                requestQuote: "Request a Quote",
                contactSecPack: "Contact SecPack",
                technicalInformation: "Technical Information"
            }
        },

        fa: {
            direction: "rtl",
            htmlLang: "fa",

            nav: {
                home: "خانه",
                products: "محصولات",
                store: "فروشگاه",
                dashboard: "داشبورد",
                contact: "تماس با ما"
            },

            language: {
                en: "English",
                fa: "فارسی",
                ar: "العربية"
            },

            common: {
                exploreProducts: "مشاهده محصولات",
                requestSolution: "درخواست راهکار",
                requestQuote: "درخواست قیمت",
                contactSecPack: "تماس با سک‌پک",
                technicalInformation: "اطلاعات فنی"
            }
        },

        ar: {
            direction: "rtl",
            htmlLang: "ar",

            nav: {
                home: "الرئيسية",
                products: "المنتجات",
                store: "المتجر",
                dashboard: "لوحة التحكم",
                contact: "اتصل بنا"
            },

            language: {
                en: "English",
                fa: "فارسی",
                ar: "العربية"
            },

            common: {
                exploreProducts: "استكشف المنتجات",
                requestSolution: "طلب حل",
                requestQuote: "طلب عرض سعر",
                contactSecPack: "اتصل بـ SecPack",
                technicalInformation: "المعلومات الفنية"
            }
        }

    };


    function getLanguage() {

        const saved = localStorage.getItem("secpack-language");

        if (saved && translations[saved]) {
            return saved;
        }

        const browserLanguage =
            (navigator.language || navigator.userLanguage || "en")
            .toLowerCase();

        if (browserLanguage.startsWith("fa")) {
            return "fa";
        }

        if (browserLanguage.startsWith("ar")) {
            return "ar";
        }

        return "en";
    }


    function setLanguage(language) {

        if (!translations[language]) {
            language = "en";
        }

        localStorage.setItem(
            "secpack-language",
            language
        );

        applyLanguage(language);
    }


    function applyLanguage(language) {

        const dictionary = translations[language];

        if (!dictionary) {
            return;
        }

        document.documentElement.lang =
            dictionary.htmlLang;

        document.documentElement.dir =
            dictionary.direction;


        /*
         * Navigation
         */

        const navigation = document.querySelectorAll(
            ".site-navigation a"
        );

        if (navigation.length >= 5) {

            navigation[0].textContent =
                dictionary.nav.home;

            navigation[1].textContent =
                dictionary.nav.products;

            navigation[2].textContent =
                dictionary.nav.store;

            navigation[3].textContent =
                dictionary.nav.dashboard;

            navigation[4].textContent =
                dictionary.nav.contact;
        }


        /*
         * Language buttons
         */

        const languageButtons =
            document.querySelectorAll(
                "[data-language]"
            );

        languageButtons.forEach(button => {

            const code =
                button.getAttribute("data-language");

            if (dictionary.language[code]) {

                button.textContent =
                    dictionary.language[code];

            }

            button.classList.toggle(
                "active-language",
                code === language
            );

        });


        /*
         * Basic button translations
         */

        document.querySelectorAll(
            '[data-i18n]'
        ).forEach(element => {

            const key =
                element.getAttribute("data-i18n");

            const parts =
                key.split(".");

            let value = dictionary;

            parts.forEach(part => {

                if (
                    value &&
                    Object.prototype.hasOwnProperty.call(
                        value,
                        part
                    )
                ) {
                    value = value[part];
                }

            });

            if (typeof value === "string") {
                element.textContent = value;
            }

        });


        /*
         * Body direction
         */

        if (dictionary.direction === "rtl") {

            document.body.classList.add(
                "rtl-language"
            );

        } else {

            document.body.classList.remove(
                "rtl-language"
            );

        }


        /*
         * Notify other scripts
         */

        document.dispatchEvent(
            new CustomEvent(
                "secpackLanguageChanged",
                {
                    detail: {
                        language: language
                    }
                }
            )
        );

    }


    window.changeLanguage = function (language) {

        setLanguage(language);

    };


    window.getSecPackLanguage = function () {

        return getLanguage();

    };


    window.SecPackTranslations =
        translations;


    document.addEventListener(
        "DOMContentLoaded",
        function () {

            applyLanguage(
                getLanguage()
            );

        }
    );

})();
