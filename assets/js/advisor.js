const AI_ENDPOINT = "/api/advisor";

const TEXT = {
  en: {
    brand:"Professional Advisor", eyebrow:"SEC PACK · PROFESSIONAL ADVISOR",
    title:"Printing & Packaging Technical Advisor",
    intro:"A structured workspace for product selection, specifications, printing, packaging, converting, sourcing and commercial questions.",
    question:"Question / requirement", placeholder:"Describe your product, application, substrate, process, quantity or technical problem...",
    area:"Area", language:"Language", depth:"Answer style",
    printing:"Printing", packaging:"Packaging", paper:"Paper & Board", films:"Films", adhesives:"Adhesives", converting:"Converting", procurement:"Procurement", other:"Other",
    practical:"Practical recommendation", technical:"Technical analysis", commercial:"Technical + commercial analysis",
    fresh:"Use current public information when freshness matters.",
    submit:"Start professional discussion", method:"SEC PACK METHOD", how:"How the advisor should work",
    clarify:"Clarify", clarifyText:"Separate application, substrate, machine/process, quality target, quantity and destination.",
    analyze:"Analyze", analyzeText:"Compare technical options, trade-offs, risks and relevant standards without inventing missing facts.",
    decide:"Decide", decideText:"Present assumptions, alternatives and verification steps for the user's decision.",
    connecting:"Connecting…", unavailable:"The secure advisor service is temporarily unavailable.", noAnswer:"The advisor returned no answer."
  },
  fa: {
    brand:"مشاور حرفه‌ای", eyebrow:"SEC PACK · مشاور حرفه‌ای",
    title:"مشاور فنی چاپ و بسته‌بندی",
    intro:"محیطی ساختاریافته برای انتخاب محصول، مشخصات فنی، چاپ، بسته‌بندی، تبدیل، تأمین و پرسش‌های تجاری.",
    question:"پرسش / نیاز", placeholder:"محصول، کاربرد، بستر، فرآیند، مقدار یا مشکل فنی خود را توضیح دهید...",
    area:"حوزه", language:"زبان", depth:"نوع پاسخ",
    printing:"چاپ", packaging:"بسته‌بندی", paper:"کاغذ و مقوا", films:"فیلم‌ها", adhesives:"چسب‌ها", converting:"تبدیل و کانورتینگ", procurement:"تأمین و خرید", other:"سایر",
    practical:"پیشنهاد عملی", technical:"تحلیل فنی", commercial:"تحلیل فنی + تجاری",
    fresh:"در صورت نیاز، از اطلاعات عمومی و به‌روز استفاده شود.",
    submit:"شروع گفت‌وگوی حرفه‌ای", method:"روش SEC PACK", how:"مشاور چگونه کار می‌کند",
    clarify:"شفاف‌سازی", clarifyText:"کاربرد، بستر، ماشین/فرآیند، هدف کیفی، مقدار و مقصد را از هم تفکیک می‌کند.",
    analyze:"تحلیل", analyzeText:"گزینه‌های فنی، ملاحظات، ریسک‌ها و استانداردهای مرتبط را بدون ساختن اطلاعات ناموجود مقایسه می‌کند.",
    decide:"تصمیم", decideText:"فرضیات، گزینه‌های جایگزین و مراحل راستی‌آزمایی را برای تصمیم‌گیری ارائه می‌کند.",
    connecting:"در حال اتصال…", unavailable:"سرویس امن مشاور موقتاً در دسترس نیست.", noAnswer:"پاسخی از مشاور دریافت نشد."
  },
  ar: {
    brand:"المستشار المحترف", eyebrow:"SEC PACK · المستشار المحترف",
    title:"المستشار الفني للطباعة والتغليف",
    intro:"مساحة منظمة لاختيار المنتجات والمواصفات والطباعة والتغليف والتحويل والتوريد والأسئلة التجارية.",
    question:"السؤال / المتطلب", placeholder:"صف المنتج أو التطبيق أو الركيزة أو العملية أو الكمية أو المشكلة الفنية...",
    area:"المجال", language:"اللغة", depth:"أسلوب الإجابة",
    printing:"الطباعة", packaging:"التغليف", paper:"الورق والكرتون", films:"الأفلام", adhesives:"اللاصقات", converting:"التحويل والتجهيز", procurement:"التوريد والمشتريات", other:"أخرى",
    practical:"توصية عملية", technical:"تحليل فني", commercial:"تحليل فني وتجاري",
    fresh:"استخدام المعلومات العامة الحالية عند الحاجة إلى الحداثة.",
    submit:"بدء نقاش مهني", method:"منهج SEC PACK", how:"كيف يعمل المستشار",
    clarify:"التوضيح", clarifyText:"فصل التطبيق والركيزة والآلة/العملية وهدف الجودة والكمية والوجهة.",
    analyze:"التحليل", analyzeText:"مقارنة الخيارات الفنية والمفاضلات والمخاطر والمعايير ذات الصلة دون اختلاق معلومات مفقودة.",
    decide:"القرار", decideText:"عرض الافتراضات والبدائل وخطوات التحقق لمساعدة المستخدم على اتخاذ القرار.",
    connecting:"جارٍ الاتصال…", unavailable:"خدمة المستشار الآمنة غير متاحة مؤقتاً.", noAnswer:"لم يتم استلام إجابة من المستشار."
  }
};

