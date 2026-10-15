// Smooth navigation link highlighting
const navLinks = document.querySelectorAll(".nav-links a");
const sections = document.querySelectorAll("section");

function updateActiveNav() {
  let current = "";
  sections.forEach((section) => {
    const sectionTop = section.offsetTop - 100;
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

// Hamburger menu toggle
const hamburger = document.querySelector(".hamburger");
const navLinksContainer = document.querySelector(".nav-links");

if (hamburger) {
  hamburger.addEventListener("click", () => {
    navLinksContainer.style.display =
      navLinksContainer.style.display === "flex" ? "none" : "flex";
  });
}

// Close menu on link click
navLinks.forEach((link) => {
  link.addEventListener("click", () => {
    // Only close the menu if we're on mobile (hamburger is visible)
    if (window.innerWidth <= 768) {
      navLinksContainer.style.display = "none";
    }
  });
});

// Typing animation for hero title
const words = document.querySelectorAll(".word");
words.forEach((word, index) => {
  word.style.opacity = "0";
  word.style.animation = `fadeInUp 0.6s ease forwards ${index * 0.15}s`;
});

// Add animation styles dynamically
const style = document.createElement("style");
style.textContent = `
    @keyframes fadeInUp {
        from {
            opacity: 0;
            transform: translateY(20px);
        }
        to {
            opacity: 1;
            transform: translateY(0);
        }
    }

    @keyframes pulse {
        0%, 100% {
            opacity: 1;
        }
        50% {
            opacity: 0.5;
        }
    }
`;
document.head.appendChild(style);

// Intersection Observer for fade-in animations
const observerOptions = {
  threshold: 0.1,
  rootMargin: "0px 0px -50px 0px",
};

const observer = new IntersectionObserver((entries) => {
  entries.forEach((entry) => {
    if (entry.isIntersecting) {
      entry.target.style.animationName = "fadeInUp";
      entry.target.style.animationDuration = "0.6s";
      entry.target.style.animationTimingFunction = "ease";
      entry.target.style.animationFillMode = "forwards";
      observer.unobserve(entry.target);
    }
  });
}, observerOptions);

// Reveal content cards and section elements as they enter the viewport.
document
  .querySelectorAll(
    ".section-title, .about-text, .project-card, .skill-category, .stat, " +
      ".timeline-item, .education-item, .achievement-item, .contact-card",
  )
  .forEach((el, index) => {
    el.style.opacity = "0";
    el.style.animationDelay = `${Math.min(index % 4, 3) * 90}ms`;
    observer.observe(el);
  });

// Smooth scroll for buttons
document.querySelectorAll('a[href^="#"]').forEach((anchor) => {
  anchor.addEventListener("click", function (e) {
    e.preventDefault();
    const target = document.querySelector(this.getAttribute("href"));
    if (target) {
      target.scrollIntoView({
        behavior: "smooth",
        block: "start",
      });
    }
  });
});

// Mobile nav responsive
function handleResize() {
  if (window.innerWidth > 768) {
    navLinksContainer.style.display = "flex";
  } else {
    navLinksContainer.style.display = "none";
  }
}

window.addEventListener("resize", handleResize);
handleResize();

// Counter animation for stats
function animateCounter(element, target, duration = 2000) {
  let start = 0;
  const suffix = element.textContent.replace(String(target), "");
  const increment = target / (duration / 16);

  const updateCounter = () => {
    start += increment;
    if (start < target) {
      element.textContent = Math.floor(start) + suffix;
      requestAnimationFrame(updateCounter);
    } else {
      element.textContent = target + suffix;
    }
  };

  updateCounter();
}

const statObserver = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        const statNumbers = entry.target.querySelectorAll(".stat-number");
        statNumbers.forEach((stat) => {
          const text = stat.textContent;
          const number = parseInt(text);
          if (!isNaN(number)) {
            animateCounter(stat, number);
          }
        });
        statObserver.unobserve(entry.target);
      }
    });
  },
  { threshold: 0.5 },
);

const statsContainer = document.querySelector(".about-stats");
if (statsContainer) {
  statObserver.observe(statsContainer);
}

