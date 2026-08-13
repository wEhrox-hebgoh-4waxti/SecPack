(function () {

    "use strict";

    const STORAGE_KEY = "secpack-language";

    const translations = {

        en: {

            siteTagline: "Professional Packaging Materials Supplier",

            home: "Home",
            products: "Products",
            store: "Store",
            dashboard: "Dashboard",
            contact: "Contact",

            badge: "SECPACK PROFESSIONAL PACKAGING",

            heroLine1: "Materials.",
            heroLine2: "Technical Knowledge.",
            heroLine3: "Professional Solutions.",

            heroDescription:
                "SecPack provides professional packaging materials, technical information and practical solutions for printing, lamination and packaging applications.",

            platform: "SECPACK PLATFORM",
            platformTitle: "Professional Packaging Materials",
            platformDescription:
                "Selected materials and practical information for printing, lamination and packaging professionals.",

            filmTitle: "Lamination Films",
            filmDescription:
                "Professional finishing materials for reliable lamination and high-quality printing applications.",
            filmLabel: "Explore Products",

            adhesiveTitle: "Lamination Adhesives",
            adhesiveDescription:
                "Water-based adhesive solutions for paper, film and packaging lamination applications.",
            adhesiveLabel: "Technical Solutions",

            packagingTitle: "Packaging Materials",
            packagingDescription:
                "Professional materials supporting modern packaging production and converting requirements.",
            packagingLabel: "Production Materials",

            industrialTitle: "Industrial Solutions",
            industrialDescription:
                "Practical packaging material solutions for different industrial applications and production needs.",
            industrialLabel: "Professional Support",

            viewProducts: "View Products →",
            discussRequirements: "Discuss Requirements →",

            knowledge: "SECPACK KNOWLEDGE",
            knowledgeTitle: "Packaging Knowledge Center",
            knowledgeDescription:
                "Professional technical knowledge for printing, lamination and packaging professionals.",

            technologyTitle: "Packaging Technology",
            technologyDescription:
                "Understand packaging materials, applications, production processes and technical fundamentals.",

            insightsTitle: "Technical Insights",
            insightsDescription:
                "Learn how material selection, quality and production conditions affect final results.",

            industryTitle: "Industry Intelligence",
            industryDescription:
                "Follow important developments and understand the changing needs of the global packaging industry.",

            exploreInformation: "Explore Information →",
            technicalInformation: "Technical Information →",
            marketIntelligence: "Explore Market Intelligence →",

            solutions: "PROFESSIONAL SOLUTIONS",
            solutionsTitle: "Built Around Your Production Needs",
            solutionsDescription:
                "SecPack connects professional packaging materials with practical technical requirements.",

            lamination: "Lamination",
            laminationDescription:
                "Material solutions for professional lamination and finishing applications.",

            printing: "Printing & Finishing",
            printingDescription:
                "Packaging materials selected for reliable printing and finishing performance.",

            production: "Packaging Production",
            productionDescription:
                "Practical material solutions for converters, printers and packaging manufacturers.",

            helpTitle: "Need Help Selecting the Right Material?",
            helpDescription:
                "Tell us about your application, production process and material requirements. SecPack can help you identify the most suitable solution.",
            talkToSecPack: "Talk to SecPack",

            enterprise: "SECPACK ENTERPRISE",
            enterpriseTitle: "Let's Build Better Packaging Solutions",
            enterpriseDescription:
                "Whether you need a specific packaging material, technical guidance or a professional supply solution, our team is ready to understand your requirements.",

            requestQuote: "Request a Quote",
            exploreProducts: "Explore Products",
            requestSolution: "Request a Solution",

            footerDescription:
                "Global Packaging Intelligence Platform for the printing and packaging industry.",
            footerTagline:
                "Professional Packaging Materials & Solutions",

            productsBadge: "📦 SECPACK PRODUCTS",
            productsTitle: "Professional Packaging Materials",
            productsDescription:
                "Explore professional packaging materials and technical solutions selected for printing, lamination and packaging applications.",

            productCategories: "PRODUCT CATEGORIES",
            selectProduct: "Select a Material",
            selectProductDescription:
                "Review available materials and explore their application and technical information.",

            viewDetails: "View Details →",

            documentsBadge: "📋 SECPACK DOCUMENT CENTER",
            documentsTitle: "Technical & Procurement Documents",
            documentsDescription:
                "Organize product information, technical documents, quality references and procurement records in one professional workspace.",

            documentCenter: "DOCUMENT CENTER",
            documentResources: "Professional Information Resources",

            marketBadge: "🌍 SECPACK MARKET INTELLIGENCE",
            marketTitle: "Packaging Industry Market Intelligence",
            marketDescription:
                "Understand market conditions, material demand, supply trends and procurement opportunities to make more informed sourcing decisions.",

            supplierBadge: "🏭 SUPPLIER INTELLIGENCE",
            supplierTitle: "Supplier Evaluation Center",
            supplierDescription:
                "Compare supplier capabilities, product focus, technical support and sourcing suitability in one professional workspace."
        },


        fa: {

            siteTagline: "تأمین‌کننده حرفه‌ای مواد بسته‌بندی",

            home: "خانه",
            products: "محصولات",
            store: "فروشگاه",
            dashboard: "داشبورد",
            contact: "تماس با ما",

            badge: "بسته‌بندی حرفه‌ای SECPACK",

            heroLine1: "مواد بسته‌بندی.",
            heroLine2: "دانش فنی.",
            heroLine3: "راهکارهای حرفه‌ای.",

            heroDescription:
                "SecPack مواد بسته‌بندی حرفه‌ای، اطلاعات فنی و راهکارهای کاربردی برای چاپ، لمینیشن و بسته‌بندی ارائه می‌دهد.",

            platform: "پلتفرم SECPACK",
            platformTitle: "مواد بسته‌بندی حرفه‌ای",
            platformDescription:
                "مواد منتخب و اطلاعات کاربردی برای متخصصان چاپ، لمینیشن و بسته‌بندی.",

            filmTitle: "فیلم‌های لمینیشن",
            filmDescription:
                "مواد حرفه‌ای برای لمینیشن مطمئن و چاپ باکیفیت.",
            filmLabel: "مشاهده محصولات",

            adhesiveTitle: "چسب‌های لمینیشن",
            adhesiveDescription:
                "راهکارهای چسب پایه آب برای لمینیشن کاغذ، فیلم و بسته‌بندی.",
            adhesiveLabel: "راهکارهای فنی",

            packagingTitle: "مواد بسته‌بندی",
            packagingDescription:
                "مواد حرفه‌ای برای تولید مدرن بسته‌بندی و فرآیندهای تبدیلی.",
            packagingLabel: "مواد تولیدی",

            industrialTitle: "راهکارهای صنعتی",
            industrialDescription:
                "راهکارهای کاربردی مواد بسته‌بندی برای کاربردهای صنعتی و نیازهای مختلف تولید.",
            industrialLabel: "پشتیبانی حرفه‌ای",

            viewProducts: "مشاهده محصولات ←",
            discussRequirements: "بررسی نیازمندی‌ها ←",

            knowledge: "دانش SECPACK",
            knowledgeTitle: "مرکز دانش بسته‌بندی",
            knowledgeDescription:
                "دانش فنی حرفه‌ای برای متخصصان چاپ، لمینیشن و بسته‌بندی.",

            technologyTitle: "فناوری بسته‌بندی",
            technologyDescription:
                "با مواد بسته‌بندی، کاربردها، فرآیندهای تولید و مبانی فنی آشنا شوید.",

            insightsTitle: "بینش فنی",
            insightsDescription:
                "با تأثیر انتخاب مواد، کیفیت و شرایط تولید بر نتیجه نهایی آشنا شوید.",

            industryTitle: "اطلاعات صنعت",
            industryDescription:
                "تحولات مهم و نیازهای در حال تغییر صنعت جهانی بسته‌بندی را دنبال کنید.",

            exploreInformation: "مشاهده اطلاعات ←",
            technicalInformation: "اطلاعات فنی ←",
            marketIntelligence: "مشاهده اطلاعات بازار ←",

            solutions: "راهکارهای حرفه‌ای",
            solutionsTitle: "طراحی‌شده بر اساس نیازهای تولید شما",
            solutionsDescription:
                "SecPack مواد بسته‌بندی حرفه‌ای را با نیازهای واقعی و فنی تولید مرتبط می‌کند.",

            lamination: "لمینیشن",
            laminationDescription:
                "راهکارهای مواد برای لمینیشن و تکمیل حرفه‌ای.",

            printing: "چاپ و تکمیل",
            printingDescription:
                "مواد بسته‌بندی انتخاب‌شده برای عملکرد مطمئن در چاپ و تکمیل.",

            production: "تولید بسته‌بندی",
            productionDescription:
                "راهکارهای کاربردی مواد برای کانورترها، چاپخانه‌ها و تولیدکنندگان بسته‌بندی.",

            helpTitle: "برای انتخاب ماده مناسب نیاز به کمک دارید؟",
            helpDescription:
                "درباره کاربرد، فرآیند تولید و نیازهای مواد خود به ما بگویید. SecPack می‌تواند به شما در شناسایی مناسب‌ترین راهکار کمک کند.",
            talkToSecPack: "با SecPack تماس بگیرید",

            enterprise: "SECPACK ENTERPRISE",
            enterpriseTitle: "بیایید راهکارهای بهتری برای بسته‌بندی بسازیم",
            enterpriseDescription:
                "چه به یک ماده بسته‌بندی خاص، راهنمایی فنی یا یک راهکار حرفه‌ای تأمین نیاز داشته باشید، تیم ما آماده بررسی نیازهای شماست.",

            requestQuote: "درخواست قیمت",
            exploreProducts: "مشاهده محصولات",
            requestSolution: "درخواست راهکار",

            footerDescription:
                "پلتفرم جهانی اطلاعات بسته‌بندی برای صنعت چاپ و بسته‌بندی.",
            footerTagline:
                "مواد و راهکارهای حرفه‌ای بسته‌بندی",

            productsBadge: "📦 محصولات SECPACK",
            productsTitle: "مواد بسته‌بندی حرفه‌ای",
            productsDescription:
                "مواد بسته‌بندی حرفه‌ای و راهکارهای فنی منتخب برای چاپ، لمینیشن و بسته‌بندی را بررسی کنید.",

            productCategories: "دسته‌بندی محصولات",
            selectProduct: "یک ماده را انتخاب کنید",
            selectProductDescription:
                "مواد موجود را بررسی کنید و اطلاعات کاربردی و فنی آنها را مشاهده کنید.",

            viewDetails: "مشاهده جزئیات ←",

            documentsBadge: "📋 مرکز اسناد SECPACK",
            documentsTitle: "اسناد فنی و تأمین",
            documentsDescription:
                "اطلاعات محصولات، اسناد فنی، اطلاعات کیفیت و سوابق تأمین را در یک فضای حرفه‌ای سازمان‌دهی کنید.",

            documentCenter: "مرکز اسناد",
            documentResources: "منابع اطلاعات حرفه‌ای",

            marketBadge: "🌍 اطلاعات بازار SECPACK",
            marketTitle: "اطلاعات بازار صنعت بسته‌بندی",
            marketDescription:
                "شرایط بازار، تقاضای مواد، روندهای تأمین و فرصت‌های خرید را برای تصمیم‌گیری بهتر بررسی کنید.",

            supplierBadge: "🏭 اطلاعات تأمین‌کنندگان",
            supplierTitle: "مرکز ارزیابی تأمین‌کنندگان",
            supplierDescription:
                "توانمندی تأمین‌کنندگان، حوزه محصولات، پشتیبانی فنی و مناسب‌بودن آنها برای تأمین را در یک فضای حرفه‌ای مقایسه کنید."
        },


        ar: {

            siteTagline: "مورد محترف لمواد التغليف",

            home: "الرئيسية",
            products: "المنتجات",
            store: "المتجر",
            dashboard: "لوحة التحكم",
            contact: "اتصل بنا",

            badge: "SECPACK للتغليف الاحترافي",

            heroLine1: "مواد التغليف.",
            heroLine2: "المعرفة التقنية.",
            heroLine3: "الحلول الاحترافية.",

            heroDescription:
                "توفر SecPack مواد تغليف احترافية ومعلومات تقنية وحلولاً عملية لتطبيقات الطباعة والتصفيح والتغليف.",

            platform: "منصة SECPACK",
            platformTitle: "مواد تغليف احترافية",
            platformDescription:
                "مواد مختارة ومعلومات عملية لمحترفي الطباعة والتصفيح والتغليف.",

            filmTitle: "أفلام التصفيح",
            filmDescription:
                "مواد تشطيب احترافية للتصفيح الموثوق وتطبيقات الطباعة عالية الجودة.",
            filmLabel: "استكشف المنتجات",

            adhesiveTitle: "مواد لاصقة للتصفيح",
            adhesiveDescription:
                "حلول لاصقة مائية لتطبيقات تصفيح الورق والأفلام والتغليف.",
            adhesiveLabel: "حلول تقنية",

            packagingTitle: "مواد التغليف",
            packagingDescription:
                "مواد احترافية تدعم إنتاج التغليف الحديث ومتطلبات التحويل.",
            packagingLabel: "مواد الإنتاج",

            industrialTitle: "حلول صناعية",
            industrialDescription:
                "حلول عملية لمواد التغليف لمختلف التطبيقات الصناعية واحتياجات الإنتاج.",
            industrialLabel: "دعم احترافي",

            viewProducts: "عرض المنتجات ←",
            discussRequirements: "مناقشة المتطلبات ←",

            knowledge: "معرفة SECPACK",
            knowledgeTitle: "مركز معرفة التغليف",
            knowledgeDescription:
                "معرفة تقنية احترافية لمحترفي الطباعة والتصفيح والتغليف.",

            technologyTitle: "تقنيات التغليف",
            technologyDescription:
                "تعرف على مواد التغليف والتطبيقات وعمليات الإنتاج والأساسيات التقنية.",

            insightsTitle: "رؤى تقنية",
            insightsDescription:
                "تعرف على تأثير اختيار المواد والجودة وظروف الإنتاج على النتائج النهائية.",

            industryTitle: "معلومات الصناعة",
            industryDescription:
                "تابع التطورات المهمة وافهم الاحتياجات المتغيرة لصناعة التغليف العالمية.",

            exploreInformation: "استكشف المعلومات ←",
            technicalInformation: "المعلومات التقنية ←",
            marketIntelligence: "استكشف معلومات السوق ←",

            solutions: "حلول احترافية",
            solutionsTitle: "مصممة وفق احتياجات إنتاجك",
            solutionsDescription:
                "تربط SecPack مواد التغليف الاحترافية بالمتطلبات التقنية العملية.",

            lamination: "التصفيح",
            laminationDescription:
                "حلول مواد لتطبيقات التصفيح والتشطيب الاحترافية.",

            printing: "الطباعة والتشطيب",
            printingDescription:
                "مواد تغليف مختارة لأداء موثوق في الطباعة والتشطيب.",

            production: "إنتاج التغليف",
            productionDescription:
                "حلول عملية للمواد للمحولين والطابعين ومصنعي التغليف.",

            helpTitle: "هل تحتاج إلى مساعدة في اختيار المادة المناسبة؟",
            helpDescription:
                "أخبرنا عن تطبيقك وعملية الإنتاج ومتطلبات المواد لديك. يمكن لـ SecPack مساعدتك في تحديد الحل الأنسب.",
            talkToSecPack: "تواصل مع SecPack",

            enterprise: "SECPACK ENTERPRISE",
            enterpriseTitle: "لنقدم حلول تغليف أفضل",
            enterpriseDescription:
                "سواء كنت بحاجة إلى مادة تغليف محددة أو إرشاد تقني أو حل توريد احترافي، فإن فريقنا مستعد لفهم متطلباتك.",

            requestQuote: "طلب عرض سعر",
            exploreProducts: "استكشف المنتجات",
            requestSolution: "اطلب حلاً",

            footerDescription:
                "منصة عالمية لمعلومات التغليف لصناعة الطباعة والتغليف.",
            footerTagline:
                "مواد وحلول تغليف احترافية",

            productsBadge: "📦 منتجات SECPACK",
            productsTitle: "مواد تغليف احترافية",
            productsDescription:
                "استكشف مواد التغليف الاحترافية والحلول التقنية المختارة للطباعة والتصفيح والتغليف.",

            productCategories: "فئات المنتجات",
            selectProduct: "اختر مادة",
            selectProductDescription:
                "راجع المواد المتاحة واستكشف معلومات التطبيقات والمعلومات التقنية.",

            viewDetails: "عرض التفاصيل ←",

            documentsBadge: "📋 مركز وثائق SECPACK",
            documentsTitle: "الوثائق التقنية ووثائق التوريد",
            documentsDescription:
                "نظم معلومات المنتجات والوثائق التقنية ومراجع الجودة وسجلات التوريد في مساحة عمل احترافية واحدة.",

            documentCenter: "مركز الوثائق",
            documentResources: "مصادر المعلومات الاحترافية",

            marketBadge: "🌍 معلومات سوق SECPACK",
            marketTitle: "معلومات سوق صناعة التغليف",
            marketDescription:
                "افهم ظروف السوق والطلب على المواد واتجاهات التوريد وفرص الشراء لاتخاذ قرارات أكثر دقة.",

            supplierBadge: "🏭 معلومات الموردين",
            supplierTitle: "مركز تقييم الموردين",
            supplierDescription:
                "قارن قدرات الموردين ومجالات المنتجات والدعم التقني ومدى ملاءمتهم لاحتياجات التوريد في مساحة عمل احترافية."
        }

    };


    function detectLanguage() {

        const saved =
            localStorage.getItem(STORAGE_KEY);

        if (
            saved === "en" ||
            saved === "fa" ||
            saved === "ar"
        ) {
            return saved;
        }

        const browser =
            (
                navigator.language ||
                navigator.userLanguage ||
                "en"
            ).toLowerCase();

        if (browser.indexOf("fa") === 0) {
            return "fa";
        }

        if (browser.indexOf("ar") === 0) {
            return "ar";
        }

        return "en";
    }


    function translateDataAttributes(language) {

        const dictionary =
            translations[language];

        document
            .querySelectorAll("[data-i18n]")
            .forEach(function (element) {

                const key =
                    element.getAttribute("data-i18n");

                if (
                    dictionary[key] !== undefined
                ) {
                    element.textContent =
                        dictionary[key];
                }

            });

    }


    function translateDocumentTitle(language) {

        const path =
            window.location.pathname.toLowerCase();

        if (path.indexOf("products.html") !== -1) {

            document.title =
                language === "fa"
                    ? "SecPack | محصولات"
                    : language === "ar"
                        ? "SecPack | المنتجات"
                        : "SecPack | Products";

            return;
        }

        if (path.indexOf("documents.html") !== -1) {

            document.title =
                language === "fa"
                    ? "SecPack | اسناد"
                    : language === "ar"
                        ? "SecPack | الوثائق"
                        : "SecPack | Documents";

            return;
        }

        if (path.indexOf("market.html") !== -1) {

            document.title =
                language === "fa"
                    ? "SecPack | اطلاعات بازار"
                    : language === "ar"
                        ? "SecPack | معلومات السوق"
                        : "SecPack | Market Intelligence";

            return;
        }

        if (
            path.indexOf("supplier-profile.html") !== -1
        ) {

            document.title =
                language === "fa"
                    ? "SecPack | اطلاعات تأمین‌کنندگان"
                    : language === "ar"
                        ? "SecPack | معلومات الموردين"
                        : "SecPack | Supplier Intelligence";

            return;
        }

        if (
            path.indexOf("contact.html") !== -1
        ) {

            document.title =
                language === "fa"
                    ? "SecPack | تماس"
                    : language === "ar"
                        ? "SecPack | اتصل بنا"
                        : "SecPack | Contact";

            return;
        }

        document.title =
            language === "fa"
                ? "SecPack | مواد بسته‌بندی حرفه‌ای"
                : language === "ar"
                    ? "SecPack | مواد التغليف الاحترافية"
                    : "SecPack | Professional Packaging Materials";
    }


    function updateDirection(language) {

        document.documentElement.lang =
            language;

        document.documentElement.dir =
            language === "en"
                ? "ltr"
                : "rtl";


        document.body.classList.remove(
            "lang-en",
            "lang-fa",
            "lang-ar"
        );


        document.body.classList.add(
            "lang-" + language
        );

    }


    function updateLanguageButtons(language) {

        document
            .querySelectorAll(".languages button")
            .forEach(function (button) {

                button.classList.remove(
                    "active-language"
                );


                const handler =
                    button.getAttribute("onclick") ||
                    "";


                if (
                    handler.indexOf(
                        "'" + language + "'"
                    ) !== -1
                ) {

                    button.classList.add(
                        "active-language"
                    );

                }

            });

    }


    function applyLanguage(language) {

        if (
            !translations[language]
        ) {
            language = "en";
        }


        localStorage.setItem(
            STORAGE_KEY,
            language
        );


        updateDirection(language);

        translateDataAttributes(language);

        translateDocumentTitle(language);

        updateLanguageButtons(language);

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

})();
