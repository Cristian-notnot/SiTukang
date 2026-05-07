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


document.querySelectorAll('a[href^="#"]').forEach(anchor => {

  anchor.addEventListener("click", function (e) {

    e.preventDefault();

    const target = document.querySelector(this.getAttribute("href"));

    target.scrollIntoView({
      behavior: "smooth"
    });

  });

});

//image slider

let next = document.getElementById("next");
let prev = document.getElementById("prev");
let gambar = document.getElementById("gambar");

let image = [
    "/assets/css/img/agi.jpeg",
    "/assets/css/img/ade.jpeg",
    "/assets/css/img/anas.jpeg",
    "/assets/css/img/charly.jpeg",
    "/assets/css/img/SiCat.jpg"
];

let ucapan = [
    "Nouval Al Ghifary",
    "Ade Nizar Septian",
    "Annas Khorul Amri",
    "Charly Agusta Cristiano",
    "Bruno"
];

let deskripsi = [
    "Sebagai front end & backend developer",
    "sebagai backend developer",
    "sebagai front end developer",
    "sebagai front end developer",
    "sebagai UI/UX designer"
];

let index = 0;

function updateimg(){

    gambar.style.opacity = "0";
    gambar.style.transform = "scale(0.95)";

    setTimeout(() => {

        gambar.src = image[index];

        document.getElementById("Nama").textContent = ucapan[index];

        document.getElementById("info").textContent = deskripsi[index];

        gambar.style.opacity = "1";
        gambar.style.transform = "scale(1)";


    }, 300);
}

prev.addEventListener("click",()=>{

    index--;

    if(index < 0){
        index = image.length - 1;
    }

    updateimg();
});

setInterval(()=>{

    index++;

    if(index > image.length - 1){
        index = 0;
    }

    updateimg();

},4000);