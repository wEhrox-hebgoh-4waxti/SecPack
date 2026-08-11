const supportedLanguages = ["en", "fa", "ar"];

function changeLanguage(language) {
    if (!supportedLanguages.includes(language)) {
        return;
    }

    localStorage.setItem("secpack_language", language);

    document.documentElement.lang = language;
    document.documentElement.dir = language === "fa" || language === "ar"
        ? "rtl"
        : "ltr";

    applyLanguage(language);
}

function getCurrentLanguage() {
    return localStorage.getItem("secpack_language") || "en";
}

function applyLanguage(language) {
    const currentLanguage = language || getCurrentLanguage();

    document.documentElement.lang = currentLanguage;
    document.documentElement.dir =
        currentLanguage === "fa" || currentLanguage === "ar"
            ? "rtl"
            : "ltr";

    document.body.classList.remove(
        "lang-en",
        "lang-fa",
        "lang-ar"
    );

    document.body.classList.add(
        `lang-${currentLanguage}`
    );

    if (typeof window.updatePageLanguage === "function") {
        window.updatePageLanguage(currentLanguage);
    }
}

document.addEventListener("DOMContentLoaded", function () {
    applyLanguage(getCurrentLanguage());
});
