(function(){
"use strict";
const KEY="secpack-lang", SUPPORTED=["en","fa","ar"];

/* Shared EN → FA / AR vocabulary for all public pages.
   Page-specific text is translated here so the site does not depend on
   Google Translate or an external translation service. */
const CORE={
"common.brandSub":["International Trade & Sourcing","تجارت بین‌الملل و تأمین","التجارة الدولية والتوريد"],
"nav.home":["Home","خانه","الرئيسية"],"nav.products":["Products","محصولات","المنتجات"],"nav.store":["Online Store","فروشگاه آنلاین","المتجر الإلكتروني"],"nav.company":["Company","شرکت","الشركة"],"nav.manufacturers":["For Manufacturers","برای تولیدکنندگان","للمصنعين"],"nav.knowledge":["Knowledge Center","مرکز دانش","مركز المعرفة"],"nav.resources":["Resources","منابع","المصادر"],"nav.contact":["Contact","تماس","اتصل بنا"],
"footer.explore":["Explore","بخش‌های سایت","استكشف"],"footer.connect":["Connect","ارتباط","تواصل"],"footer.legal":["Legal","حقوقی","قانوني"],"footer.products":["Products","محصولات","المنتجات"],"footer.privacy":["Privacy","حریم خصوصی","الخصوصية"],"footer.terms":["Terms","شرایط استفاده","الشروط"],"footer.company":["SEC PACK","SEC PACK","SEC PACK"],"footer.focus":["Focus","تمرکز","التركيز"],"footer.manufacturerSourcing":["Manufacturer sourcing","تأمین از تولیدکننده","التوريد من المصنعين"],"footer.supplierEvaluation":["Supplier evaluation","ارزیابی تأمین‌کننده","تقييم المورد"],"footer.year":["SEC PACK © 2026","SEC PACK © ۲۰۲۶","SEC PACK © 2026"],"footer.tagline":["International Trade · Sourcing · Procurement","تجارت بین‌الملل · تأمین · خرید","التجارة الدولية · التوريد · المشتريات"],
"common.close":["Close","بستن","إغلاق"],"common.register":["Register","ثبت‌نام","تسجيل"],"common.addToCart":["Add to cart","افزودن به سبد","أضف إلى السلة"],"common.scientificGuide":["Scientific product guide","راهنمای علمی محصول","الدليل العلمي للمنتج"]
};
const HOME_CORE={
  "home.brandSub":["International Trade & Sourcing","تجارت بین‌الملل و تأمین","التجارة الدولية والتوريد"],
  "home.navHome":["Home","خانه","الرئيسية"],
  "home.navProducts":["Products","محصولات","المنتجات"],
  "home.navInsights":["Knowledge Center","مرکز دانش","مركز المعرفة"],
  "home.navResources":["Resources","منابع","المصادر"],
  "home.navContact":["Contact","تماس","اتصل بنا"],
  "home.eyebrow":["SEC PACK · INTERNATIONAL TRADE","SEC PACK · تجارت بین‌الملل","SEC PACK · التجارة الدولية"],
  "home.heroTitle":["International sourcing.<br><em>Structured procurement.</em><br>Reliable trade coordination.","تأمین مستقیم.<br><em>تأمین مطمئن.</em><br>راهکارهای عملی تجارت.","توريد مباشر.<br><em>إمداد موثوق.</em><br>حلول تجارية عملية."],
  "home.heroText":["SEC PACK connects professional buyers with manufacturers and export partners through specification-led sourcing, disciplined procurement and practical international trade coordination.","SEC PACK خریداران حرفه‌ای را از طریق تأمین، خرید و پشتیبانی تجارت بین‌الملل به تولیدکنندگان و شرکای صادراتی متصل می‌کند.","نربط المشترين المحترفين بالمصنعين وشركاء التصدير من خلال التوريد والمشتريات ودعم التجارة الدولية."],
  "home.explore":["Explore Products","مشاهده محصولات","استكشف المنتجات"],
  "home.contactUs":["Contact SEC PACK","تماس با SEC PACK","اتصل بـ SEC PACK"],
  "home.focus":["OUR FOCUS","حوزه فعالیت","مجالات التركيز"],
  "home.f1":["Manufacturer sourcing","شناسایی تولیدکننده","تحديد المصنعين"],
  "home.f2":["Supplier evaluation","ارزیابی تأمین‌کننده","تقييم الموردين"],
  "home.f3":["Commercial negotiation","مذاکره تجاری","التفاوض التجاري"],
  "home.f4":["International procurement","خرید بین‌المللی","المشتريات الدولية"],
  "home.capEyebrow":["CAPABILITIES","توانمندی‌ها","القدرات"],
  "home.capTitle":["A sourcing partner built around real trade requirements.","شریک تأمینی بر اساس نیاز واقعی تجارت.","شريك توريد مبني على متطلبات التجارة الفعلية."],
  "home.c1t":["Global Sourcing","تأمین جهانی","التوريد العالمي"],
  "home.c1p":["Identify suitable manufacturers and export partners based on product, quality and commercial requirements.","شناسایی تولیدکنندگان و شرکای صادراتی مناسب بر اساس محصول، کیفیت و الزامات تجاری.","تحديد المصنعين وشركاء التصدير المناسبين وفق المنتج والجودة والمتطلبات التجارية."],
  "home.c2t":["Procurement","تدارکات و خرید","المشتريات"],
  "home.c2p":["Support RFQs, specification checks, negotiation and purchasing coordination for B2B supply.","پشتیبانی از استعلام، بررسی مشخصات، مذاکره و هماهنگی خرید B2B.","دعم طلبات الأسعار ومراجعة المواصفات والتفاوض وتنسيق مشتريات B2B."],
  "home.c3t":["Trade Support","پشتیبانی تجارت","دعم التجارة"],
  "home.c3p":["Coordinate practical international trade requirements from supplier communication to delivery planning.","هماهنگی نیازهای عملی تجارت بین‌الملل از ارتباط با تأمین‌کننده تا برنامه‌ریزی تحویل.","تنسيق متطلبات التجارة الدولية العملية من التواصل مع المورد إلى تخطيط التسليم."],
  "home.productsEyebrow":["PRODUCT AREAS","حوزه محصولات","مجالات المنتجات"],
  "home.productsTitle":["Materials for printing, packaging and converting.","مواد مورد استفاده در چاپ، بسته‌بندی و تبدیل.","مواد للطباعة والتغليف والتحويل."],
  "home.productsText":["Our product portfolio is developed around industrial applications and dependable supply.","سبد محصولات بر اساس کاربرد صنعتی و تأمین قابل اتکا توسعه می‌یابد.","يتم تطوير محفظة المنتجات وفق التطبيقات الصناعية والإمداد الموثوق."],
  "home.p1t":["Copy Paper","کاغذ تحریر","ورق النسخ"],
  "home.p1p":["A4 office and printing paper specifications for professional supply programs.","مشخصات کاغذ A4 اداری و چاپ برای برنامه‌های تأمین حرفه‌ای.","مواصفات ورق A4 المكتبي والطباعة لبرامج التوريد الاحترافية."],
  "home.p2t":["Lamination Films","فیلم لمینیشن","أفلام التصفيح"],
  "home.p2p":["Film solutions for printing, finishing and packaging applications.","راهکارهای فیلم برای چاپ، تکمیل و کاربردهای بسته‌بندی.","حلول أفلام للطباعة والتشطيب وتطبيقات التغليف."],
  "home.p3t":["Water-Based Adhesives","چسب پایه آب","مواد لاصقة مائية"],
  "home.p3p":["Adhesive solutions for paper, film and board lamination processes.","راهکارهای چسب برای لمینیشن کاغذ، فیلم و مقوا.","حلول لاصقة لتصفيح الورق والأفلام والكرتون."],
  "home.p4t":["Packaging Materials","مواد بسته‌بندی","مواد التغليف"],
  "home.p4p":["Selected materials for converters, printers and packaging manufacturers.","مواد منتخب برای چاپخانه‌ها، کانورتورها و تولیدکنندگان بسته‌بندی.","مواد مختارة للمطابع والمحوّلين ومصنعي التغليف."],
  "home.processEyebrow":["OUR APPROACH","روش کار","منهجنا"],
  "home.processTitle":["From requirement to reliable supply.","از نیاز تا تأمین مطمئن.","من المتطلبات إلى التوريد الموثوق."],
  "home.processText":["We focus on clear specifications, direct communication, commercial discipline and long-term B2B relationships.","تمرکز ما بر مشخصات شفاف، ارتباط مستقیم، انضباط تجاری و روابط بلندمدت B2B است.","نركز على المواصفات الواضحة والتواصل المباشر والانضباط التجاري والعلاقات طويلة الأمد."],
  "home.s1":["Understand the requirement","درک نیاز","فهم المتطلبات"],
  "home.s2":["Identify suitable production partners","شناسایی شرکای تولیدی مناسب","تحديد شركاء الإنتاج المناسبين"],
  "home.s3":["Evaluate specifications and commercial terms","ارزیابی مشخصات و شرایط تجاری","تقييم المواصفات والشروط التجارية"],
  "home.s4":["Coordinate the purchasing process","هماهنگی فرآیند خرید","تنسيق عملية الشراء"],
  "home.ctaEyebrow":["START A CONVERSATION","شروع گفتگو","ابدأ محادثة"],
  "home.ctaTitle":["Have a product or sourcing requirement?","نیاز محصول یا تأمین دارید؟","لديك متطلب منتج أو توريد؟"],
  "home.ctaText":["Tell us what you need. We will review the requirement and discuss the appropriate supply route.","نیاز خود را با ما در میان بگذارید تا بررسی و درباره مسیر مناسب تأمین گفتگو کنیم.","أخبرنا بما تحتاجه وسنراجع المتطلب ونناقش مسار التوريد المناسب."],
  "home.request":["Request a Discussion","درخواست گفتگو","طلب مناقشة"],
  "home.footerCompany":["SEC PACK","SEC PACK","SEC PACK"],
  "home.footerFocus":["Focus","تمرکز","التركيز"],
  "home.footerTag":["International Trade · Sourcing · Procurement","تجارت بین‌الملل · تأمین · خرید","التجارة الدولية · التوريد · المشتريات"],
  "home.visitorButton":["Register for Technical Updates","ثبت‌نام برای دریافت اطلاعات فنی","التسجيل للحصول على التحديثات الفنية"],
  "home.visitorTitle":["Register for technical solutions and new product updates.","از راهکارهای فنی و محصولات جدید SEC PACK باخبر شوید.","سجّل للحصول على الحلول الفنية وتحديثات المنتجات الجديدة."],
  "home.visitorText":["Tell us a little about your professional activity. We will share useful technical information and, if you choose, relevant new products and business updates.","اطلاعات حرفه‌ای خود را ثبت کنید تا اطلاعات کاربردی، راهکارهای فنی و در صورت تمایل محصولات و پیشنهادهای جدید مرتبط با فعالیت شما را ارسال کنیم.","شاركنا بعض المعلومات عن نشاطك المهني. سنرسل لك معلومات فنية مفيدة، وإذا اخترت ذلك، منتجات جديدة وتحديثات تجارية ذات صلة."],
  "home.visitorCta":["Register your business profile","ثبت اطلاعات حرفه‌ای","تسجيل الملف المهني"],
  "home.visitorModalTitle":["Register and stay connected","ثبت‌نام و ارتباط با SEC PACK","سجّل وابقَ على تواصل"],
  "home.visitorModalText":["Register your professional details to receive technical solutions, useful information and relevant new products from SEC PACK.","اطلاعات حرفه‌ای خود را ثبت کنید تا راهکارهای فنی، اطلاعات کاربردی و محصولات جدید مرتبط را دریافت کنید.","سجّل معلوماتك المهنية لتلقي الحلول الفنية والمعلومات المفيدة والمنتجات الجديدة ذات الصلة من SEC PACK."],
  "home.vName":["Full name","نام و نام خانوادگی","الاسم الكامل"],
  "home.vCompany":["Company","نام شرکت","الشركة"],
  "home.vCountry":["Country / City","کشور / شهر","الدولة / المدينة"],
  "home.vRole":["Job title","سمت یا عنوان شغلی","المسمى الوظيفي"],
  "home.vBusiness":["Business activity","زمینه فعالیت","مجال النشاط"],
  "home.vInterest":["Product / technical interest","محصول / زمینه فنی مورد علاقه","المنتج / الاهتمام الفني"],
  "home.vMobile":["Mobile / WhatsApp","موبایل / واتساپ","الهاتف / واتساب"],
  "home.vEmail":["Email","ایمیل","البريد الإلكتروني"],
  "home.vWebsite":["Company website","وب‌سایت شرکت","موقع الشركة"],
  "home.vMessage":["Message / requirement","پیام / نیاز شما","الرسالة / المتطلب"],
  "home.vConsent":["I agree to receive technical information, new product updates and relevant business messages from SEC PACK by email, WhatsApp or SMS.","مایلم اطلاعات فنی، محصولات جدید و پیام‌های تجاری مرتبط SEC PACK را از طریق ایمیل، واتساپ یا پیامک دریافت کنم.","أوافق على تلقي المعلومات الفنية وتحديثات المنتجات الجديدة والرسائل التجارية ذات الصلة من SEC PACK عبر البريد الإلكتروني أو واتساب أو الرسائل النصية."],
  "home.vPrivacy":["Your information will be used for business communication in accordance with our","اطلاعات شما برای ارتباطات تجاری و مطابق با","سيتم استخدام معلوماتك للتواصل التجاري وفقًا لـ"],
  "home.vSubmit":["Register","ثبت‌نام","تسجيل"],
  "home.clarityTag":["clarityTag","clarityTag","01 · CLARITY"],
  "home.clarityTitle":["clarityTitle","clarityTitle","Clear specifications"],
  "home.clarityText":["clarityText","clarityText","Requirements are structured around measurable product, packaging, quantity and delivery details."],
  "home.disciplineTag":["disciplineTag","disciplineTag","02 · DISCIPLINE"],
  "home.disciplineTitle":["disciplineTitle","disciplineTitle","Professional procurement"],
  "home.disciplineText":["disciplineText","disciplineText","Technical, commercial and delivery points are reviewed before a transaction is accepted."],
  "home.relationshipsTag":["relationshipsTag","relationshipsTag","03 · RELATIONSHIPS"],
  "home.relationshipsTitle":["relationshipsTitle","relationshipsTitle","Long-term cooperation"],
  "home.relationshipsText":["relationshipsText","relationshipsText","We seek repeatable B2B supply relationships with capable manufacturers and serious export partners."],
  "home.procurementEyebrow":["procurementEyebrow","procurementEyebrow","PROCUREMENT MODEL"],
  "home.procurementTitle":["procurementTitle","procurementTitle","Requirement-led, not catalog-led."],
  "home.procurementText":["procurementText","procurementText","We start with the application and commercial requirement, then identify supply options that can be evaluated on comparable technical and delivery terms."],
  "home.defineTag":["defineTag","defineTag","01 · DEFINE"],
  "home.defineTitle":["defineTitle","defineTitle","Requirement brief"],
  "home.defineText":["defineText","defineText","Product, application, specification, quantity, packaging, destination and timing are clarified first."],
  "home.reviewTag":["reviewTag","reviewTag","02 · REVIEW"],
  "home.reviewTitle":["reviewTitle","reviewTitle","Supply screening"],
  "home.reviewText":["reviewText","reviewText","Relevant manufacturers and export partners are reviewed against technical, commercial and documentation requirements."],
  "home.coordinateTag":["coordinateTag","coordinateTag","03 · COORDINATE"],
  "home.coordinateTitle":["coordinateTitle","coordinateTitle","Commercial discussion"],
  "home.coordinateText":["coordinateText","coordinateText","Quotations, samples, terms and delivery details are discussed before any purchasing commitment."],
  "home.businessEyebrow":["businessEyebrow","businessEyebrow","BUSINESS PROFILE"],
  "home.businessTitle":["businessTitle","businessTitle","Built for buyers and export partners."],
  "home.businessText":["businessText","businessText","SEC PACK structures product requirements, evaluates supply options and coordinates practical B2B procurement. Confidential supplier identities, purchase prices and internal commercial records are kept outside the public website."],
  "home.companyTitle":["companyTitle","companyTitle","Company Profile"],
  "home.companyText":["companyText","companyText","How SEC PACK works, what we source and the principles behind our commercial process."],
  "home.manufacturersTitle":["manufacturersTitle","manufacturersTitle","For Manufacturers"],
  "home.manufacturersText":["manufacturersText","manufacturersText","Information for factories and export sales teams considering a supply relationship."],
  "home.discussionTitle":["discussionTitle","discussionTitle","Start a Business Discussion"],
  "home.discussionText":["discussionText","discussionText","Send product, specification, quantity and destination requirements for review."],
  "home.visualCaption":["visualCaption","visualCaption","From specification to supply"],
  "home.globalSourcing":["globalSourcing","globalSourcing","GLOBAL SOURCING"],
  "home.visualPaper":["visualPaper","visualPaper","A4 PAPER"],
  "home.visualSpecification":["visualSpecification","visualSpecification","SPECIFICATION"],
  "home.visualFilms":["visualFilms","visualFilms","FILMS"],
  "home.visualConverting":["visualConverting","visualConverting","CONVERTING"],
  "home.visualPackaging":["visualPackaging","visualPackaging","PACKAGING"],
  "home.visualSupply":["visualSupply","visualSupply","SUPPLY"],
  "home.navCompany":["navCompany","navCompany","Company"],
  "home.navManufacturers":["navManufacturers","navManufacturers","For Manufacturers"]
};
Object.assign(CORE,HOME_CORE);
Object.assign(CORE,{
"error.pageTitle":["Page not found","صفحه پیدا نشد","الصفحة غير موجودة"],"error.message":["The page you requested is not available. Return to the SecPack home page and continue exploring our products and sourcing services.","صفحه‌ای که درخواست کرده‌اید در دسترس نیست. به صفحه اصلی SEC PACK بازگردید و محصولات و خدمات تأمین ما را بررسی کنید.","الصفحة التي طلبتها غير متاحة. عد إلى الصفحة الرئيسية لـ SEC PACK واستكشف منتجاتنا وخدمات التوريد."],"error.home":["Go to Home","رفتن به صفحه اصلی","العودة إلى الرئيسية"],"error.contact":["Contact SecPack","تماس با SEC PACK","اتصل بـ SEC PACK"],
"dynamic.cartEmpty":["Your order is empty.","سفارش شما خالی است.","طلبك فارغ."],
"dynamic.addProduct":["Add at least one product.","حداقل یک محصول را اضافه کنید.","أضف منتجًا واحدًا على الأقل."],
"dynamic.orderPrepared":["Order prepared.","سفارش آماده شد.","تم إعداد الطلب."],
"dynamic.orderDraft":["Your cart draft is kept only for this browser session; customer contact details are not stored by the static site. The next production step is connecting this checkout to SEC PACK's confirmed order/payment endpoint.","پیش‌نویس سبد فقط در نشست این مرورگر نگهداری می‌شود؛ اطلاعات تماس مشتری توسط سایت ایستا ذخیره نمی‌شود. مرحله بعدی اتصال این فرایند به درگاه تأییدشده سفارش و پرداخت SEC PACK است.","يتم الاحتفاظ بمسودة السلة فقط خلال جلسة هذا المتصفح؛ ولا يخزن الموقع الثابت بيانات اتصال العميل. الخطوة التالية هي ربط العملية بنقطة طلب ودفع مؤكدة لدى SEC PACK."],
"dynamic.visitorReady":["Thank you. The registration form is ready to be connected to our secure business database.","متشکریم. فرم ثبت‌نام آماده اتصال به پایگاه داده امن کسب‌وکار ماست.","شكرًا لك. نموذج التسجيل جاهز للربط بقاعدة بيانات الأعمال الآمنة لدينا."],
"science.paper.title":["A4 Copy Paper — Scientific Product Guide","کاغذ A4 — راهنمای علمی محصول","ورق A4 — الدليل العلمي للمنتج"],
"science.film.title":["Lamination Films — Scientific Product Guide","فیلم‌های لمینیشن — راهنمای علمی محصول","أفلام التصفيح — الدليل العلمي للمنتج"],
"science.adhesive.title":["Water-Based Adhesives — Scientific Product Guide","چسب‌های پایه آب — راهنمای علمی محصول","المواد اللاصقة المائية — الدليل العلمي للمنتج"],
"science.packaging.title":["Packaging Materials — Scientific Product Guide","مواد بسته‌بندی — راهنمای علمی محصول","مواد التغليف — الدليل العلمي للمنتج"],
"science.whatIs":["What it is","چیست","ما هو"],
"science.whatAre":["What they are","چه هستند","ما هي"],
"science.quality":["Key quality factors","عوامل کلیدی کیفیت","عوامل الجودة الرئيسية"],
"science.applications":["Suitable applications","کاربردهای مناسب","التطبيقات المناسبة"],
"science.paper.html":["<h3>What it is</h3><p>Cut-size office paper produced primarily from cellulose fibre. Typical commercial programs use virgin wood-pulp fibres, with formation, refining, sizing, fillers and surface treatment adjusted to achieve printability and runnability.</p><h3>Key quality factors</h3><ul><li>Grammage (GSM) and thickness</li><li>Moisture content and dimensional stability</li><li>Brightness, opacity and whiteness</li><li>Surface smoothness and formation</li><li>Stiffness, curl and cut accuracy</li><li>Dust, lint and print-machine runnability</li></ul><h3>Suitable applications</h3><p>Laser and inkjet office printing, copying, documents, reports, forms and general commercial print work. The correct grade depends on printer type, duplexing requirements and desired print appearance.</p>","<h3>چیست</h3><p>کاغذ اداری برش‌خورده که عمدتاً از الیاف سلولزی تولید می‌شود. برنامه‌های تجاری معمول از الیاف خمیر چوب بکر استفاده می‌کنند و تشکیل، پالایش، سایزینگ، پرکننده‌ها و تیمار سطحی برای چاپ‌پذیری و عملکرد مناسب تنظیم می‌شوند.</p><h3>عوامل کلیدی کیفیت</h3><ul><li>گرماژ (GSM) و ضخامت</li><li>رطوبت و پایداری ابعادی</li><li>روشنایی، کدری و سفیدی</li><li>صافی سطح و یکنواختی تشکیل</li><li>سفتی، تاب و دقت برش</li><li>گردوغبار، پرز و عملکرد در دستگاه چاپ</li></ul><h3>کاربردهای مناسب</h3><p>چاپ اداری لیزری و جوهرافشان، کپی، اسناد، گزارش‌ها، فرم‌ها و چاپ تجاری عمومی. گرید مناسب به نوع چاپگر، نیاز دوطرفه‌زنی و ظاهر چاپ موردنظر بستگی دارد.</p>","<h3>ما هو</h3><p>ورق مكتبي مقصوص يُنتج أساسًا من ألياف السليلوز. تستخدم البرامج التجارية عادة ألياف لب الخشب البكر، مع ضبط التكوين والتكرير والتحجيم والحشوات ومعالجة السطح لتحقيق قابلية الطباعة وسلاسة التشغيل.</p><h3>عوامل الجودة الرئيسية</h3><ul><li>الوزن الأساسي (GSM) والسماكة</li><li>الرطوبة والثبات الأبعادي</li><li>السطوع والعتامة والبياض</li><li>نعومة السطح وتجانس التكوين</li><li>الصلابة والتقوس ودقة القص</li><li>الغبار والوبر وأداء التشغيل في الطابعة</li></ul><h3>التطبيقات المناسبة</h3><p>الطباعة المكتبية بالليزر والحبر والنسخ والمستندات والتقارير والنماذج والطباعة التجارية العامة. يعتمد اختيار الدرجة على نوع الطابعة ومتطلبات الطباعة على الوجهين والمظهر المطلوب.</p>"]
});

const LANG_INDEX={en:0,fa:1,ar:2};
let currentLanguage="en";
function t(key,lang=currentLanguage){const row=CORE[key];return row?row[LANG_INDEX[lang]]??row[0]:key}
window.secpackT=t;
window.secpackI18n={translations:CORE,t,langs:SUPPORTED};
function legacyText(text,lang=currentLanguage){const path=(location.pathname||"").toLowerCase(),file=Object.keys(PAGE_TEXT||{}).find(k=>path.endsWith(k));const row=(typeof D!=="undefined"&&D[text])||(file&&PAGE_TEXT[file]?PAGE_TEXT[file][text]:null);return row&&row[LANG_INDEX[lang]]||text}
function legacyFragment(html,lang=currentLanguage){const box=document.createElement("div");box.innerHTML=html;const walk=document.createTreeWalker(box,NodeFilter.SHOW_TEXT);const nodes=[];while(walk.nextNode())nodes.push(walk.currentNode);nodes.forEach(n=>{const v=legacyText((n.nodeValue||"").trim(),lang);if(v!==(n.nodeValue||"").trim()){const lead=(n.nodeValue||"").match(/^\s*/)?.[0]||"",tail=(n.nodeValue||"").match(/\s*$/)?.[0]||"";n.nodeValue=lead+v+tail}});return box.innerHTML}
window.secpackLegacyText=legacyText;window.secpackLegacyFragment=legacyFragment;window.secpackGetLanguage=()=>currentLanguage;
function applyCoreKeys(lang){
 document.querySelectorAll("[data-i18n]").forEach(el=>{const key=el.dataset.i18n;const value=t(key,lang);if(value!==key)el.textContent=value});document.querySelectorAll("[data-i18n-html]").forEach(el=>{const key=el.dataset.i18nHtml;const value=t(key,lang);if(value!==key)el.innerHTML=value});
 [["data-i18n-placeholder","placeholder"],["data-i18n-title","title"],["data-i18n-aria-label","aria-label"],["data-i18n-alt","alt"]].forEach(([ka,a])=>document.querySelectorAll("["+ka+"]").forEach(el=>{const key=el.getAttribute(ka),value=t(key,lang);if(value!==key)el.setAttribute(a,value)}));
}
function applyDocumentMeta(lang){
 const titleKey=document.documentElement.dataset.i18nTitleKey;if(titleKey)document.title=t(titleKey,lang);
 const meta=document.querySelector('meta[name="description"][data-i18n]');if(meta)meta.content=t(meta.dataset.i18n,lang);
}
function captureLegacyOriginals(){document.querySelectorAll("body *").forEach(el=>{if(el.children.length||el.hasAttribute("data-i18n")||el.hasAttribute("data-i18n-html"))return;const raw=(el.textContent||"").replace(/\s+/g," ").trim();if(raw&&!el.dataset.legacyOriginal)el.dataset.legacyOriginal=raw})}
function applyLanguage(lang){
 if(!SUPPORTED.includes(lang))lang="en";
 currentLanguage=lang;
 document.documentElement.lang=lang;
 document.documentElement.dir=(lang==="fa"||lang==="ar")?"rtl":"ltr";
 applyCoreKeys(lang);
 applyDocumentMeta(lang);
 document.querySelectorAll("[data-lang]").forEach(b=>{
  const on=b.dataset.lang===lang;
  b.classList.toggle("on",on);
  b.classList.toggle("active-language",on);
  b.setAttribute("aria-pressed",on?"true":"false");
 });
 localStorage.setItem(KEY,lang);
 window.dispatchEvent(new CustomEvent("secpack:languagechange",{detail:{lang}}));
}
function setLanguage(lang){applyLanguage(lang)}
window.secpackSetLanguage=setLanguage;
function init(){document.querySelectorAll("[data-lang]").forEach(b=>b.addEventListener("click",()=>setLanguage(b.dataset.lang)));captureLegacyOriginals();const saved=localStorage.getItem(KEY);applyLanguage(SUPPORTED.includes(saved)?saved:"en")}
if(document.readyState==="loading")document.addEventListener("DOMContentLoaded",init);else init();
})();