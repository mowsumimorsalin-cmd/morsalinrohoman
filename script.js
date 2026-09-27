document.addEventListener("DOMContentLoaded", () => {
  // Automatically locate the supplied profile image regardless of its extension.
  const imageCandidates = [
    "Rayhan Tanjim.jpg",
    "Rayhan Tanjim.jpeg",
    "Rayhan Tanjim.png",
    "Rayhan Tanjim.webp"
  ];

  const profileImages = document.querySelectorAll(".profile-image-js");

  function useProfileImage(path) {
    profileImages.forEach(img => {
      img.src = encodeURI(path);
      img.style.display = "block";
      const fallback = img.parentElement.querySelector(".profile-fallback");
      if (fallback) fallback.style.display = "none";
    });
  }

  function showFallback() {
    profileImages.forEach(img => {
      img.style.display = "none";
      const fallback = img.parentElement.querySelector(".profile-fallback");
      if (fallback) fallback.style.display = "grid";
    });
  }

  let foundImage = false;
  let index = 0;

  function testNextImage() {
    if (index >= imageCandidates.length) {
      if (!foundImage) showFallback();
      return;
    }
    const tester = new Image();
    const candidate = imageCandidates[index++];
    tester.onload = () => {
      foundImage = true;
      useProfileImage(candidate);
    };
    tester.onerror = testNextImage;
    tester.src = encodeURI(candidate);
  }

  testNextImage();

  // Mobile navigation.
  const menuToggle = document.querySelector(".menu-toggle");
  const navLinks = document.querySelector(".nav-links");

  function closeMenu() {
    menuToggle.classList.remove("active");
    navLinks.classList.remove("open");
    menuToggle.setAttribute("aria-expanded", "false");
    document.body.classList.remove("menu-open");
  }

  menuToggle.addEventListener("click", () => {
    const open = menuToggle.classList.toggle("active");
    navLinks.classList.toggle("open", open);
    menuToggle.setAttribute("aria-expanded", String(open));
    document.body.classList.toggle("menu-open", open);
  });

  navLinks.querySelectorAll("a").forEach(link => link.addEventListener("click", closeMenu));

  // Scroll reveal.
  const revealItems = document.querySelectorAll(".reveal");
  const revealObserver = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add("is-visible");
        revealObserver.unobserve(entry.target);
      }
    });
  }, { threshold: 0.12 });

  revealItems.forEach(item => revealObserver.observe(item));

  // Animated 1M+ counters.
  const counters = document.querySelectorAll("[data-counter]");
  const formatFollowerCount = value => value >= 1000000 ? "1M+" : value.toLocaleString();

  const animateCounter = element => {
    const target = Number(element.dataset.counter);
    const duration = 1300;
    const start = performance.now();

    const tick = now => {
      const progress = Math.min((now - start) / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      element.textContent = formatFollowerCount(Math.floor(target * eased));
      if (progress < 1) requestAnimationFrame(tick);
      else element.textContent = "1M+";
    };

    requestAnimationFrame(tick);
  };

  const counterObserver = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        animateCounter(entry.target);
        counterObserver.unobserve(entry.target);
      }
    });
  }, { threshold: 0.5 });

  counters.forEach(counter => counterObserver.observe(counter));

  // Active navigation section indicator.
  const sections = document.querySelectorAll("main section[id], header[id]");
  const navItems = document.querySelectorAll(".nav-link");

  const sectionObserver = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (!entry.isIntersecting) return;
      const id = entry.target.id;
      navItems.forEach(item => item.classList.toggle("active", item.getAttribute("href") === `#${id}`));
    });
  }, { rootMargin: "-35% 0px -55% 0px" });

  sections.forEach(section => sectionObserver.observe(section));

  // Front-end-only contact form: no email is sent.
  const form = document.getElementById("contact-form");
  const status = document.getElementById("form-status");

  form.addEventListener("submit", event => {
    event.preventDefault();

    if (!form.checkValidity()) {
      form.reportValidity();
      return;
    }

    status.textContent = "Thanks! Your message is ready to be sent. This demo form does not send email yet.";
    form.reset();
  });

  // Give external links safe, consistent behavior if opened by keyboard.
  document.querySelectorAll('a[target="_blank"]').forEach(link => {
    link.setAttribute("rel", "noopener");
  });
});