// Parallax effect on scroll. Keep this separate from the blob keyframe transform.
const blobs = document.querySelectorAll(".blob");
let parallaxFrame = null;

function updateBlobParallax() {
  const scrolled = window.scrollY;

  blobs.forEach((blob) => {
    const factor = Number(blob.dataset.parallaxFactor || 0.5);
    blob.style.setProperty("--parallax-y", `${scrolled * factor}px`);
  });

  parallaxFrame = null;
}

function requestBlobParallaxUpdate() {
  if (parallaxFrame === null) {
    parallaxFrame = requestAnimationFrame(updateBlobParallax);
  }
}

blobs.forEach((blob, index) => {
  blob.dataset.parallaxFactor = index === 0 ? "0.5" : "-0.3";
});

requestBlobParallaxUpdate();
window.addEventListener("scroll", requestBlobParallaxUpdate, { passive: true });

// Add ripple effect on button click
document.querySelectorAll(".btn").forEach((button) => {
  button.addEventListener("click", function (e) {
    const ripple = document.createElement("span");
    const rect = this.getBoundingClientRect();
    const size = Math.max(rect.width, rect.height);
    const x = e.clientX - rect.left - size / 2;
    const y = e.clientY - rect.top - size / 2;

    ripple.style.width = ripple.style.height = size + "px";
    ripple.style.left = x + "px";
    ripple.style.top = y + "px";
    ripple.classList.add("ripple");

    this.appendChild(ripple);

    setTimeout(() => ripple.remove(), 600);
  });
});

// Add ripple styles
const rippleStyle = document.createElement("style");
rippleStyle.textContent = `
    .btn {
        position: relative;
        overflow: hidden;
    }

    .ripple {
        position: absolute;
        border-radius: 50%;
        background: rgba(255, 255, 255, 0.5);
        transform: scale(0);
        animation: ripple-animation 0.6s ease-out;
        pointer-events: none;
    }

    @keyframes ripple-animation {
        to {
            transform: scale(4);
            opacity: 0;
        }
    }
`;
document.head.appendChild(rippleStyle);

// Lazy load images (if any)
if ("IntersectionObserver" in window) {
  const imageObserver = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.src = entry.target.dataset.src;
        imageObserver.unobserve(entry.target);
      }
    });
  });

  document
    .querySelectorAll("img[data-src]")
    .forEach((img) => imageObserver.observe(img));
}

// Track user interactions for accessibility
document.addEventListener("keydown", (e) => {
  if (e.key === "Tab") {
    document.body.classList.add("keyboard-nav");
  }
});

document.addEventListener("mousedown", () => {
  document.body.classList.remove("keyboard-nav");
});

// Track resume downloads
const resumeDownloadLinks = document.querySelectorAll(
  'a[href*="CV_Suman_Phuyal"][download]',
);
resumeDownloadLinks.forEach((link) => {
  link.addEventListener("click", (e) => {
    e.preventDefault();

    // Create a temporary anchor element to trigger the download
    const downloadLink = document.createElement("a");
    downloadLink.href = link.getAttribute("href");
    downloadLink.download = "CV_Suman_Phuyal_V3.pdf";
    document.body.appendChild(downloadLink);
    downloadLink.click();
    document.body.removeChild(downloadLink);

    // Track download with analytics (optional - can be used with Google Analytics, Mixpanel, etc.)
    if (typeof gtag !== "undefined") {
      gtag("event", "file_download", {
        file_name: "CV_Suman_Phuyal_V3.pdf",
        file_extension: "pdf",
      });
    }

    // Optional: Log to console for testing
    console.log("Resume downloaded: CV_Suman_Phuyal_V3.pdf");
  });
});

// Add slide-in animation style
const slideInStyle = document.createElement("style");
slideInStyle.textContent = `
  @keyframes slideInLeft {
    from {
      opacity: 0;
      transform: translateX(-30px);
    }
    to {
      opacity: 1;
      transform: translateX(0);
    }
  }

  @keyframes slideInRight {
    from {
      opacity: 0;
      transform: translateX(30px);
    }
    to {
      opacity: 1;
      transform: translateX(0);
    }
  }
`;
document.head.appendChild(slideInStyle);
