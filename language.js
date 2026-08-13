const SecPackTranslations = {

    en: {
        name: "English",
        htmlLang: "en",
        direction: "ltr"
    },

    fa: {
        name: "فارسی",
        htmlLang: "fa",
        direction: "rtl"
    },

    ar: {
        name: "العربية",
        htmlLang: "ar",
        direction: "rtl"
    }

};


function changeLanguage(language) {

    if (!SecPackTranslations[language]) {
        language = "en";
    }

    localStorage.setItem(
        "secpack_language",
        language
    );

    applyLanguage(language);

    window.location.reload();

}


function applyLanguage(language) {

    const settings =
        SecPackTranslations[language];

    if (!settings) {
        return;
    }

    document.documentElement.lang =
        settings.htmlLang;

    document.documentElement.dir =
        settings.direction;

    document.body.classList.remove(
        "lang-en",
        "lang-fa",
        "lang-ar"
    );

    document.body.classList.add(
        "lang-" + language
    );

    updateLanguageButtons(language);

    translatePage(language);

}


function updateLanguageButtons(language) {

    document.querySelectorAll(
        ".languages button"
    ).forEach(function(button) {

        const buttonLanguage =
            button.getAttribute(
                "data-language"
            );

        button.classList.remove(
            "active-language"
        );

        if (buttonLanguage === language) {

            button.classList.add(
                "active-language"
            );

        }

    });

}


