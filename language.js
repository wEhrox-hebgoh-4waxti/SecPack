(function () {
    "use strict";

    const STORAGE_KEY = "secpack-language";
    const LANGUAGES = ["en", "fa", "ar"];

    const translations = {
        en: {
            "Home": "Home",
            "Products": "Products",
            "Store": "Store",
            "Dashboard": "Dashboard",
            "Contact": "Contact",
            "Resources": "Resources",
            "Platform": "Platform",
            "Knowledge Center": "Knowledge Center",
            "Market Intelligence": "Market Intelligence",
            "Supplier Intelligence": "Supplier Intelligence",

            "Professional Packaging Materials Supplier":
                "Professional Packaging Materials Supplier",
            "Professional Packaging Materials":
                "Professional Packaging Materials",
            "Global Packaging Intelligence Platform":
                "Global Packaging Intelligence Platform",

            "Materials.": "Materials.",
            "Technical Knowledge.": "Technical Knowledge.",
            "Professional Solutions.": "Professional Solutions.",

            "SECPACK PRODUCTS": "SECPACK PRODUCTS",
            "PRODUCT PORTFOLIO": "PRODUCT PORTFOLIO",
            "Available Materials": "Available Materials",
            "Explore SecPack materials by category and application.":
                "Explore SecPack materials by category and application.",

            "SECPACK DOCUMENT CENTER":
                "SECPACK DOCUMENT CENTER",
            "Technical & Procurement Documents":
                "Technical & Procurement Documents",
            "DOCUMENT CENTER":
                "DOCUMENT CENTER",
            "Professional Information Resources":
                "Professional Information Resources",
            "Technical Data":
                "Technical Data",
            "Quality Information":
                "Quality Information",
            "Product Information":
                "Product Information",
            "Procurement Records":
                "Procurement Records",
            "TECHNICAL KNOWLEDGE":
                "TECHNICAL KNOWLEDGE",

            "SECPACK MARKET INTELLIGENCE":
                "SECPACK MARKET INTELLIGENCE",
            "Packaging Industry Market Intelligence":
                "Packaging Industry Market Intelligence",
            "MARKET OVERVIEW":
                "MARKET OVERVIEW",
            "Global Packaging Market Focus":
                "Global Packaging Market Focus",
            "Lamination Films":
                "Lamination Films",
            "Lamination Adhesives":
                "Lamination Adhesives",
            "Packaging Materials":
                "Packaging Materials",
            "Supply Conditions":
                "Supply Conditions",
            "MARKET SIGNALS":
                "MARKET SIGNALS",
            "Price Conditions":
                "Price Conditions",
            "Demand Trends":
                "Demand Trends",
            "Supplier Capacity":
                "Supplier Capacity",
            "Regional Opportunities":
                "Regional Opportunities",

            "SECPACK SUPPLIER INTELLIGENCE":
                "SECPACK SUPPLIER INTELLIGENCE",
            "Supplier Evaluation Center":
                "Supplier Evaluation Center",
            "SUPPLIER NETWORK":
                "SUPPLIER NETWORK",
            "SUPPLIER SCORECARD":
                "SUPPLIER SCORECARD",
            "How SecPack Evaluates Suppliers":
                "How SecPack Evaluates Suppliers",
            "Cost Efficiency":
                "Cost Efficiency",
            "Quality Stability":
                "Quality Stability",
            "Batch Consistency":
                "Batch Consistency",
            "Response & Support":
                "Response & Support",

            "China": "China",
            "Pakistan": "Pakistan",
            "India": "India",
            "Global Network": "Global Network",

            "Request a Quote": "Request a Quote",
            "Request a Solution": "Request a Solution",
            "Request Information": "Request Information",
            "Request Technical Information":
                "Request Technical Information",
            "Request Supplier Support":
                "Request Supplier Support",
            "Explore Products": "Explore Products",
            "View Products": "View Products",
            "Open Dashboard": "Open Dashboard",
            "Review Suppliers": "Review Suppliers",
            "Review Documents": "Review Documents",
            "Discuss Requirements": "Discuss Requirements",
            "Contact SecPack": "Contact SecPack",
            "Email SecPack": "Email SecPack",

            "Thermal Lamination Film":
                "Thermal Lamination Film",
            "Water-Based Adhesive":
                "Water-Based Adhesive",

            "SecPack Enterprise © 2026":
                "SecPack Enterprise © 2026"
        },

        fa: {
            "Home": "خانه",
            "Products": "محصولات",
            "Store": "فروشگاه",
            "Dashboard": "داشبورد",
            "Contact": "تماس با ما",
            "Resources": "منابع",
            "Platform": "پلتفرم",
            "Knowledge Center": "مرکز دانش",
            "Market Intelligence": "اطلاعات بازار",
            "Supplier Intelligence": "اطلاعات تأمین‌کنندگان",

            "Professional Packaging Materials Supplier":
                "تأمین‌کننده حرفه‌ای مواد بسته‌بندی",
            "Professional Packaging Materials":
                "مواد بسته‌بندی حرفه‌ای",
            "Global Packaging Intelligence Platform":
                "پلتفرم اطلاعات جهانی صنعت بسته‌بندی",

            "Materials.": "مواد بسته‌بندی.",
            "Technical Knowledge.": "دانش فنی.",
            "Professional Solutions.": "راهکارهای حرفه‌ای.",

            "SECPACK PRODUCTS":
                "محصولات SECPACK",
            "PRODUCT PORTFOLIO":
                "سبد محصولات",
            "Available Materials":
                "مواد موجود",
            "Explore SecPack materials by category and application.":
                "مواد SecPack را بر اساس دسته‌بندی و کاربرد بررسی کنید.",

            "SECPACK DOCUMENT CENTER":
                "مرکز اسناد SECPACK",
            "Technical & Procurement Documents":
                "اسناد فنی و تأمین",
            "DOCUMENT CENTER":
                "مرکز اسناد",
            "Professional Information Resources":
                "منابع اطلاعات حرفه‌ای",
            "Technical Data":
                "اطلاعات فنی",
            "Quality Information":
                "اطلاعات کیفیت",
            "Product Information":
                "اطلاعات محصول",
            "Procurement Records":
                "سوابق تأمین",
            "TECHNICAL KNOWLEDGE":
                "دانش فنی",

            "SECPACK MARKET INTELLIGENCE":
                "اطلاعات بازار SECPACK",
            "Packaging Industry Market Intelligence":
                "اطلاعات بازار صنعت بسته‌بندی",
            "MARKET OVERVIEW":
                "نمای کلی بازار",
            "Global Packaging Market Focus":
                "تمرکز بازار جهانی بسته‌بندی",
            "Lamination Films":
                "فیلم‌های لمینیشن",
            "Lamination Adhesives":
                "چسب‌های لمینیشن",
            "Packaging Materials":
                "مواد بسته‌بندی",
            "Supply Conditions":
                "شرایط تأمین",
            "MARKET SIGNALS":
                "سیگنال‌های بازار",
            "Price Conditions":
                "شرایط قیمت",
            "Demand Trends":
                "روند تقاضا",
            "Supplier Capacity":
                "ظرفیت تأمین‌کننده",
            "Regional Opportunities":
                "فرصت‌های منطقه‌ای",

            "SECPACK SUPPLIER INTELLIGENCE":
                "اطلاعات تأمین‌کنندگان SECPACK",
            "Supplier Evaluation Center":
                "مرکز ارزیابی تأمین‌کنندگان",
            "SUPPLIER NETWORK":
                "شبکه تأمین",
            "SUPPLIER SCORECARD":
                "امتیازدهی تأمین‌کنندگان",
            "How SecPack Evaluates Suppliers":
                "SecPack چگونه تأمین‌کنندگان را ارزیابی می‌کند",
            "Cost Efficiency":
                "بهره‌وری هزینه",
            "Quality Stability":
                "ثبات کیفیت",
            "Batch Consistency":
                "ثبات بین بچ‌ها",
            "Response & Support":
                "سرعت پاسخ و پشتیبانی",

            "China": "چین",
            "Pakistan": "پاکستان",
            "India": "هند",
            "Global Network": "شبکه جهانی",

            "Request a Quote":
                "درخواست قیمت",
            "Request a Solution":
                "درخواست راهکار",
            "Request Information":
                "درخواست اطلاعات",
            "Request Technical Information":
                "درخواست اطلاعات فنی",
            "Request Supplier Support":
                "درخواست پشتیبانی تأمین",
            "Explore Products":
                "مشاهده محصولات",
            "View Products":
                "مشاهده محصولات",
            "Open Dashboard":
                "باز کردن داشبورد",
            "Review Suppliers":
                "بررسی تأمین‌کنندگان",
            "Review Documents":
                "بررسی اسناد",
            "Discuss Requirements":
                "بررسی نیازمندی‌ها",
            "Contact SecPack":
                "تماس با SecPack",
            "Email SecPack":
                "ایمیل به SecPack",

            "Thermal Lamination Film":
                "فیلم لمینیشن حرارتی",
            "Water-Based Adhesive":
                "چسب پایه آب",

            "SecPack Enterprise © 2026":
                "SecPack Enterprise © 2026"
        },

        ar: {
            "Home": "الرئيسية",
            "Products": "المنتجات",
            "Store": "المتجر",
            "Dashboard": "لوحة التحكم",
            "Contact": "اتصل بنا",
            "Resources": "المصادر",
            "Platform": "المنصة",
            "Knowledge Center": "مركز المعرفة",
            "Market Intelligence": "معلومات السوق",
            "Supplier Intelligence": "معلومات الموردين",

            "Professional Packaging Materials Supplier":
                "مورد محترف لمواد التغليف",
            "Professional Packaging Materials":
                "مواد تغليف احترافية",
            "Global Packaging Intelligence Platform":
                "منصة عالمية لمعلومات صناعة التغليف",

            "Materials.": "مواد التغليف.",
            "Technical Knowledge.": "المعرفة التقنية.",
            "Professional Solutions.": "الحلول الاحترافية.",

            "SECPACK PRODUCTS":
                "منتجات SECPACK",
            "PRODUCT PORTFOLIO":
                "مجموعة المنتجات",
            "Available Materials":
                "المواد المتاحة",
            "Explore SecPack materials by category and application.":
                "استكشف مواد SecPack حسب الفئة والتطبيق.",

            "SECPACK DOCUMENT CENTER":
                "مركز وثائق SECPACK",
            "Technical & Procurement Documents":
                "الوثائق التقنية ووثائق التوريد",
            "DOCUMENT CENTER":
                "مركز الوثائق",
            "Professional Information Resources":
                "مصادر المعلومات الاحترافية",
            "Technical Data":
                "البيانات التقنية",
            "Quality Information":
                "معلومات الجودة",
            "Product Information":
                "معلومات المنتجات",
            "Procurement Records":
                "سجلات التوريد",
            "TECHNICAL KNOWLEDGE":
                "المعرفة التقنية",

            "SECPACK MARKET INTELLIGENCE":
                "معلومات سوق SECPACK",
            "Packaging Industry Market Intelligence":
                "معلومات سوق صناعة التغليف",
            "MARKET OVERVIEW":
                "نظرة عامة على السوق",
            "Global Packaging Market Focus":
                "التركيز على سوق التغليف العالمي",
            "Lamination Films":
                "أفلام التصفيح",
            "Lamination Adhesives":
                "مواد لاصقة للتصفيح",
            "Packaging Materials":
                "مواد التغليف",
            "Supply Conditions":
                "ظروف التوريد",
            "MARKET SIGNALS":
                "مؤشرات السوق",
            "Price Conditions":
                "ظروف الأسعار",
            "Demand Trends":
                "اتجاهات الطلب",
            "Supplier Capacity":
                "قدرة الموردين",
            "Regional Opportunities":
                "الفرص الإقليمية",

            "SECPACK SUPPLIER INTELLIGENCE":
                "معلومات موردي SECPACK",
            "Supplier Evaluation Center":
                "مركز تقييم الموردين",
            "SUPPLIER NETWORK":
                "شبكة التوريد",
            "SUPPLIER SCORECARD":
                "بطاقة تقييم الموردين",
            "How SecPack Evaluates Suppliers":
                "كيف تقوم SecPack بتقييم الموردين",
            "Cost Efficiency":
                "كفاءة التكلفة",
            "Quality Stability":
                "استقرار الجودة",
            "Batch Consistency":
                "ثبات الدُفعات",
            "Response & Support":
                "سرعة الاستجابة والدعم",

            "China": "الصين",
            "Pakistan": "باكستان",
            "India": "الهند",
            "Global Network": "الشبكة العالمية",

            "Request a Quote":
                "طلب عرض سعر",
            "Request a Solution":
                "طلب حل",
            "Request Information":
                "طلب معلومات",
            "Request Technical Information":
                "طلب معلومات تقنية",
            "Request Supplier Support":
                "طلب دعم الموردين",
            "Explore Products":
                "استكشف المنتجات",
            "View Products":
                "عرض المنتجات",
            "Open Dashboard":
                "فتح لوحة التحكم",
            "Review Suppliers":
                "مراجعة الموردين",
            "Review Documents":
                "مراجعة الوثائق",
            "Discuss Requirements":
                "مناقشة المتطلبات",
            "Contact SecPack":
                "التواصل مع SecPack",
            "Email SecPack":
                "إرسال بريد إلى SecPack",

            "Thermal Lamination Film":
                "فيلم التصفيح الحراري",
            "Water-Based Adhesive":
                "لاصق مائي",

            "SecPack Enterprise © 2026":
                "SecPack Enterprise © 2026"
        }
    };

    function normalize(text) {
        return String(text)
            .replace(/\s+/g, " ")
            .replace(/\u00A0/g, " ")
            .trim();
    }

    function detectLanguage() {
        const saved = localStorage.getItem(STORAGE_KEY);

        if (LANGUAGES.includes(saved)) {
            return saved;
        }

        const browser = (
            navigator.language || ""
        ).toLowerCase();

        if (browser.startsWith("fa")) {
            return "fa";
        }

        if (browser.startsWith("ar")) {
            return "ar";
        }

        return "en";
    }

    function translateDataAttributes(language) {
        const dictionary = translations[language];

        document
            .querySelectorAll("[data-i18n]")
            .forEach(function (element) {

                const key =
                    element.getAttribute("data-i18n");

                if (dictionary[key] !== undefined) {
                    element.textContent =
                        dictionary[key];
                }
            });
    }

    function translateTextNodes(language) {
        const dictionary = translations[language];

        const walker =
            document.createTreeWalker(
                document.body,
                NodeFilter.SHOW_TEXT
            );

        const nodes = [];

        let node;

        while ((node = walker.nextNode())) {
            nodes.push(node);
        }

        nodes.forEach(function (textNode) {

            const parent =
                textNode.parentElement;

            if (!parent) {
                return;
            }

            if (
                ["SCRIPT", "STYLE", "NOSCRIPT"]
                    .includes(parent.tagName)
            ) {
                return;
            }

            const original =
                normalize(textNode.nodeValue);

            if (!original) {
                return;
            }

            const translated =
                dictionary[original];

            if (translated !== undefined) {
                textNode.nodeValue =
                    textNode.nodeValue.replace(
                        original,
                        translated
                    );
            }
        });
    }

    function translateAttributes(language) {
        const dictionary = translations[language];

        document
            .querySelectorAll(
                "[placeholder],[title],[aria-label]"
            )
            .forEach(function (element) {

                [
                    "placeholder",
                    "title",
                    "aria-label"
                ].forEach(function (attribute) {

                    const value =
                        element.getAttribute(attribute);

                    if (!value) {
                        return;
                    }

                    const key =
                        normalize(value);

                    if (
                        dictionary[key] !== undefined
                    ) {
                        element.setAttribute(
                            attribute,
                            dictionary[key]
                        );
                    }
                });
            });
    }

    function updateDirection(language) {

        document.documentElement.lang =
            language;

        document.documentElement.dir =
            language === "en"
                ? "ltr"
                : "rtl";

        if (document.body) {
            document.body.classList.remove(
                "lang-en",
                "lang-fa",
                "lang-ar"
            );

            document.body.classList.add(
                "lang-" + language
            );
        }
    }

    function updateButtons(language) {

        document
            .querySelectorAll(".languages button")
            .forEach(function (button) {

                const onclick =
                    button.getAttribute("onclick") || "";

                button.classList.toggle(
                    "active-language",
                    onclick.indexOf(
                        "'" + language + "'"
                    ) !== -1
                );
            });
    }

    function updateTitle(language) {

        const path =
            window.location.pathname.toLowerCase();

        const titles = {

            en: {
                products:
                    "SecPack | Products",
                documents:
                    "SecPack | Documents",
                market:
                    "SecPack | Market Intelligence",
                supplier:
                    "SecPack | Supplier Intelligence",
                contact:
                    "SecPack | Contact",
                default:
                    "SecPack | Professional Packaging Materials"
            },

            fa: {
                products:
                    "SecPack | محصولات",
                documents:
                    "SecPack | اسناد",
                market:
                    "SecPack | اطلاعات بازار",
                supplier:
                    "SecPack | اطلاعات تأمین‌کنندگان",
                contact:
                    "SecPack | تماس",
                default:
                    "SecPack | مواد بسته‌بندی حرفه‌ای"
            },

            ar: {
                products:
                    "SecPack | المنتجات",
                documents:
                    "SecPack | الوثائق",
                market:
                    "SecPack | معلومات السوق",
                supplier:
                    "SecPack | معلومات الموردين",
                contact:
                    "SecPack | اتصل بنا",
                default:
                    "SecPack | مواد التغليف الاحترافية"
            }
        };

        let type = "default";

        if (path.includes("products.html")) {
            type = "products";
        } else if (path.includes("documents.html")) {
            type = "documents";
        } else if (path.includes("market.html")) {
            type = "market";
        } else if (
            path.includes("supplier-profile.html")
        ) {
            type = "supplier";
        } else if (path.includes("contact.html")) {
            type = "contact";
        }

        document.title =
            titles[language][type];
    }

    function applyLanguage(language) {

        if (!LANGUAGES.includes(language)) {
            language = "en";
        }

        localStorage.setItem(
            STORAGE_KEY,
            language
        );

        updateDirection(language);
        translateDataAttributes(language);
        translateTextNodes(language);
        translateAttributes(language);
        updateButtons(language);
        updateTitle(language);

        window.dispatchEvent(
            new CustomEvent(
                "secpack-language-changed",
                {
                    detail: {
                        language: language
                    }
                }
            )
        );
    }

    window.changeLanguage =
        function (language) {
            applyLanguage(language);
        };

    window.SecPackLanguage = {

        get: function () {
            return detectLanguage();
        },

        set: function (language) {
            applyLanguage(language);
        },

        apply: function (language) {
            applyLanguage(language);
        },

        translate: function (
            text,
            targetLanguage
        ) {

            const language =
                targetLanguage ||
                detectLanguage();

            const dictionary =
                translations[language];

            const key =
                normalize(text);

            return dictionary[key] !== undefined
                ? dictionary[key]
                : text;
        },

        getAIContext: function () {

            const language =
                detectLanguage();

            const instructions = {

                en:
                    "Respond to the user in English. Preserve technical product names, model numbers, brands and codes.",

                fa:
                    "به کاربر به زبان فارسی پاسخ بده. تمام توضیحات، پیام‌ها، راهنمایی‌ها و پاسخ‌های متنی را فارسی ارائه کن. نام محصولات، مدل‌ها، برندها و کدهای فنی را در صورت نیاز به شکل اصلی حفظ کن.",

                ar:
                    "أجب المستخدم باللغة العربية. يجب أن تكون جميع الشروحات والرسائل والإرشادات والإجابات النصية باللغة العربية. حافظ على أسماء المنتجات والموديلات والعلامات التجارية والرموز التقنية بصيغتها الأصلية عند الحاجة."
            };

            return {
                language: language,
                instruction:
                    instructions[language]
            };
        },

        translations: translations
    };

    document.addEventListener(
        "DOMContentLoaded",
        function () {
            applyLanguage(
                detectLanguage()
            );
        }
    );

    let observerStarted = false;

    function startObserver() {

        if (
            observerStarted ||
            !document.body
        ) {
            return;
        }

        observerStarted = true;

        const observer =
            new MutationObserver(
                function () {

                    const language =
                        detectLanguage();

                    translateDataAttributes(
                        language
                    );

                    translateTextNodes(
                        language
                    );

                    translateAttributes(
                        language
                    );
                }
            );

        observer.observe(
            document.body,
            {
                childList: true,
                subtree: true
            }
        );
    }

    document.addEventListener(
        "DOMContentLoaded",
        startObserver
    );

})();
