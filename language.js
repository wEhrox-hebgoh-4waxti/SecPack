(function () {
  "use strict";

  /*
   * SEC PACK multilingual site layer.
   * English is the source language. FA and AR use Google Translate's
   * page translation so newly added public text is translated too.
   * The visible EN / FA / AR buttons remain the site's language control.
   */
  const KEY = "secpack-lang";
  const SUPPORTED = ["en","fa","ar"];

  function addWidget() {
    if (document.getElementById("google_translate_element")) return;
    const el = document.createElement("div");
    el.id = "google_translate_element";
    el.setAttribute("aria-hidden","true");
    el.style.cssText = "position:fixed;left:-9999px;top:-9999px;width:1px;height:1px;overflow:hidden;";
    document.body.appendChild(el);
  }

  window.googleTranslateElementInit = function () {
    if (!window.google || !google.translate || !google.translate.TranslateElement) return;
    new google.translate.TranslateElement({
      pageLanguage: "en",
      includedLanguages: "en,fa,ar",
      autoDisplay: false
    }, "google_translate_element");
  };

  function loadGoogleTranslate() {
    addWidget();
    if (document.getElementById("secpack-google-translate")) return;
    const s = document.createElement("script");
    s.id = "secpack-google-translate";
    s.src = "https://translate.google.com/translate_a/element.js?cb=googleTranslateElementInit";
    s.async = true;
    document.head.appendChild(s);
  }

  function chooseGoogleLanguage(lang) {
    const select = document.querySelector(".goog-te-combo");
    if (!select) return false;
    select.value = lang;
    select.dispatchEvent(new Event("change", {bubbles:true}));
    return true;
  }

  function setLanguage(lang) {
    lang = SUPPORTED.includes(lang) ? lang : "en";
    localStorage.setItem(KEY, lang);
    document.documentElement.lang = lang;
    document.documentElement.dir = (lang === "fa" || lang === "ar") ? "rtl" : "ltr";

    document.querySelectorAll("[data-lang]").forEach(btn => {
      btn.classList.toggle("on", btn.dataset.lang === lang);
      btn.classList.toggle("active-language", btn.dataset.lang === lang);
    });

    if (lang === "en") {
      // Reset Google Translate without reloading the page.
      const reset = document.querySelector(".goog-te-combo");
      if (reset) {
        reset.value = "en";
        reset.dispatchEvent(new Event("change", {bubbles:true}));
      } else {
        const frame = document.querySelector(".goog-te-banner-frame");
        if (frame) window.location.reload();
      }
      return;
    }

    loadGoogleTranslate();
    let tries = 0;
    const timer = setInterval(() => {
      if (chooseGoogleLanguage(lang) || ++tries > 30) clearInterval(timer);
    }, 250);
  }

  function init() {
    document.querySelectorAll("[data-lang]").forEach(btn => {
      btn.addEventListener("click", () => setLanguage(btn.dataset.lang));
    });

    const saved = localStorage.getItem(KEY) || "en";
    setLanguage(saved);
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", init, {once:true});
  } else {
    init();
  }
})();