const translations = {

    en: {},

    fa: {

        "Home": "خانه",
        "Products": "محصولات",
        "Store": "فروشگاه",
        "Dashboard": "داشبورد",
        "Contact": "تماس با ما",

        "Professional Packaging Materials Supplier":
        "تأمین‌کننده حرفه‌ای مواد بسته‌بندی",

        "Professional Packaging Materials":
        "مواد بسته‌بندی حرفه‌ای",

        "Smart Packaging Materials.":
        "مواد بسته‌بندی هوشمند.",

        "Technical Knowledge.":
        "دانش فنی.",

        "Professional Solutions.":
        "راهکارهای حرفه‌ای.",

        "SecPack provides professional packaging materials, technical information and practical solutions for printing, lamination and packaging applications.":
        "SecPack مواد بسته‌بندی حرفه‌ای، اطلاعات فنی و راهکارهای عملی برای کاربردهای چاپ، لمینیشن و بسته‌بندی ارائه می‌کند.",

        "Explore Products":
        "مشاهده محصولات",

        "Request a Solution":
        "درخواست راهکار",

        "Professional Packaging Materials":
        "مواد بسته‌بندی حرفه‌ای",

        "Selected materials and practical information for printing, lamination and packaging professionals.":
        "مواد منتخب و اطلاعات کاربردی برای متخصصان چاپ، لمینیشن و بسته‌بندی.",

        "Lamination Films":
        "فیلم‌های لمینیشن",

        "Professional finishing materials for reliable lamination and high-quality printing applications.":
        "مواد حرفه‌ای تکمیلی برای لمینیشن مطمئن و چاپ باکیفیت.",

        "View Products →":
        "مشاهده محصولات ←",

        "Lamination Adhesives":
        "چسب‌های لمینیشن",

        "Water-based adhesive solutions for paper, film and packaging lamination applications.":
        "راهکارهای چسب پایه آب برای لمینیشن کاغذ، فیلم و بسته‌بندی.",

        "Packaging Materials":
        "مواد بسته‌بندی",

        "Professional materials supporting modern packaging production and converting requirements.":
        "مواد حرفه‌ای برای تولید مدرن بسته‌بندی و فرآیندهای تبدیلی.",

        "Industrial Solutions":
        "راهکارهای صنعتی",

        "Practical packaging material solutions for different industrial applications and production needs.":
        "راهکارهای کاربردی مواد بسته‌بندی برای کاربردهای صنعتی و نیازهای مختلف تولید.",

        "Discuss Requirements →":
        "بررسی نیازمندی‌ها ←",

        "Packaging Knowledge Center":
        "مرکز دانش بسته‌بندی",

        "Professional technical knowledge for printing, lamination and packaging professionals.":
        "دانش فنی حرفه‌ای برای متخصصان چاپ، لمینیشن و بسته‌بندی.",

        "Packaging Technology":
        "فناوری بسته‌بندی",

        "Technical Insights":
        "بینش فنی",

        "Industry Intelligence":
        "اطلاعات بازار صنعت",

        "Explore Information →":
        "مشاهده اطلاعات ←",

        "Technical Information →":
        "اطلاعات فنی ←",

        "Explore Market Intelligence →":
        "مشاهده اطلاعات بازار ←",

        "Professional Solutions":
        "راهکارهای حرفه‌ای",

        "Built Around Your Production Needs":
        "راهکارهایی متناسب با نیاز تولید شما",

        "Lamination":
        "لمینیشن",

        "Printing & Finishing":
        "چاپ و تکمیل",

        "Packaging Production":
        "تولید بسته‌بندی",

        "Need Help Selecting the Right Material?":
        "برای انتخاب ماده مناسب نیاز به کمک دارید؟",

        "Talk to SecPack":
        "ارتباط با SecPack",

        "Let's Build Better Packaging Solutions":
        "بیایید راهکارهای بهتری برای بسته‌بندی بسازیم",

        "Request a Quote":
        "درخواست قیمت",

        "Global Packaging Intelligence Platform for the printing and packaging industry.":
        "پلتفرم هوشمند اطلاعات بسته‌بندی برای صنعت چاپ و بسته‌بندی.",

        "Thermal Lamination Film":
        "فیلم لمینیشن حرارتی",

        "Water-Based Adhesive":
        "چسب پایه آب",

        "Knowledge Center":
        "مرکز دانش",

        "Market Intelligence":
        "اطلاعات بازار",

        "Supplier Intelligence":
        "اطلاعات تأمین‌کنندگان",

        "SecPack Enterprise © 2026":
        "SecPack Enterprise © ۲۰۲۶",

        "Professional Packaging Materials & Solutions":
        "مواد و راهکارهای حرفه‌ای بسته‌بندی"

    },

    ar: {

        "Home": "الرئيسية",
        "Products": "المنتجات",
        "Store": "المتجر",
        "Dashboard": "لوحة التحكم",
        "Contact": "اتصل بنا",

        "Professional Packaging Materials Supplier":
        "مورد محترف لمواد التغليف",

        "Professional Packaging Materials":
        "مواد تغليف احترافية",

        "Smart Packaging Materials.":
        "مواد تغليف ذكية.",

        "Technical Knowledge.":
        "معرفة تقنية.",

        "Professional Solutions.":
        "حلول احترافية.",

        "SecPack provides professional packaging materials, technical information and practical solutions for printing, lamination and packaging applications.":
        "توفر SecPack مواد تغليف احترافية ومعلومات تقنية وحلولاً عملية لتطبيقات الطباعة والتصفيح والتغليف.",

        "Explore Products":
        "استكشف المنتجات",

        "Request a Solution":
        "اطلب حلاً",

        "Selected materials and practical information for printing, lamination and packaging professionals.":
        "مواد مختارة ومعلومات عملية لمحترفي الطباعة والتصفيح والتغليف.",

        "Lamination Films":
        "أفلام التصفيح",

        "Professional finishing materials for reliable lamination and high-quality printing applications.":
        "مواد تشطيب احترافية للتصفيح الموثوق وتطبيقات الطباعة عالية الجودة.",

        "View Products →":
        "عرض المنتجات ←",

        "Lamination Adhesives":
        "مواد لاصقة للتصفيح",

        "Water-based adhesive solutions for paper, film and packaging lamination applications.":
        "حلول لاصقة مائية لتطبيقات تصفيح الورق والأفلام والتغليف.",

        "Packaging Materials":
        "مواد التغليف",

        "Professional materials supporting modern packaging production and converting requirements.":
        "مواد احترافية تدعم إنتاج التغليف الحديث ومتطلبات التحويل.",

        "Industrial Solutions":
        "حلول صناعية",

        "Practical packaging material solutions for different industrial applications and production needs.":
        "حلول عملية لمواد التغليف لمختلف التطبيقات الصناعية واحتياجات الإنتاج.",

        "Discuss Requirements →":
        "ناقش المتطلبات ←",

        "Packaging Knowledge Center":
        "مركز معرفة التغليف",

        "Professional technical knowledge for printing, lamination and packaging professionals.":
        "معرفة تقنية احترافية لمحترفي الطباعة والتصفيح والتغليف.",

        "Packaging Technology":
        "تقنيات التغليف",

        "Technical Insights":
        "رؤى تقنية",

        "Industry Intelligence":
        "معلومات الصناعة والسوق",

        "Explore Information →":
        "استكشف المعلومات ←",

        "Technical Information →":
        "المعلومات التقنية ←",

        "Explore Market Intelligence →":
        "استكشف معلومات السوق ←",

        "Professional Solutions":
        "حلول احترافية",

        "Built Around Your Production Needs":
        "حلول مصممة وفق احتياجات إنتاجك",

        "Lamination":
        "التصفيح",

        "Printing & Finishing":
        "الطباعة والتشطيب",

        "Packaging Production":
        "إنتاج التغليف",

        "Need Help Selecting the Right Material?":
        "هل تحتاج إلى مساعدة في اختيار المادة المناسبة؟",

        "Talk to SecPack":
        "تواصل مع SecPack",

        "Let's Build Better Packaging Solutions":
        "لنقدم حلول تغليف أفضل",

        "Request a Quote":
        "طلب عرض سعر",

        "Global Packaging Intelligence Platform for the printing and packaging industry.":
        "منصة عالمية لمعلومات التغليف لصناعة الطباعة والتغليف.",

        "Thermal Lamination Film":
        "فيلم التصفيح الحراري",

        "Water-Based Adhesive":
        "لاصق مائي",

        "Knowledge Center":
        "مركز المعرفة",

        "Market Intelligence":
        "معلومات السوق",

        "Supplier Intelligence":
        "معلومات الموردين",

        "SecPack Enterprise © 2026":
        "SecPack Enterprise © 2026",

        "Professional Packaging Materials & Solutions":
        "مواد وحلول تغليف احترافية"

    }

};


