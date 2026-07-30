const body = document.body;
const menuToggle = document.querySelector("[data-menu-toggle]");
const mobileMenu = document.querySelector("[data-mobile-menu]");
const dialog = document.querySelector("[data-product-dialog]");
const dialogTitle = document.querySelector("[data-dialog-title]");
const dialogSummary = document.querySelector("[data-dialog-summary]");
const dialogFocus = document.querySelector("[data-dialog-focus]");
const dialogClose = document.querySelector("[data-dialog-close]");
const header = document.querySelector("[data-header]");
const heroVisual = document.querySelector(".hero-visual");
const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)");
const precisePointer = window.matchMedia("(pointer: fine)");

function setMenu(open) {
  if (!menuToggle || !mobileMenu) return;
  menuToggle.setAttribute("aria-expanded", String(open));
  menuToggle.setAttribute("aria-label", open ? "关闭导航菜单" : "打开导航菜单");
  menuToggle.querySelector("i").className = open ? "ri-close-line" : "ri-menu-3-line";
  mobileMenu.hidden = !open;
  body.classList.toggle("menu-open", open);
}

menuToggle?.addEventListener("click", () => {
  setMenu(menuToggle.getAttribute("aria-expanded") !== "true");
});

mobileMenu?.querySelectorAll("a").forEach((link) => {
  link.addEventListener("click", () => setMenu(false));
});

document.addEventListener("keydown", (event) => {
  if (event.key !== "Escape" || menuToggle?.getAttribute("aria-expanded") !== "true") return;
  setMenu(false);
  menuToggle.focus();
});

window.addEventListener("resize", () => {
  if (window.innerWidth > 820 && menuToggle?.getAttribute("aria-expanded") === "true") {
    setMenu(false);
  }
});

document.querySelectorAll("[data-product]").forEach((button) => {
  button.addEventListener("click", () => {
    dialogTitle.textContent = button.dataset.product;
    dialogSummary.textContent = button.dataset.summary;
    dialogFocus.textContent = button.dataset.focus;
    dialog.showModal();
    dialogClose.focus();
  });
});

dialogClose?.addEventListener("click", () => dialog.close());

dialog?.addEventListener("click", (event) => {
  if (event.target === dialog) dialog.close();
});

const revealElements = document.querySelectorAll("[data-reveal]");

revealElements.forEach((element, index) => {
  element.style.setProperty("--reveal-delay", `${Math.min(index % 6, 4) * 55}ms`);
});

if ("IntersectionObserver" in window) {
  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;
        entry.target.classList.add("is-visible");
        observer.unobserve(entry.target);
      });
    },
    { threshold: 0.12 },
  );

  revealElements.forEach((element) => observer.observe(element));
} else {
  revealElements.forEach((element) => element.classList.add("is-visible"));
}

function updateHeader() {
  header?.classList.toggle("is-scrolled", window.scrollY > 24);
}

updateHeader();
window.addEventListener("scroll", updateHeader, { passive: true });

if (heroVisual && precisePointer.matches && !reduceMotion.matches) {
  let animationFrame;

  heroVisual.addEventListener("pointermove", (event) => {
    const bounds = heroVisual.getBoundingClientRect();
    const offsetX = (event.clientX - bounds.left) / bounds.width - 0.5;
    const offsetY = (event.clientY - bounds.top) / bounds.height - 0.5;

    cancelAnimationFrame(animationFrame);
    animationFrame = requestAnimationFrame(() => {
      heroVisual.style.transform = `translate3d(${offsetX * 10}px, ${offsetY * 8}px, 0)`;
    });
  });

  heroVisual.addEventListener("pointerleave", () => {
    cancelAnimationFrame(animationFrame);
    heroVisual.style.transform = "translate3d(0, 0, 0)";
  });
}
