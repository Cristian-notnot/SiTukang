// ===============================
// REVEAL ANIMATION
// ===============================

const reveals = document.querySelectorAll(".reveal");

function revealOnScroll() {
  reveals.forEach((element) => {

    const windowHeight = window.innerHeight;
    const revealTop = element.getBoundingClientRect().top;
    const revealPoint = 100;

    if (revealTop < windowHeight - revealPoint) {
      element.classList.add("active");
    }

  });
}

window.addEventListener("scroll", revealOnScroll);



// ===============================
// NAVBAR EFFECT
// ===============================

const navbar = document.querySelector("nav");

window.addEventListener("scroll", () => {

  if (window.scrollY > 50) {

    navbar.classList.add(
      "backdrop-blur-md",
      "bg-yellow-500/90",
      "shadow-xl"
    );

  } else {

    navbar.classList.remove(
      "backdrop-blur-md",
      "bg-yellow-500/90",
      "shadow-xl"
    );

  }

});



// ===============================
// BACK TO TOP BUTTON
// ===============================

const topBtn = document.getElementById("topBtn");

window.addEventListener("scroll", () => {

  if (window.scrollY > 300) {
    topBtn.classList.remove("hidden");
  } else {
    topBtn.classList.add("hidden");
  }

});

topBtn.addEventListener("click", () => {

  window.scrollTo({
    top: 0,
    behavior: "smooth"
  });

});







// ===============================
// SMOOTH SCROLL
// ===============================

document.querySelectorAll('a[href^="#"]').forEach(anchor => {

  anchor.addEventListener("click", function (e) {

    e.preventDefault();

    const target = document.querySelector(this.getAttribute("href"));

    target.scrollIntoView({
      behavior: "smooth"
    });

  });

});

// ===============================
// TEAM SLIDER


// Meet Our Team


let next = document.getElementById("next")
let prev = document.getElementById("prev")
let gambar = document.getElementById("gambar")

let image = [
    "../assets/css/img/worker.jpg",
    "../assets/css/img/rumah.jpg",
    "../assets/css/img/SiAir.jpg",
    "../assets/css/img/SiBangunan.jpg",
    "../assets/css/img/SiCat.jpg"
]

let ucapan = [
    "Worker",
    "Rumah",
    "Si Ari",
    "Si Bangunan",
    "Si Cat"
]

let index = 0;

function updateimg(){
    gambar.src = image[index];
    document.getElementById("Nama").textContent = ucapan[index];
}

// tampil pertama kali
updateimg();

setInterval(() => {
    index++;

    if(index > image.length - 1){
        index = 0;
    }

    updateimg();
}, 3000);

next.addEventListener("click", () => {
    index++;

    if(index > image.length - 1){
        index = 0;
    }

    updateimg();
})

prev.addEventListener("click", () => {
    index--;

    if(index < 0){
        index = image.length - 1;
    }

    updateimg();
})

console.info(gambar)