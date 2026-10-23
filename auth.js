const IYAB_USER_KEY = "iyab-user";
const IYAB_SESSION_KEY = "iyab-session";
function authDestination(){
  const target=new URLSearchParams(location.search).get('returnTo')||'';
  return /^(saved-trips\.html|timeline\.html(?:\?(?:open=[0-4]:[0-3]:[0-4]|resume=[0-4]:[0-3]))?)$/.test(target)?target:'index.html';
}

const userIcon = `<svg viewBox="0 0 24 24" aria-hidden="true"><circle cx="12" cy="8" r="4"></circle><path d="M4 21c.6-5 3.3-7 8-7s7.4 2 8 7"></path></svg>`;

function sharedHeader() {
  return `
    <a class="skip-link" href="#main-content">تجاوز إلى المحتوى</a>
    <header class="site-header" id="home">
      <div class="header-landscape" aria-hidden="true"></div>
      <a class="brand-panel" href="index.html" aria-label="إياب — الصفحة الرئيسية">
        <span class="brand-mark"><img src="assets/iyab-logo.png" alt="شعار إياب" /></span>
        <span class="brand-tagline">عودة إلى حكاية مضت</span>
      </a>
      <span class="header-divider-ornament" aria-hidden="true"><i></i><i></i></span>
      <div class="header-capsule">
        <button class="mobile-menu-button" type="button" aria-expanded="false" aria-controls="main-navigation"><span></span><span></span><span></span><b>القائمة</b></button>
        <nav class="main-navigation" id="main-navigation" aria-label="التنقل الرئيسي">
          <a href="index.html#home">الرئيسية</a>
          <a href="index.html#content-explorer">استكشف المحتوى</a>
          <a href="timeline.html">الخط الزمني</a>
          <a href="index.html#journey">اختر رحلتك</a>
          <a href="index.html#about">عن إياب</a>
        </nav>
        <div class="header-actions">
          <button class="search-button" type="button" aria-label="فتح البحث" aria-expanded="false"><svg viewBox="0 0 24 24" aria-hidden="true"><circle cx="11" cy="11" r="7"></circle><path d="m20 20-4-4"></path></svg><span class="search-label-ar">ابحث</span><span class="search-label-en">Search</span></button>
          <button class="language-button" type="button" aria-label="تغيير اللغة إلى الإنجليزية">EN</button>
          <span class="action-divider" aria-hidden="true"></span>
          <div class="auth-menu-wrap">
            <a class="login-button" href="login.html" data-auth-trigger aria-expanded="false">${userIcon}<span data-auth-name>تسجيل الدخول</span><svg class="auth-chevron" viewBox="0 0 24 24" aria-hidden="true"><path d="m7 9 5 5 5-5"></path></svg></a>
            <div class="user-menu" data-user-menu hidden>
              <a href="account.html"><span>حسابي</span><span aria-hidden="true">♙</span></a>
              <a href="saved-trips.html"><span>رحلاتي المحفوظة</span><span aria-hidden="true">♧</span></a>
              <button type="button" data-logout><span>تسجيل الخروج</span><span aria-hidden="true">↪</span></button>
            </div>
          </div>
        </div>
      </div>
    </header>
    <div class="search-drawer" aria-hidden="true"><form class="search-form" role="search"><label for="site-search">ابحث في المحتوى الثقافي والتاريخي</label><div><input id="site-search" type="search" placeholder="مثال: الطعام في نجد" autocomplete="off" /><button type="submit">بحث</button></div></form></div>`;
}

