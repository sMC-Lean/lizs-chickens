"use strict";

// sticky nav bar;
const nav = document.querySelector(".nav-bar");
const header = document.querySelector(".header");
// const navHeight = nav.getBoundingClientRect().height;
const processSection = document.querySelector(".process");

const stickyNav = function (entries) {
  const [entry] = entries;

  if (!entry.isIntersecting) nav.classList.add("sticky");
  else nav.classList.remove("sticky");
};

const headerObserver = new IntersectionObserver(stickyNav, {
  root: null,
  threshold: 0,
  rootMargin: `-${nav.getBoundingClientRect().height}px`,
});

headerObserver.observe(header);

// navbar hover animation for links;
const handleHover = function (e) {
  if (e.target.classList.contains("nav-link")) {
    const link = e.target;
    const siblings = link.closest(".nav-bar").querySelectorAll(".nav-link");
    const button = link.closest(".nav-bar").querySelector(".contact");
    siblings.forEach((el) => {
      if (el !== link) el.style.opacity = this;
    });
    // button.style.opacity = this;
  }
};

nav.addEventListener("mouseover", handleHover.bind(0.5));
nav.addEventListener("mouseout", handleHover.bind(1));

document.querySelector(".nav-links").addEventListener("click", function (e) {
  e.preventDefault();

  // Matching strategy
  if (e.target.classList.contains("nav-link")) {
    const id = e.target.getAttribute("href");
    document.querySelector(id).scrollIntoView({ behavior: "smooth" });
  }
});

const tabs = document.querySelectorAll(".process-tab");
const tabsContainer = document.querySelector(".process-tab-container");
const tabsContent = document.querySelectorAll(".process-content");

tabsContainer.addEventListener("click", function (e) {
  const clicked = e.target.closest(".process-tab");

  // Guard clause
  if (!clicked) return;

  // Remove active classes
  tabs.forEach((t) => t.classList.remove("process-tab-active"));
  tabsContent.forEach((c) => c.classList.remove("process-content-active"));

  // Activate tab
  clicked.classList.add("process-tab-active");

  // Activate content area
  document
    .querySelector(`.process-content-${clicked.dataset.tab}`)
    .classList.add("process-content-active");
});
