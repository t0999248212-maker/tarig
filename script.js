function showPage() {
  const hash = window.location.hash || "#home";
  const pageId = hash.substring(1);
  const pages = document.querySelectorAll(".page");

  const selectedPage = document.getElementById(pageId) || document.getElementById("home");

  pages.forEach((page) => {
    page.classList.toggle("active", page === selectedPage);
  });

  window.scrollTo({ top: 0, behavior: "auto" });
}

window.addEventListener("hashchange", showPage);
window.addEventListener("load", showPage);

const loginForm = document.getElementById("loginForm");

if (loginForm) {
  loginForm.addEventListener("submit", function (event) {
    event.preventDefault();

    const email = document.getElementById("loginEmail").value;
    const password = document.getElementById("loginPassword").value;

    if (email && password) {
      alert("Login successful! (Demo only)");
    }
  });
}

const signupForm = document.getElementById("signupForm");

if (signupForm) {
  signupForm.addEventListener("submit", function (event) {
    event.preventDefault();

    const name = document.getElementById("name").value;
    const email = document.getElementById("signupEmail").value;
    const password = document.getElementById("signupPassword").value;

    if (name && email && password) {
      alert("Account created successfully! (Demo only)");
      window.location.hash = "#login";
    }
  });
}

const calculatorButton = document.querySelector(".calculator-button");
const loanInput = document.getElementById("loanAmount");
const calculatorResult = document.getElementById("calculatorResult");

if (calculatorButton && loanInput && calculatorResult) {
  calculatorButton.addEventListener("click", function () {
    const rawValue = loanInput.value.replace(/[^\d.]/g, "");
    const principal = Number(rawValue) || 300000;
    const monthlyPayment = Math.round(principal / 12);
    calculatorResult.textContent = `$${monthlyPayment.toLocaleString()} / month`;
  });
}
