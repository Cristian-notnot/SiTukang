let currentStep = 1;
const totalSteps = 3;
function updateProgress() {
    const progress =
        ((currentStep - 1) / (totalSteps - 1)) * 100;

    document.getElementById("progressFill").style.width =
        progress + "%";}
function showStep(step) {

    document
        .querySelectorAll(".form-section")
        .forEach(section => {
            section.classList.remove("active");
        });

    document
        .getElementById(`step${step}`)
        .classList.add("active");

    currentStep = step;

    updateProgress();}

function nextStep(step) {
    if (step < totalSteps) {
        showStep(step + 1);
    }
}
function prevStep(step) {
    if (step > 1) {
        showStep(step - 1);
    } 
}

function togglePaymentFields() {

    const metode =
        document.getElementById("metodePembayaran").value;
    document.getElementById("bankFields").style.display =
        "none";
    document.getElementById("eWalletFields").style.display =
        "none";
    document.getElementById("qrisFields").style.display =
        "none";
    if (metode === "bank_transfer") {
        document.getElementById("bankFields").style.display =
            "block";}
    else if (metode === "e_wallet") {
        document.getElementById("eWalletFields").style.display =
            "block";}
    else if (metode === "qris") {
        document.getElementById("qrisFields").style.display =
            "block";}
}

document
    .getElementById("registerForm")
    .addEventListener("submit", function(e) {
        e.preventDefault();
        const password =
            document.getElementById("registerPassword").value;
        const confirmPassword =
            document.getElementById("confirmPassword").value;

        if (password !== confirmPassword) {
            alert("Password tidak cocok!");
            return; }

        const formData = {
            id: Date.now(),
            nama:
                document.querySelector(
                    'input[name="nama"]'
                ).value,
            email:
                document.querySelector(
                    'input[name="email"]'
                ).value,
            telepon:
                document.querySelector(
                    'input[name="telepon"]'
                ).value,
            alamat:
                document.querySelector(
                    'textarea[name="alamat"]'
                ).value,
            keahlian:
                document.querySelector(
                    'select[name="keahlian_utama"]'
                ).value,
            pengalaman:
                document.querySelector(
                    'select[name="pengalaman"]'
                ).value,
            password: password
        };
        let users =
            JSON.parse(
                localStorage.getItem("tukangUsers")
            ) || [];

        const emailSudahAda =
            users.find(user =>
                user.email === formData.email
            );

        if (emailSudahAda) {
            alert("Email sudah digunakan!");
            return;
        }
        users.push(formData);

        localStorage.setItem(
            "tukangUsers",
            JSON.stringify(users)
        );
        console.log(users);

localStorage.setItem(
    "currentTukang",
    JSON.stringify(formData)
);

window.location.href =
    "../dashboard/dashboardTukang.html";

        document.getElementById("registerForm").reset();

        showStep(1);
    });
updateProgress();