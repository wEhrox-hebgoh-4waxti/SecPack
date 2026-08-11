const translations = {
  en: {
    why_title: "Why SecPack",
    quality: "Premium Quality",
    quality_text: "Carefully selected packaging materials with consistent performance.",
    supply: "Reliable Supply",
    supply_text: "Stable sourcing and dependable delivery for long-term cooperation.",
    support: "Technical Support",
    support_text: "Professional assistance for selecting the right material.",
    standards: "Global Standards",
    standards_text: "Products suitable for professional printing and packaging industries.",
    products_title: "Our Products",
    film: "Thermal Lamination Film",
    film_text: "Premium lamination solutions.",
    adhesive: "Water-Based Adhesive",
    adhesive_text: "Reliable lamination adhesives.",
    materials: "Packaging Materials",
    materials_text: "Professional packaging products.",
    solutions: "Industrial Solutions",
    solutions_text: "Packaging solutions for modern industries.",
    quote_title: "Need a Quote?",
    quote_text: "Tell us your requirements and our team will contact you with the best solution.",
    quote_button: "Request a Quote"
  },

  fa: {
    why_title: "چرا SecPack",
    quality: "کیفیت ممتاز",
    quality_text: "مواد بسته‌بندی با دقت انتخاب شده و دارای عملکردی پایدار و قابل اعتماد.",
    supply: "تأمین مطمئن",
    supply_text: "تأمین پایدار و تحویل قابل اعتماد برای همکاری بلندمدت.",
    support: "پشتیبانی فنی",
    support_text: "راهنمایی تخصصی برای انتخاب مناسب‌ترین ماده.",
    standards: "استانداردهای جهانی",
    standards_text: "محصولات مناسب برای صنایع حرفه‌ای چاپ و بسته‌بندی.",
    products_title: "محصولات ما",
    film: "فیلم لمینیشن حرارتی",
    film_text: "راهکارهای حرفه‌ای لمینیشن.",
    adhesive: "چسب پایه آب",
    adhesive_text: "چسب‌های قابل اعتماد برای فرآیندهای لمینیشن.",
    materials: "مواد بسته‌بندی",
    materials_text: "محصولات حرفه‌ای بسته‌بندی.",
    solutions: "راهکارهای صنعتی",
    solutions_text: "راهکارهای بسته‌بندی برای صنایع مدرن.",
    quote_title: "نیاز به استعلام قیمت دارید؟",
    quote_text: "نیازمندی‌های خود را برای ما ارسال کنید تا تیم SecPack بهترین راهکار را به شما ارائه دهد.",
    quote_button: "درخواست استعلام قیمت"
  },

  ar: {
    why_title: "لماذا SecPack",
    quality: "جودة ممتازة",
    quality_text: "مواد تغليف مختارة بعناية مع أداء ثابت وموثوق.",
    supply: "توريد موثوق",
    supply_text: "توريد مستقر وتسليم موثوق للتعاون طويل الأمد.",
    support: "دعم فني",
    support_text: "مساعدة متخصصة لاختيار المواد المناسبة.",
    standards: "معايير عالمية",
    standards_text: "منتجات مناسبة لصناعات الطباعة والتغليف الاحترافية.",
    products_title: "منتجاتنا",
    film: "فيلم التصفيح الحراري",
    film_text: "حلول احترافية للتصفيح.",
    adhesive: "لاصق مائي",
    adhesive_text: "حلول لاصقة موثوقة لعمليات التصفيح.",
    materials: "مواد التغليف",
    materials_text: "مواد احترافية لإنتاج التغليف.",
    solutions: "حلول صناعية",
    solutions_text: "حلول تغليف للصناعات والتطبيقات الحديثة.",
    quote_title: "تحتاج إلى عرض سعر؟",
    quote_text: "أرسل متطلباتك وسيتواصل معك فريق SecPack بأفضل الحلول.",
    quote_button: "طلب عرض سعر"
  }
};

function changeLanguage(language) {
  const selectedLanguage =
    translations[language] ? language : "en";

  const elements = document.querySelectorAll("[data-i18n]");

  elements.forEach((element) => {
    const key = element.getAttribute("data-i18n");

    if (
      translations[selectedLanguage] &&
      translations[selectedLanguage][key]
    ) {
      element.textContent =
        translations[selectedLanguage][key];
    }
  });

  document.documentElement.lang = selectedLanguage;

  if (
    selectedLanguage === "fa" ||
    selectedLanguage === "ar"
  ) {
    document.documentElement.dir = "rtl";
  } else {
    document.documentElement.dir = "ltr";
  }

  localStorage.setItem(
    "secpack-language",
    selectedLanguage
  );
}

document.addEventListener("DOMContentLoaded", () => {
  const savedLanguage =
    localStorage.getItem("secpack-language") || "en";

  changeLanguage(savedLanguage);
});
