
function showPage() {
  const hash = window.location.hash || "#home";
  const pageId = hash.substring(1);
  const pages = document.querySelectorAll(".page");
  const target = document.getElementById(pageId);
  const homePage = document.getElementById("home");

  const selectedPage = target && target.closest(".page") ? target.closest(".page") : homePage;

  pages.forEach((page) => {
    page.classList.toggle("active", page === selectedPage);
  });

  if (target && homePage && target.closest("#home")) {
    target.scrollIntoView({ behavior: "auto", block: "start" });
  } else {
    window.scrollTo({ top: 0, behavior: "auto" });
  }

  if (pageId === "blog" && typeof db !== 'undefined' && db) {
    loadBlogs();
  }
}

window.addEventListener("hashchange", showPage);
window.addEventListener("load", showPage);

const loginForm = document.getElementById("loginForm");

if (loginForm) {
  loginForm.addEventListener("submit", async function (event) {
    event.preventDefault();

    const emailInput = document.getElementById("loginEmail");
    const passwordInput = document.getElementById("loginPassword");
    const email = emailInput ? emailInput.value.trim() : "";
    const password = passwordInput ? passwordInput.value : "";
   
    try {
      const userCredential = await auth.signInWithEmailAndPassword(email, password);
      const token = await userCredential.user.getIdTokenResult(true);

      if (token.claims.admin === true) {
        window.location.href = "admin.html";
      } else {
        alert("This account is not an admin.");
        window.location.href = "index.html#home";
      }
    } catch (error) {
      alert(error.message || "Login failed. Please check your email and password.");
    }
  });
}

const signupForm = document.getElementById("signupForm");

if (signupForm) {
  signupForm.addEventListener("submit", async function (event) {
    event.preventDefault();

    const nameInput = document.getElementById("name");
    const emailInput = document.getElementById("signupEmail");
    const passwordInput = document.getElementById("signupPassword");

    const name = nameInput ? nameInput.value.trim() : "";
    const email = emailInput ? emailInput.value.trim() : "";
    const password = passwordInput ? passwordInput.value : "";

    if (!name || !email || !password) {
      alert("Please fill in all fields.");
      return;
    }

    try {
      const userCredential = await auth.createUserWithEmailAndPassword(email, password);

      if (userCredential.user) {
        await userCredential.user.updateProfile({ displayName: name });
      }

      alert("Account created successfully!");
      window.location.href = "index.html#home";
     
    } catch (error) {
      alert(error.message || "Unable to create account.");
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

const contactForm = document.getElementById("contactForm");
if (contactForm) {
  contactForm.addEventListener("submit", async function (event) {
    event.preventDefault();

    const nameInput = document.getElementById("contactName");
    const emailInput = document.getElementById("contactEmail");
    const messageInput = document.getElementById("contactMessage");

    const name = nameInput ? nameInput.value.trim() : "";
    const email = emailInput ? emailInput.value.trim() : "";
    const text = messageInput ? messageInput.value.trim() : "";

    if (!name || !email || !text) {
      return;
    }

    try {
      await db.collection("messages").add({
        name,
        email,
        text,
        createdAt: firebase.firestore.FieldValue.serverTimestamp()
      });

      alert("Thank you! Your message has been sent successfully.");
      contactForm.reset();
    } catch (error) {
      alert(error.message || "Failed to send message. Please try again.");
    }
  });
}

async function loadBlogs() {
  const blogGrid = document.getElementById("dynamicBlogGrid");
  if (!blogGrid) return;

  if (typeof db === 'undefined' || !db) {
    console.log("Firebase not yet initialized");
    return;
  }

  try {
    const blogSnap = await db.collection("blogPosts").orderBy("createdAt", "desc").get();

    blogGrid.innerHTML = "";

    if (blogSnap.empty) {
      blogGrid.innerHTML = '<p style="grid-column: 1/-1; text-align: center; color: #667085;">No blog posts yet. Check back soon!</p>';
      return;
    }

    blogSnap.forEach((doc) => {
      const blog = doc.data();
      const article = document.createElement("article");
      article.className = "blog-card";
      article.innerHTML = `
        <div class="blog-card-copy">
          <h2>${escapeHtml(blog.title)}</h2>
          <p><strong>${escapeHtml(blog.category)}</strong></p>
          <p>${escapeHtml(blog.content.substring(0, 150))}...</p>
        </div>
      `;
      blogGrid.appendChild(article);
    });
  } catch (error) {
    console.error("Error loading blogs:", error);
    if (error.code === 'permission-denied') {
      console.log("Permission denied. Check your Firestore rules.");
    }
    blogGrid.innerHTML = '<p style="grid-column: 1/-1; text-align: center; color: #667085;">Unable to load blog posts.</p>';
  }
}

function escapeHtml(value) {
  return String(value)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/\"/g, "&quot;")
    .replace(/'/g, "&#039;");
}

window.addEventListener("load", () => {
  setTimeout(loadBlogs, 500);
});


const googleProvider = new firebase.auth.GoogleAuthProvider();
const githubProvider = new firebase.auth.GithubAuthProvider();

async function loginWithGoogle() {
  try {
    const result = await firebase.auth().signInWithPopup(googleProvider);
    console.log("Google login successful:", result.user.email);
    window.location.hash = "#home";
  } catch (error) {
    console.error("Google login error:", error.code, error.message);
    alert("Google login failed: " + error.code);
  }
}

async function loginWithGitHub() {
  try {
    const result = await firebase.auth().signInWithPopup(githubProvider);
    console.log("GitHub login successful:", result.user.email);
    window.location.hash = "#home";
  } catch (error) {
    console.error("GitHub login error:", error.code, error.message);
    alert("GitHub login failed: " + error.code);
  }
}

const socialButtons = document.querySelectorAll(".social-login button");

if (socialButtons[0]) {
  socialButtons[0].addEventListener("click", loginWithGoogle);
}
if (socialButtons[0]) {
  socialButtons[0].addEventListener("click", (event) => {

  });
}


async function loginWithGoogle() {
  try {
    const result = await firebase.auth().signInWithPopup(googleProvider);
    console.log("Google login successful:", result.user.email);
    window.location.hash = "#home";
  } catch (error) {
    console.error("Google login error:", error.code, error.message);
    alert("Google login failed: " + error.code);
  }
}

document.querySelectorAll(".social-login button")[0]
  ?.addEventListener("click", loginWithGoogle);