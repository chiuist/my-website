document.addEventListener("DOMContentLoaded", () => {
  const main = document.querySelector("main");
  const cover = main?.querySelector(".doc-cover");
  if (!main || !cover) return;

  const sections = [...main.querySelectorAll("section[id]")].filter(
    (section) => !section.classList.contains("doc-cover"),
  );
  if (sections.length < 2) return;

  const nav = document.createElement("nav");
  nav.className = "manual-subnav";
  nav.setAttribute("aria-label", "本页目录");

  const label = document.createElement("span");
  label.textContent = "On this page";
  nav.append(label);

  const links = new Map();
  sections.slice(0, 12).forEach((section) => {
    const heading = section.querySelector(":scope > h2") || section.querySelector("h2");
    if (!heading) return;

    const link = document.createElement("a");
    link.href = `#${section.id}`;
    link.textContent = heading.textContent.trim().replace(/^\d+[.、]\s*/, "");
    nav.append(link);
    links.set(section, link);
  });

  cover.insertAdjacentElement("afterend", nav);

  const observer = new IntersectionObserver(
    (entries) => {
      const visible = entries
        .filter((entry) => entry.isIntersecting)
        .sort((a, b) => a.boundingClientRect.top - b.boundingClientRect.top)[0];
      if (!visible) return;

      links.forEach((link, section) => {
        if (section === visible.target) link.setAttribute("aria-current", "true");
        else link.removeAttribute("aria-current");
      });
    },
    { rootMargin: "-26% 0px -62% 0px", threshold: 0 },
  );

  links.forEach((_link, section) => observer.observe(section));
});