function sharedFooter() {
  return `
    <footer class="site-footer">
      <div class="footer-main">
        <div class="footer-brand"><img src="assets/iyab-logo-footer-a-original.png" alt="شعار إياب" /></div>
        <div class="footer-clock">
          <div class="antique-clock" id="riyadh-clock" role="img" aria-label="ساعة تعرض الوقت الحالي في المملكة العربية السعودية">
            <span class="clock-number clock-number-12">XII</span><span class="clock-number clock-number-3">III</span><span class="clock-number clock-number-6">VI</span><span class="clock-number clock-number-9">IX</span>
            <i class="clock-hand hour-hand"></i><i class="clock-hand minute-hand"></i><i class="clock-hand second-hand"></i><i class="clock-center"></i>
          </div>
          <time id="riyadh-time-text" aria-live="off"></time>
        </div>
        <div class="project-details"><strong>مشروع جامعي تطبيقي</strong><span>مقرر IT 320 — جامعة الملك سعود</span></div>
      </div>
      <div class="footer-bottom">إياب — عودة إلى حكاية مضت</div>
    </footer>`;
}

document.querySelectorAll("[data-shared-header]").forEach((element) => { element.outerHTML = sharedHeader(); });
document.querySelectorAll("[data-shared-footer]").forEach((element) => { element.outerHTML = sharedFooter(); });

function readUser() {
  try { return JSON.parse(localStorage.getItem(IYAB_USER_KEY)) || null; } catch { return null; }
}

function saveUser(user) {
  localStorage.setItem(IYAB_USER_KEY, JSON.stringify(user));
}

function isSignedIn() {
  return localStorage.getItem(IYAB_SESSION_KEY) === "active";
}

function refreshAuthMenu() {
  const user = readUser();
  const signedIn = isSignedIn() && user;
  document.querySelectorAll(".auth-menu-wrap").forEach((wrap) => {
    const trigger = wrap.querySelector("[data-auth-trigger]");
    const name = wrap.querySelector("[data-auth-name]");
    const menu = wrap.querySelector("[data-user-menu]");
    wrap.classList.toggle("is-authenticated", Boolean(signedIn));
    name.textContent = signedIn ? user.name.split(" ")[0] : "تسجيل الدخول";
    trigger.href = signedIn ? "#user-menu" : "login.html";
    if (!signedIn) {
      menu.hidden = true;
      wrap.classList.remove("menu-open");
      trigger.setAttribute("aria-expanded", "false");
    }
  });
}

document.addEventListener("click", (event) => {
  const trigger = event.target.closest("[data-auth-trigger]");
  if (trigger && isSignedIn()) {
    event.preventDefault();
    const wrap = trigger.closest(".auth-menu-wrap");
    const menu = wrap.querySelector("[data-user-menu]");
    const open = menu.hidden;
    document.querySelectorAll("[data-user-menu]").forEach((item) => { item.hidden = true; });
    document.querySelectorAll(".auth-menu-wrap").forEach((item) => item.classList.remove("menu-open"));
    menu.hidden = !open;
    wrap.classList.toggle("menu-open", open);
    trigger.setAttribute("aria-expanded", String(open));
    return;
  }
  const logout = event.target.closest("[data-logout]");
  if (logout) {
    localStorage.removeItem(IYAB_SESSION_KEY);
    window.location.href = window.iyabLocalUrl ? window.iyabLocalUrl("index.html") : "index.html";
    return;
  }
  if (!event.target.closest(".auth-menu-wrap")) {
    document.querySelectorAll("[data-user-menu]").forEach((item) => { item.hidden = true; });
    document.querySelectorAll(".auth-menu-wrap").forEach((item) => item.classList.remove("menu-open"));
  }
});

document.querySelectorAll(".password-toggle").forEach((button) => {
  button.addEventListener("click", () => {
    const input = button.parentElement.querySelector("input");
    input.type = input.type === "password" ? "text" : "password";
    button.setAttribute("aria-label", input.type === "password" ? "إظهار كلمة المرور" : "إخفاء كلمة المرور");
  });
});

const signupForm = document.querySelector("#signup-form");
if (signupForm) {
  signupForm.addEventListener("submit", (event) => {
    event.preventDefault();
    const data = new FormData(signupForm);
    const message = signupForm.querySelector(".auth-message");
    if (data.get("password") !== data.get("confirmPassword")) {
      message.textContent = "كلمتا المرور غير متطابقتين.";
      return;
    }
    if (!data.get("terms")) {
      message.textContent = "يجب الموافقة على الشروط والأحكام.";
      return;
    }
    saveUser({ name: String(data.get("name")).trim(), email: String(data.get("email")).trim() });
    localStorage.setItem(IYAB_SESSION_KEY, "active");
    window.location.href = window.iyabLocalUrl ? window.iyabLocalUrl(authDestination()) : authDestination();
  });
}

