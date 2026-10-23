const stories = {
  food: {
    number: "01",
    symbol: '<svg viewBox="0 0 64 64"><path d="M15 30h34l-3 14c-1 5-5 8-10 8H28c-5 0-9-3-10-8l-3-14Z"></path><path d="M20 25h24M32 14v11M22 17c3 2 5 4 5 8M42 17c-3 2-5 4-5 8"></path></svg>',
    tags: ["نجد", "بدايات المملكة", "الطعام"],
    title: "مائدة من نجد",
    description: "اكتشف أدوات إعداد الطعام وكيف كانت المائدة تجمع أهل البيت والضيف في يومٍ نجدي قديم.",
    readingTime: "دقيقتان للقراءة",
  },
  clothing: {
    number: "02",
    symbol: '<svg viewBox="0 0 64 64"><path d="M21 17 9 25l8 11 7-5v23h16V31l7 5 8-11-12-8-6 6H27l-6-6Z"></path><path d="M27 23c2 3 8 3 10 0M32 25v29"></path></svg>',
    tags: ["الحجاز", "منتصف القرن", "الملابس"],
    title: "ملابس الحياة اليومية",
    description: "تأمل الأقمشة والزخارف وأساليب اللباس التي كانت تعبّر عن المنطقة والمناسبة ومكانة صاحبها.",
    readingTime: "3 دقائق للقراءة",
  },
  transport: {
    number: "03",
    symbol: '<svg viewBox="0 0 64 64"><circle cx="19" cy="47" r="7"></circle><circle cx="45" cy="47" r="7"></circle><path d="M19 47h26M13 28h33l-4 14H18l-5-14ZM46 28l8-9M17 28l-5-9"></path></svg>',
    tags: ["المنطقة الشرقية", "بدايات المملكة", "النقل"],
    title: "رحلة بين القرى",
    description: "اتبع الطريق الترابي وتعرّف على العربات والدواب التي ربطت القرى وحملت الناس والبضائع بينها.",
    readingTime: "دقيقتان للقراءة",
  },
  trade: {
    number: "04",
    symbol: '<svg viewBox="0 0 64 64"><path d="M10 25h44v28H10zM8 25l6-12h36l6 12"></path><path d="M16 25v28M48 25v28M26 36h12v17M17 13l-2 12M29 13l-1 12M41 13l1 12M50 13l-2 12"></path></svg>',
    tags: ["الحجاز", "قبل التوحيد", "التجارة"],
    title: "حكاية السوق القديم",
    description: "ادخل السوق القديم بين البسطات والجرار والصناديق، واكتشف كيف كانت السلع تُعرض وتُقايض.",
    readingTime: "4 دقائق للقراءة",
  },
  leisure: {
    number: "05",
    symbol: '<svg viewBox="0 0 64 64"><path d="M16 45h32v8H16zM22 45V32h20v13M18 32h28"></path><path d="M24 32c2-8 5-13 8-16 3 3 6 8 8 16M47 15v17M47 15l8 5M52 39c0 3-2 5-5 5s-5-2-5-5 2-5 5-5 5 2 5 5Z"></path></svg>',
    tags: ["الجنوب", "منتصف القرن", "الترفيه"],
    title: "أمسيات المجلس",
    description: "اجلس قرب الفانوس واستمع إلى حكايات المجلس وأهازيجه، حيث تحوّل اللقاء اليومي إلى ذاكرة مشتركة.",
    readingTime: "3 دقائق للقراءة",
  },
};

const periods = {
  past: {
    title: "الماضي البعيد",
    description: "تظهر هنا معاينة للمحتوى المتوفر عن الحياة اليومية في أقدم فترة زمنية.",
  },
  foundation: {
    title: "بدايات المملكة",
    description: "تظهر هنا معاينة للمحتوى المتوفر في الفترة الزمنية المختارة.",
  },
  mid: {
    title: "منتصف القرن",
    description: "تظهر هنا موضوعات الحياة اليومية المرتبطة بمنتصف القرن.",
  },
  modern: {
    title: "العصر الحديث",
    description: "تظهر هنا معاينة توضح تطور مظاهر الحياة اليومية في العصر الحديث.",
  },
};

const storyCard = document.querySelector(".story-card");
const storyNumber = document.querySelector("#story-number");
const storySymbol = document.querySelector("#story-symbol");
const storyTags = document.querySelector("#story-tags");
const storyTitle = document.querySelector("#story-title");
const storyDescription = document.querySelector("#story-description");
const storyReadingTime = document.querySelector("#story-reading-time");
const heritageScene = document.querySelector(".heritage-scene");
const topicButtons = [...document.querySelectorAll(".hotspot[data-topic]")];
const storyNext = document.querySelector(".story-next");
const storyPrevious = document.querySelector(".story-previous");

