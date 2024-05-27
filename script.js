"use strict";

import { createClient } from "https://esm.sh/@supabase/supabase-js@2";
const supabaseUrl = "https://apiuivomhparrdogvxvj.supabase.co";
const supabaseKey =
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImFwaXVpdm9taHBhcnJkb2d2eHZqIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MTY0NzM0OTksImV4cCI6MjAzMjA0OTQ5OX0.B41W9nVTBoYIl8L48Ryej8JaBFBMHP1OZ_dg3YZsI8o";
const supabase = createClient(supabaseUrl, supabaseKey);

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

// Slider
const slider = function () {
  const slides = document.querySelectorAll(".slide");
  const btnLeft = document.querySelector(".slider-btn-left");
  const btnRight = document.querySelector(".slider-btn-right");
  const dotContainer = document.querySelector(".dots");

  let curSlide = 0;
  const maxSlide = slides.length;

  // Functions
  const createDots = function () {
    slides.forEach(function (_, i) {
      dotContainer.insertAdjacentHTML(
        "beforeend",
        `<button class="dots-dot" data-slide="${i}"></button>`
      );
    });
  };

  const activateDot = function (slide) {
    document
      .querySelectorAll(".dots-dot")
      .forEach((dot) => dot.classList.remove("dots-dot-active"));

    document
      .querySelector(`.dots-dot[data-slide="${slide}"]`)
      .classList.add("dots-dot-active");
  };

  const goToSlide = function (slide) {
    slides.forEach(
      (s, i) => (s.style.transform = `translateX(${100 * (i - slide)}%)`)
    );
  };

  // Next slide
  const nextSlide = function () {
    if (curSlide === maxSlide - 1) {
      curSlide = 0;
    } else {
      curSlide++;
    }

    goToSlide(curSlide);
    activateDot(curSlide);
  };

  const prevSlide = function () {
    if (curSlide === 0) {
      curSlide = maxSlide - 1;
    } else {
      curSlide--;
    }
    goToSlide(curSlide);
    activateDot(curSlide);
  };

  const init = function () {
    goToSlide(0);
    createDots();

    activateDot(0);
  };
  init();

  // Event handlers
  btnRight.addEventListener("click", nextSlide);
  btnLeft.addEventListener("click", prevSlide);

  document.addEventListener("keydown", function (e) {
    if (e.key === "ArrowLeft") prevSlide();
    e.key === "ArrowRight" && nextSlide();
  });

  dotContainer.addEventListener("click", function (e) {
    if (e.target.classList.contains("dots-dot")) {
      const { slide } = e.target.dataset;
      goToSlide(slide);
      activateDot(slide);
    }
  });
};
slider();

async function showStockOne() {
  try {
    const breedsTextField = document.querySelector(".avail-data-one");
    const { data, error } = await supabase
      .from("lizs-chicken-stock")
      .select("*");
    const filteredData = data.filter((entry) => entry.breed?.length);
    const availBreeds = filteredData.reduce(
      (html, entry, currIndex, dataArray) => {
        if (!entry.breed) return html;
        if (currIndex === dataArray.length - 1) {
          return (html += ` and ${entry.breed} breeds available `);
        }
        return (html += `${entry.breed}, `);
      },
      "We currently have "
    );
    breedsTextField.innerHTML = availBreeds;
  } catch (err) {
    console.log(err);
  }
}

async function showStockTwo() {
  try {
    const breedsTableField = document.querySelector(".avail-data-two");
    const { data, error } = await supabase
      .from("lizs-chicken-stock")
      .select("*");
    const filteredData = data.filter((entry) => entry.breed?.length);
    if (filteredData) {
      let html = `<table class='breeds-table'>
                        <caption>
                        Currently Available
                        </caption>
                        <thead>
                            <tr class='table-row'>
                                <th scope="col">Breed</th>
                                <th scope="col">Quantity</th>
                            </tr>
                        </thead>
                        <tbody>`;
      filteredData.forEach((entry) => {
        html += `<tr class='table-row'>
                    <th scope="row">${entry.breed}</th>
                    <td>${entry.quantity}</td>
                </tr>`;
      });
      html += "</table>";
      breedsTableField.innerHTML = html;
    }
  } catch (err) {
    console.log(err);
  }
}

showStockOne();
showStockTwo();

// modal and overlay behaviour for contact form;
const contactButtons = document.querySelectorAll(".contact");
const overlay = document.querySelector(".overlay");
const modal = document.querySelector(".modal");
const modalForm = document.querySelector(".modal-form");
const buttonCloseModal = document.querySelector(".btn-close-modal");

function changeModalState() {
  overlay.classList.toggle("hidden");
  modal.classList.toggle("hidden");
}

function openForm(event) {
  event.preventDefault();
  changeModalState();
}

buttonCloseModal.addEventListener("click", function () {
  changeModalState();
  modalForm.reset();
});

contactButtons.forEach((button) => button.addEventListener("click", openForm));
modalForm.addEventListener("submit", function (event) {
  event.preventDefault();
  changeModalState();
  modalForm.reset();
});
