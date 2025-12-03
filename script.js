// FADE IN ON SCROLL
const faders = document.querySelectorAll('.fade-in');

const io = new IntersectionObserver(entries => {
  entries.forEach(entry => {
    if (entry.isIntersecting) entry.target.classList.add('visible');
  });
});
faders.forEach(f => io.observe(f));


// HEADER BLUR ON SCROLL
const header = document.querySelector('.site-header');
window.addEventListener('scroll', () => {
  if (window.scrollY > 80) {
    header.classList.add('scrolled');
  } else {
    header.classList.remove('scrolled');
  }
});


// BACK TO TOP BUTTON
const btnTop = document.createElement("button");
btnTop.id = "backToTop";
btnTop.innerHTML = "▲";
document.body.appendChild(btnTop);

window.addEventListener("scroll", () => {
  btnTop.style.display = window.scrollY > 400 ? "block" : "none";
});

btnTop.onclick = () => {
  window.scrollTo({ top: 0, behavior: "smooth" });
};


// CATEGORY CLICK EFFECT
document.querySelectorAll('.cat').forEach(cat => {
  cat.addEventListener('click', () => {
    cat.classList.add('selected');
    setTimeout(() => cat.classList.remove('selected'), 600);
  });
});

const track = document.querySelector(".carousel-track");
const btnPrev = document.querySelector(".carousel-btn.prev");
const btnNext = document.querySelector(".carousel-btn.next");

let pos = 0;
const itemWidth = 344; // card + gap

btnNext.addEventListener("click", () => {
  if (pos > -(track.children.length - 3) * itemWidth) {
    pos -= itemWidth;
    track.style.transform = `translateX(${pos}px)`;
  }
});

btnPrev.addEventListener("click", () => {
  if (pos < 0) {
    pos += itemWidth;
    track.style.transform = `translateX(${pos}px)`;
  }
});