const selectStory = (button) => {
  const story = stories[button.dataset.topic];
  topicButtons.forEach((item) => {
    const selected = item === button;
    item.classList.toggle("selected", selected);
    item.setAttribute("aria-pressed", String(selected));
  });
  heritageScene.dataset.activeTopic = button.dataset.topic;
  if (storyCard) {
    storyCard.classList.remove("changing");
    requestAnimationFrame(() => storyCard.classList.add("changing"));
  }
  if (story) {
    storyNumber.textContent = story.number;
    storySymbol.innerHTML = story.symbol;
    storyTags.innerHTML = story.tags.map((tag) => `<span>${tag}</span>`).join("");
    storyTitle.textContent = story.title;
    storyDescription.textContent = story.description;
    storyReadingTime.textContent = `${story.readingTime} · يظهر المحتوى مع مصدره المرجعي`;
  }
};

topicButtons.forEach((button) => {
  button.addEventListener("click", () => selectStory(button));
});

const moveStory = (direction) => {
  const currentIndex = Math.max(0, topicButtons.findIndex((button) => button.classList.contains("selected")));
  const nextIndex = (currentIndex + direction + topicButtons.length) % topicButtons.length;
  selectStory(topicButtons[nextIndex]);
  topicButtons[nextIndex].focus({ preventScroll: true });
};

storyNext?.addEventListener("click", () => moveStory(1));
storyPrevious?.addEventListener("click", () => moveStory(-1));

const periodButtons = [...document.querySelectorAll("[data-period]")];
const timelineProgress = document.querySelector(".timeline-progress");
const timelineCard = document.querySelector(".timeline-card");
const timeline = document.querySelector(".timeline");

if (timeline && timelineCard) {
  const timelineRunner = timeline.querySelector(".timeline-runner");
  const cardTitle = document.querySelector("#timeline-card-title");
  const cardDescription = document.querySelector("#timeline-card-description");
  const initialIndex = Math.max(0, periodButtons.findIndex((button) => button.classList.contains("active")));
  let reachedIndex = initialIndex;
  let timelineMoving = false;
  const graphicSources = Object.fromEntries(periodButtons.map((button) => [button.dataset.period, button.querySelector(".timeline-graphic img")?.getAttribute("src")]));

  const placeTimelineRunner = (button) => {
    const timelineRect = timeline.getBoundingClientRect();
    const buttonRect = button.getBoundingClientRect();
    timelineRunner.style.left = `${buttonRect.left + buttonRect.width / 2 - timelineRect.left}px`;
  };

  const moveTimelineVehicle = (fromButton, toButton) => new Promise((resolve) => {
    timelineRunner.querySelector("img").src = graphicSources[fromButton.dataset.period];
    timelineRunner.classList.remove("is-camel", "is-shas", "is-gmc", "is-metro");
    timelineRunner.classList.add(`is-${fromButton.dataset.vehicle}`);
    timelineRunner.classList.remove("is-exiting");
    placeTimelineRunner(fromButton);
    requestAnimationFrame(() => {
      timelineRunner.classList.add("is-moving");
      requestAnimationFrame(() => placeTimelineRunner(toButton));
    });
    const finish = () => {
      timelineRunner.classList.add("is-exiting");
      window.setTimeout(() => {
        timelineRunner.classList.remove("is-moving", "is-exiting", "is-camel", "is-shas", "is-gmc", "is-metro");
        resolve();
      }, 280);
    };
    timelineRunner.addEventListener("transitionend", (event) => {
      if (event.propertyName === "left") finish();
    }, { once: true });
    window.setTimeout(finish, 1650);
  });

  const resetTimeline = () => {
    periodButtons.forEach((button, index) => {
      button.classList.toggle("active", index === 0);
      button.setAttribute("aria-pressed", String(index === 0));
      button.querySelector(".timeline-graphic")?.classList.toggle("is-visible", index === 0);
    });
    reachedIndex = 0;
    placeTimelineRunner(periodButtons[0]);
  };

  periodButtons.forEach((button, index) => {
    button.addEventListener("click", async () => {
      if (timelineMoving) return;
      timelineMoving = true;
      if (index < reachedIndex) resetTimeline();
      periodButtons.forEach((item) => {
        const active = item === button;
        item.classList.toggle("active", active);
        item.setAttribute("aria-pressed", String(active));
      });
      for (let step = reachedIndex; step < index; step += 1) {
        const fromButton = periodButtons[step];
        const toButton = periodButtons[step + 1];
        fromButton.querySelector(".timeline-graphic")?.classList.remove("is-visible");
        await moveTimelineVehicle(fromButton, toButton);
        toButton.querySelector(".timeline-graphic")?.classList.add("is-visible");
      }
      reachedIndex = index;
      const period = periods[button.dataset.period];
      cardTitle.textContent = period.title;
      cardDescription.textContent = period.description;
      timelineProgress.style.width = `${Math.max(31, (index / (periodButtons.length - 1)) * 86)}%`;
      timelineCard.classList.remove("changing");
      void timelineCard.offsetWidth;
      timelineCard.classList.add("changing");
      timelineMoving = false;
    });
  });

  window.addEventListener("resize", () => {
    if (!timelineMoving) placeTimelineRunner(periodButtons[reachedIndex]);
  });
  placeTimelineRunner(periodButtons[reachedIndex]);
}

