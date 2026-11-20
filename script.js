// ─── Active nav link highlighting ────────────────────────────────
const navLinks = document.querySelectorAll(".nav-links a");
const sections = document.querySelectorAll("section");

function updateActiveNav() {
  let current = "";
  sections.forEach((section) => {
    const sectionTop = section.offsetTop - 120;
    if (scrollY >= sectionTop) {
      current = section.getAttribute("id");
    }
  });

  navLinks.forEach((link) => {
    link.classList.remove("active");
    if (link.getAttribute("href").slice(1) === current) {
      link.classList.add("active");
    }
  });
}

window.addEventListener("scroll", updateActiveNav);

// ─── Mobile menu toggle ─────────────────────────────────────────
const navPill = document.querySelector(".nav-pill");
const menuBtn = document.querySelector(".nav-menu-btn");

if (menuBtn) {
  menuBtn.addEventListener("click", () => {
    navPill.classList.toggle("menu-open");
  });

  // Close menu when clicking outside
  document.addEventListener("click", (e) => {
    if (!navPill.contains(e.target) && navPill.classList.contains("menu-open")) {
      navPill.classList.remove("menu-open");
    }
  });
}

// Close menu on link click (mobile)
navLinks.forEach((link) => {
  link.addEventListener("click", () => {
    navPill.classList.remove("menu-open");
  });
});

// ─── Scroll-reveal animations ───────────────────────────────────
const revealObserver = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.style.animationName = "fadeUp";
        entry.target.style.animationDuration = "0.5s";
        entry.target.style.animationTimingFunction =
          "cubic-bezier(0.4, 0, 0.2, 1)";
        entry.target.style.animationFillMode = "forwards";
        revealObserver.unobserve(entry.target);
      }
    });
  },
  { threshold: 0.06, rootMargin: "0px 0px -30px 0px" },
);

document
  .querySelectorAll(
    ".tile-stat, .tile-exp, .tile-project, .tile-edu, " +
      ".tile-approach, .cluster, .contact-chip, " +
      ".section-label, .about-lead, .approach-heading",
  )
  .forEach((el, i) => {
    el.style.opacity = "0";
    el.style.animationDelay = `${Math.min(i % 5, 4) * 70}ms`;
    revealObserver.observe(el);
  });

// ─── Smooth scroll for anchor links ─────────────────────────────
document.querySelectorAll('a[href^="#"]').forEach((anchor) => {
  anchor.addEventListener("click", function (e) {
    e.preventDefault();
    const target = document.querySelector(this.getAttribute("href"));
    if (target) {
      target.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  });
});

// ─── Counter animation for stat numbers ─────────────────────────
function animateCounter(element, target, duration = 1600) {
  let start = 0;
  const suffix = element.textContent.replace(String(target), "");
  const increment = target / (duration / 16);

  const tick = () => {
    start += increment;
    if (start < target) {
      element.textContent = Math.floor(start) + suffix;
      requestAnimationFrame(tick);
    } else {
      element.textContent = target + suffix;
    }
  };
  tick();
}

const statObserver = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.querySelectorAll(".stat-num").forEach((el) => {
          const num = parseInt(el.textContent);
          if (!isNaN(num)) animateCounter(el, num);
        });
        statObserver.unobserve(entry.target);
      }
    });
  },
  { threshold: 0.5 },
);

const statTiles = document.querySelector(".stat-tiles");
if (statTiles) statObserver.observe(statTiles);

// ─── Keyboard-nav accessibility ─────────────────────────────────
document.addEventListener("keydown", (e) => {
  if (e.key === "Tab") document.body.classList.add("keyboard-nav");
});
document.addEventListener("mousedown", () => {
  document.body.classList.remove("keyboard-nav");
});

// ─── Resume download tracking ───────────────────────────────────
document
  .querySelectorAll('a[href*="CV_Suman_Phuyal"][download]')
  .forEach((link) => {
    link.addEventListener("click", (e) => {
      e.preventDefault();
      const dl = document.createElement("a");
      dl.href = link.getAttribute("href");
      dl.download = "CV_Suman_Phuyal_V3.pdf";
      document.body.appendChild(dl);
      dl.click();
      document.body.removeChild(dl);

      if (typeof gtag !== "undefined") {
        gtag("event", "file_download", {
          file_name: "CV_Suman_Phuyal_V3.pdf",
          file_extension: "pdf",
        });
      }
    });
  });
