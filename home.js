const body = document.body;
const menuToggle = document.querySelector("[data-menu-toggle]");
const mobileMenu = document.querySelector("[data-mobile-menu]");
const dialog = document.querySelector("[data-product-dialog]");
const dialogTitle = document.querySelector("[data-dialog-title]");
const dialogSummary = document.querySelector("[data-dialog-summary]");
const dialogFocus = document.querySelector("[data-dialog-focus]");
const dialogClose = document.querySelector("[data-dialog-close]");

function setMenu(open) {
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

document.querySelectorAll("[data-reveal]").forEach((element) => observer.observe(element));