const loginForm = document.querySelector("#login-form");
if (loginForm) {
  loginForm.addEventListener("submit", (event) => {
    event.preventDefault();
    const data = new FormData(loginForm);
    const email = String(data.get("email")).trim();
    const existing = readUser();
    saveUser(existing && existing.email === email ? existing : { name: email.split("@")[0] || "لورا", email });
    localStorage.setItem(IYAB_SESSION_KEY, "active");
    window.location.href = window.iyabLocalUrl ? window.iyabLocalUrl(authDestination()) : authDestination();
  });
}

const profileForm = document.querySelector("#profile-form");
if (profileForm) {
  const user = readUser() || { name: "لورا", email: "laura@example.com" };
  profileForm.elements.name.value = user.name;
  profileForm.elements.email.value = user.email;
  profileForm.addEventListener("submit", (event) => {
    event.preventDefault();
    const data = new FormData(profileForm);
    const status = profileForm.querySelector(".profile-status");
    if (data.get("newPassword") && data.get("newPassword") !== data.get("confirmPassword")) {
      status.textContent = "تأكيد كلمة المرور الجديدة غير مطابق.";
      return;
    }
    saveUser({ name: String(data.get("name")).trim(), email: String(data.get("email")).trim() });
    localStorage.setItem(IYAB_SESSION_KEY, "active");
    status.textContent = "تم حفظ التغييرات بنجاح.";
    refreshAuthMenu();
  });
}

if (document.body.classList.contains("account-surface")) {
  const searchButton = document.querySelector(".search-button");
  const searchDrawer = document.querySelector(".search-drawer");
  const menuButton = document.querySelector(".mobile-menu-button");
  const navigation = document.querySelector(".main-navigation");
  searchButton?.addEventListener("click", () => {
    const open = searchDrawer.classList.toggle("open");
    searchButton.setAttribute("aria-expanded", String(open));
    searchDrawer.setAttribute("aria-hidden", String(!open));
    if (open) searchDrawer.querySelector("input")?.focus();
  });
  searchDrawer?.querySelector("form")?.addEventListener("submit", (event) => event.preventDefault());
  menuButton?.addEventListener("click", () => {
    const open = navigation.classList.toggle("open");
    menuButton.setAttribute("aria-expanded", String(open));
  });

  const hourHand = document.querySelector(".hour-hand");
  const minuteHand = document.querySelector(".minute-hand");
  const secondHand = document.querySelector(".second-hand");
  const timeText = document.querySelector("#riyadh-time-text");
  const updateClock = () => {
    const now = new Date();
    const parts = new Intl.DateTimeFormat("en-GB", { timeZone: "Asia/Riyadh", hour: "2-digit", minute: "2-digit", second: "2-digit", hourCycle: "h23" }).formatToParts(now);
    const time = Object.fromEntries(parts.map((part) => [part.type, part.value]));
    const hours = Number(time.hour); const minutes = Number(time.minute); const seconds = Number(time.second);
    hourHand.style.transform = `translateX(-50%) rotate(${(hours % 12) * 30 + minutes * .5}deg)`;
    minuteHand.style.transform = `translateX(-50%) rotate(${minutes * 6 + seconds * .1}deg)`;
    secondHand.style.transform = `translateX(-50%) rotate(${seconds * 6}deg)`;
    timeText.textContent = `توقيت المملكة: ${new Intl.DateTimeFormat(window.IyabI18n?.language === "en" ? "en-GB" : "ar-SA", { timeZone: "Asia/Riyadh", hour: "numeric", minute: "2-digit" }).format(now)}`;
  };
  updateClock();
  window.setInterval(updateClock, 1000);
}

refreshAuthMenu();