const form = document.getElementById("advisorForm");
const status = document.getElementById("advisorStatus");
const button = document.getElementById("advisorSubmit");
const language = document.getElementById("advisorLanguage");

function currentLang(){ return ["en","fa","ar"].includes(language?.value) ? language.value : "en"; }
function applyLanguage(){
  const lang=currentLang(), t=TEXT[lang];
  document.documentElement.lang=lang;
  document.documentElement.dir=lang==="en"?"ltr":"rtl";
  document.title="SEC PACK | "+t.brand;
  document.querySelector("[data-t=brand]")?.replaceChildren(document.createTextNode(t.brand));
  document.querySelector("[data-t=eyebrow]")?.replaceChildren(document.createTextNode(t.eyebrow));
  document.querySelector("[data-t=title]")?.replaceChildren(document.createTextNode(t.title));
  document.querySelector("[data-t=intro]")?.replaceChildren(document.createTextNode(t.intro));
  document.querySelector("[data-t=question]")?.replaceChildren(document.createTextNode(t.question));
  document.getElementById("advisorQuestion").placeholder=t.placeholder;
  document.querySelector("[data-t=area]")?.replaceChildren(document.createTextNode(t.area));
  document.querySelector("[data-t=language]")?.replaceChildren(document.createTextNode(t.language));
  document.querySelector("[data-t=depth]")?.replaceChildren(document.createTextNode(t.depth));
  ["printing","packaging","paper","films","adhesives","converting","procurement","other","practical","technical","commercial"].forEach(k=>{
    document.querySelectorAll("[data-opt="+k+"]").forEach(el=>el.textContent=t[k]);
  });
  document.querySelector("[data-t=fresh]")?.replaceChildren(document.createTextNode(t.fresh));
  document.querySelector("[data-t=submit]")?.replaceChildren(document.createTextNode(t.submit));
  document.querySelector("[data-t=method]")?.replaceChildren(document.createTextNode(t.method));
  document.querySelector("[data-t=how]")?.replaceChildren(document.createTextNode(t.how));
  document.querySelector("[data-t=clarify]")?.replaceChildren(document.createTextNode("1. "+t.clarify));
  document.querySelector("[data-t=clarifyText]")?.replaceChildren(document.createTextNode(t.clarifyText));
  document.querySelector("[data-t=analyze]")?.replaceChildren(document.createTextNode("2. "+t.analyze));
  document.querySelector("[data-t=analyzeText]")?.replaceChildren(document.createTextNode(t.analyzeText));
  document.querySelector("[data-t=decide]")?.replaceChildren(document.createTextNode("3. "+t.decide));
  document.querySelector("[data-t=decideText]")?.replaceChildren(document.createTextNode(t.decideText));
}
language?.addEventListener("change",applyLanguage);
applyLanguage();

form?.addEventListener("submit", async (event) => {
  event.preventDefault();
  const question = document.getElementById("advisorQuestion").value.trim();
  if (!question) return;
  const t=TEXT[currentLang()];
  button.disabled=true;
  status.textContent=t.connecting;
  status.dataset.state="sending";
  try {
    const response=await fetch(AI_ENDPOINT,{
      method:"POST",
      headers:{"Accept":"application/json","Content-Type":"application/json"},
      body:JSON.stringify({
        question,
        area:document.getElementById("advisorArea").value,
        language:currentLang(),
        depth:document.getElementById("advisorDepth").value,
        useWeb:document.getElementById("advisorWeb").checked
      })
    });
    const data=await response.json().catch(()=>({}));
    if(!response.ok) throw new Error(data.error||"Request failed");
    status.textContent=data.answer||t.noAnswer;
    status.dataset.state=data.answer?"success":"error";
  } catch (_) {
    status.textContent=t.unavailable;
    status.dataset.state="error";
  } finally {
    button.disabled=false;
  }
});