function translatePage(language) {

    if (
        language === "en" ||
        !translations[language]
    ) {
        return;
    }

    const dictionary =
        translations[language];

    translateTextNodes(
        document.body,
        dictionary
    );

}


function translateTextNodes(
    element,
    dictionary
) {

    const walker =
        document.createTreeWalker(
            element,
            NodeFilter.SHOW_TEXT
        );

    const nodes = [];

    let node;

    while (
        node = walker.nextNode()
    ) {

        if (
            node.parentElement &&
            (
                node.parentElement.tagName === "SCRIPT" ||
                node.parentElement.tagName === "STYLE"
            )
        ) {
            continue;
        }

        nodes.push(node);

    }


    nodes.forEach(function(node) {

        const original =
            node.nodeValue.trim();

        if (!original) {
            return;
        }

        if (
            dictionary[
                original
            ]
        ) {

            node.nodeValue =
                node.nodeValue.replace(
                    original,
                    dictionary[original]
                );

        }

    });

}


document.addEventListener(
    "DOMContentLoaded",
    function() {

        const savedLanguage =
            localStorage.getItem(
                "secpack_language"
            ) || "en";

        document.querySelectorAll(
            ".languages button"
        ).forEach(function(button) {

            const language =
                button.getAttribute(
                    "data-language"
                );

            if (
                SecPackTranslations[language]
            ) {

                button.textContent =
                    SecPackTranslations[
                        language
                    ].name;

            }

        });

        applyLanguage(
            savedLanguage
        );

    }
);<!DOCTYPE html>
<html lang="en" dir="ltr">

<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">

<title>SecPack | Professional Packaging Materials</title>

<link rel="stylesheet" href="style.css">
</head>

<body>

<header class="topbar">

<div class="logo-area">

<div class="logo-box">
<img src="logo.jpg" alt="SecPack Logo">
</div>

<div>
<h1>SecPack</h1>
<p>Professional Packaging Materials Supplier</p>
</div>

</div>


<nav class="site-navigation">

<a href="index.html">Home</a>
<a href="pages/products.html">Products</a>
<a href="pages/store.html">Store</a>
<a href="pages/dashboard.html">Dashboard</a>
<a href="pages/contact.html">Contact</a>

</nav>


<div class="languages">

<button
type="button"
data-language="en"
onclick="changeLanguage('en')">
English
</button>

<button
type="button"
data-language="fa"
onclick="changeLanguage('fa')">
فارسی
</button>

<button
type="button"
data-language="ar"
onclick="changeLanguage('ar')">
العربية
</button>

</div>

</header>


<main>


<section class="hero secpack-hero">

<div class="hero-content">

<div class="hero-badge">
SECPACK PROFESSIONAL PACKAGING
</div>

<h2 class="hero-title">

Smart Packaging Materials.<br>
Technical Knowledge.<br>
Professional Solutions.

</h2>

<p class="hero-description">

SecPack provides professional packaging materials,
technical information and practical solutions for
printing, lamination and packaging applications.

</p>

<div class="actions hero-actions">

<a href="pages/products.html">
<button>📦 Explore Products</button>
</a>

<a href="pages/contact.html">
<button class="secondary-action">
💬 Request a Solution
</button>
</a>

</div>

</div>

</section>



<section class="categories">

<div class="section-heading">

<span class="section-eyebrow">
SECPACK PLATFORM
</span>

<h2>
Professional Packaging Materials
</h2>

<p>
Selected materials and practical information for
printing, lamination and packaging professionals.
</p>

</div>


<div class="cards">


<article class="card">

<div class="card-icon">🎞️</div>

<h2>Lamination Films</h2>

<p>
Professional finishing materials for reliable
lamination and high-quality printing applications.
</p>

<strong>Explore Products</strong>

<a href="pages/products.html">
View Products →
</a>

</article>



<article class="card">

<div class="card-icon">🧪</div>

<h2>Lamination Adhesives</h2>

<p>
Water-based adhesive solutions for paper, film
and packaging lamination applications.
</p>

<strong>Technical Solutions</strong>

