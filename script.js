const header = document.querySelector("#siteHeader");
const nav = document.querySelector("#mainNav");
const navToggle = document.querySelector(".nav-toggle");
const bookingPlaceholder = document.querySelector(".booking-placeholder");
const bookingToast = document.querySelector("#bookingToast");
const hero = document.querySelector(".hero");
const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

const refreshIcons = () => {
  if (window.lucide) {
    window.lucide.createIcons();
  }
};

const setStaggerDelay = (selector, step = 70, maxDelay = 620) => {
  document.querySelectorAll(selector).forEach((item, index) => {
    item.style.setProperty("--reveal-delay", `${Math.min(index * step, maxDelay)}ms`);
  });
};

const setNavOpen = (isOpen) => {
  document.body.classList.toggle("nav-open", isOpen);
  nav.classList.toggle("is-open", isOpen);
  navToggle.setAttribute("aria-expanded", String(isOpen));
  navToggle.setAttribute("aria-label", isOpen ? "Close navigation" : "Open navigation");
  navToggle.innerHTML = isOpen
    ? '<i data-lucide="x" aria-hidden="true"></i>'
    : '<i data-lucide="menu" aria-hidden="true"></i>';
  refreshIcons();
};

const updateHeader = () => {
  header.classList.toggle("is-scrolled", window.scrollY > 18);
};

navToggle.addEventListener("click", () => {
  setNavOpen(!nav.classList.contains("is-open"));
});

nav.querySelectorAll("a").forEach((link) => {
  link.addEventListener("click", () => setNavOpen(false));
});

window.addEventListener("scroll", updateHeader, { passive: true });
updateHeader();

let toastTimer;
bookingPlaceholder.addEventListener("click", (event) => {
  event.preventDefault();
  bookingToast.classList.add("is-visible");
  window.clearTimeout(toastTimer);
  toastTimer = window.setTimeout(() => {
    bookingToast.classList.remove("is-visible");
  }, 3600);
});

const revealItems = document.querySelectorAll(".reveal");

setStaggerDelay(".lookbook-grid .lookbook-item", 78, 700);

if (reducedMotion || !("IntersectionObserver" in window)) {
  revealItems.forEach((item) => item.classList.add("is-visible"));
} else {
  const revealObserver = new IntersectionObserver(
    (entries, observer) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("is-visible");
          observer.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.16 }
  );

  revealItems.forEach((item) => revealObserver.observe(item));
}

if (!reducedMotion && hero) {
  let pointerFrame = 0;

  const setHeroShift = (x, y) => {
    hero.style.setProperty("--hero-x", `${x.toFixed(2)}px`);
    hero.style.setProperty("--hero-y", `${y.toFixed(2)}px`);
  };

  hero.addEventListener("pointermove", (event) => {
    if (event.pointerType === "touch") {
      return;
    }

    window.cancelAnimationFrame(pointerFrame);
    pointerFrame = window.requestAnimationFrame(() => {
      const rect = hero.getBoundingClientRect();
      const x = ((event.clientX - rect.left) / rect.width - 0.5) * 18;
      const y = ((event.clientY - rect.top) / rect.height - 0.5) * 12;
      setHeroShift(x, y);
    });
  });

  hero.addEventListener("pointerleave", () => {
    window.cancelAnimationFrame(pointerFrame);
    setHeroShift(0, 0);
  });
}

refreshIcons();