const searchButton = document.querySelector(".search-button");
const searchDrawer = document.querySelector(".search-drawer");
const searchInput = document.querySelector("#site-search");

searchButton.addEventListener("click", () => {
  const open = searchDrawer.classList.toggle("open");
  searchButton.setAttribute("aria-expanded", String(open));
  searchDrawer.setAttribute("aria-hidden", String(!open));
  if (open) searchInput.focus();
});

document.querySelector(".search-form").addEventListener("submit", (event) => {
  event.preventDefault();
});

const menuButton = document.querySelector(".mobile-menu-button");
const mainNavigation = document.querySelector(".main-navigation");
const navLinks = [...document.querySelectorAll(".main-navigation a")];

menuButton.addEventListener("click", () => {
  const open = mainNavigation.classList.toggle("open");
  menuButton.setAttribute("aria-expanded", String(open));
});

mainNavigation.addEventListener("click", (event) => {
  if (!event.target.matches("a")) return;
  navLinks.forEach((link) => link.classList.toggle("active", link === event.target));
  mainNavigation.classList.remove("open");
  menuButton.setAttribute("aria-expanded", "false");
});

const observer = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add("visible");
        observer.unobserve(entry.target);
      }
    });
  },
  { threshold: 0.12 },
);

document.querySelectorAll(".reveal").forEach((element) => observer.observe(element));

const hourHand = document.querySelector(".hour-hand");
const minuteHand = document.querySelector(".minute-hand");
const secondHand = document.querySelector(".second-hand");
const riyadhTimeText = document.querySelector("#riyadh-time-text");

function updateRiyadhClock() {
  const now = new Date();
  const parts = new Intl.DateTimeFormat("en-GB", {
    timeZone: "Asia/Riyadh",
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
    hourCycle: "h23",
  }).formatToParts(now);

  const time = Object.fromEntries(parts.map((part) => [part.type, part.value]));
  const hours = Number(time.hour);
  const minutes = Number(time.minute);
  const seconds = Number(time.second);

  hourHand.style.transform = `translateX(-50%) rotate(${(hours % 12) * 30 + minutes * 0.5}deg)`;
  minuteHand.style.transform = `translateX(-50%) rotate(${minutes * 6 + seconds * 0.1}deg)`;
  secondHand.style.transform = `translateX(-50%) rotate(${seconds * 6}deg)`;
  riyadhTimeText.textContent = `توقيت المملكة: ${new Intl.DateTimeFormat(window.IyabI18n?.language === "en" ? "en-GB" : "ar-SA", {
    timeZone: "Asia/Riyadh",
    hour: "numeric",
    minute: "2-digit",
  }).format(now)}`;
}

updateRiyadhClock();
setInterval(updateRiyadhClock, 1000);

const hero = document.querySelector(".hero");
const heroClock = document.querySelector(".hero-clock");
const heroStageScale = document.querySelector(".hero-stage-scale");
const heroSceneOrder = ["present", "okaz", "dawn"];
const heroScenes = heroSceneOrder.map((scene) => document.querySelector(`[data-scene="${scene}"]`));
const heroSceneStatus = document.querySelector(".hero-scene-status");
const heroSceneLabels = ["كافد والحاضر", "سوق عكاظ", "قافلة الفجر إلى الواحة"];
let heroSceneIndex = 0;

function scaleHeroStage() {
  if (window.matchMedia("(max-width: 620px)").matches) {
    hero.style.removeProperty("--hero-scale");
    return;
  }
  hero.style.setProperty("--hero-scale", String(hero.clientWidth / 1180));
}

scaleHeroStage();
new ResizeObserver(scaleHeroStage).observe(hero);

function showHeroScene(index) {
  heroSceneIndex = index;
  heroScenes.forEach((scene, sceneIndex) => scene.classList.toggle("active", sceneIndex === index));
  hero.dataset.heroScene = heroScenes[index].dataset.scene;
  heroSceneStatus.textContent = heroSceneLabels[index];
  const nextIndex = (index + 1) % heroScenes.length;
  heroClock.setAttribute("aria-label", `انتقل إلى مشهد ${heroSceneLabels[nextIndex]}`);
}

heroClock.addEventListener("click", () => {
  heroClock.classList.remove("is-turning");
  hero.classList.remove("scene-changing");
  void heroClock.offsetWidth;
  heroClock.classList.add("is-turning");
  hero.classList.add("scene-changing");
  showHeroScene((heroSceneIndex + 1) % heroScenes.length);
  window.setTimeout(() => {
    heroClock.classList.remove("is-turning");
    hero.classList.remove("scene-changing");
  }, 920);
});