<a href="pages/products.html">
View Products →
</a>

</article>



<article class="card">

<div class="card-icon">📦</div>

<h2>Packaging Materials</h2>

<p>
Professional materials supporting modern packaging
production and converting requirements.
</p>

<strong>Production Materials</strong>

<a href="pages/products.html">
View Products →
</a>

</article>



<article class="card">

<div class="card-icon">🏭</div>

<h2>Industrial Solutions</h2>

<p>
Practical packaging material solutions for different
industrial applications and production needs.
</p>

<strong>Professional Support</strong>

<a href="pages/contact.html">
Discuss Requirements →
</a>

</article>

</div>

</section>



<section class="knowledge-center">

<div class="section-heading">

<span class="section-eyebrow">
SECPACK KNOWLEDGE
</span>

<h2>Packaging Knowledge Center</h2>

<p>
Professional technical knowledge for printing,
lamination and packaging professionals.
</p>

</div>


<div class="knowledge-grid">


<article class="knowledge-card">

<div class="knowledge-icon">📚</div>

<h3>Packaging Technology</h3>

<p>
Understand packaging materials, applications,
production processes and technical fundamentals.
</p>

<a href="pages/documents.html">
Explore Information →
</a>

</article>



<article class="knowledge-card">

<div class="knowledge-icon">🔬</div>

<h3>Technical Insights</h3>

<p>
Learn how material selection, quality and production
conditions affect final results.
</p>

<a href="pages/documents.html">
Technical Information →
</a>

</article>



<article class="knowledge-card">

<div class="knowledge-icon">🌍</div>

<h3>Industry Intelligence</h3>

<p>
Follow important developments and understand the
changing needs of the global packaging industry.
</p>

<a href="pages/market.html">
Explore Market Intelligence →
</a>

</article>

</div>

</section>



<section class="professional-support">

<div class="support-content">

<span class="section-eyebrow">
PROFESSIONAL SOLUTIONS
</span>

<h2>
Built Around Your Production Needs
</h2>

<p>
SecPack connects professional packaging materials
with practical technical requirements.
</p>


<div class="knowledge-grid">


<article class="knowledge-card">

<div class="knowledge-icon">🎞️</div>

<h3>Lamination</h3>

<p>
Material solutions for professional lamination
and finishing applications.
</p>

</article>



<article class="knowledge-card">

<div class="knowledge-icon">🖨️</div>

<h3>Printing &amp; Finishing</h3>

<p>
Packaging materials selected for reliable printing
and finishing performance.
</p>

</article>



<article class="knowledge-card">

<div class="knowledge-icon">📦</div>

<h3>Packaging Production</h3>

<p>
Practical material solutions for converters,
printers and packaging manufacturers.
</p>

</article>

</div>

</div>

</section>



<section class="quote">

<h2>
Need Help Selecting the Right Material?
</h2>

<p>
Tell us about your application, production process
and material requirements. SecPack can help you
identify the most suitable solution.
</p>

<a href="pages/contact.html">
<button>
Talk to SecPack
</button>
</a>

</section>



<section class="final-cta">

<div class="final-cta-content">

<span class="section-eyebrow">
SECPACK ENTERPRISE
</span>

<h2>
Let's Build Better Packaging Solutions
</h2>

<p>
Whether you need a specific packaging material,
technical guidance or a professional supply solution,
our team is ready to understand your requirements.
</p>

<div class="final-cta-actions">

<a href="pages/contact.html">
<button>
Request a Quote
</button>
</a>

<a href="pages/products.html">
<button class="secondary-action">
Explore Products
</button>
</a>

</div>

</div>

</section>

</main>



<footer class="site-footer">

<div class="footer-content">

<div class="footer-brand">

<h2>SecPack</h2>

<p>
Global Packaging Intelligence Platform
for the printing and packaging industry.
</p>

</div>


<div class="footer-links">

<div>

<h3>Products</h3>

<a href="pages/products.html">
Thermal Lamination Film
</a>

<a href="pages/products.html">
Water-Based Adhesive
</a>

<a href="pages/products.html">
Packaging Materials
</a>

</div>


<div>

<h3>Platform</h3>

<a href="index.html">
Home
</a>

<a href="pages/dashboard.html">
Dashboard
</a>

<a href="pages/store.html">
Store
</a>

</div>


<div>

<h3>Resources</h3>

<a href="pages/documents.html">
Knowledge Center
</a>

<a href="pages/market.html">
Market Intelligence
</a>

<a href="pages/supplier-profile.html">
Supplier Intelligence
</a>

</div>

</div>

</div>


<div class="footer-bottom">

<p>
SecPack Enterprise © 2026
</p>

<p>
Professional Packaging Materials &amp; Solutions
</p>

</div>

</footer>


<script src="language.js"></script>
<script src="script.js"></script>

</body>
</html>
