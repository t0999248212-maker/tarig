(function () {
  const auth = firebase.auth();

  auth.onAuthStateChanged(async (user) => {
    if (!user) {
      window.location.replace("index.html#login");
      return;
    }

    try {
      const token = await user.getIdTokenResult(true);

      if (token.claims.admin !== true) {
        alert("You are not authorized to access the admin dashboard.");
        await auth.signOut();
        window.location.replace("index.html#login");
        return;
      }

      const adminName = document.getElementById("adminName");
      if (adminName) {
        adminName.textContent = user.email || "Admin";
      }

      const logoutBtn = document.getElementById("logoutBtn");
      if (logoutBtn) {
        logoutBtn.addEventListener("click", async () => {
          try {
            await auth.signOut();
            window.location.href = "index.html#home";
          } catch (error) {
            console.error("Logout failed:", error);
            alert("Logout failed. Please try again.");
          }
        });
      }

      console.log("Admin access verified.");
    } catch (error) {
      console.error("Admin verification failed:", error);
      alert("Could not verify admin access. Please sign in again.");
      await auth.signOut();
      window.location.replace("index.html#login");
    }
  });
})();
