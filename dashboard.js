document.addEventListener("DOMContentLoaded", () => {
  const adminName = document.getElementById("adminName");
  const projectCount = document.getElementById("projectCount");
  const blogCount = document.getElementById("blogCount");
  const messageCount = document.getElementById("messageCount");
  const logoutBtn = document.getElementById("logoutBtn");

  const projectForm = document.getElementById("projectForm");
  const blogForm = document.getElementById("blogForm");
  const messageForm = document.getElementById("messageForm");

  const projectsList = document.getElementById("projectsList");
  const blogList = document.getElementById("blogList");
  const messageList = document.getElementById("messageList");

  if (!auth || !db) {
    alert("Firebase is not configured yet. Please add your Firebase credentials in firebase-config.js.");
    return;
  }

  auth.onAuthStateChanged(async (user) => {
    if (!user) {
      window.location.href = "index.html#login";
      return;
    }

    const name = user.displayName || user.email?.split("@")[0] || "Admin";
    adminName.textContent = name;
    await loadDashboardData();
  });

  logoutBtn.addEventListener("click", async () => {
    try {
      await auth.signOut();
      window.location.href = "index.html#login";
    } catch (error) {
      alert(error.message || "Unable to log out right now.");
    }
  });

  projectForm.addEventListener("submit", async (event) => {
    event.preventDefault();

    const title = document.getElementById("projectTitle").value.trim();
    const category = document.getElementById("projectCategory").value.trim();
    const description = document.getElementById("projectDescription").value.trim();

    if (!title || !category || !description) {
      return;
    }

    try {
      await db.collection("projects").add({
        title,
        category,
        description,
        createdAt: firebase.firestore.FieldValue.serverTimestamp()
      });

      projectForm.reset();
      await loadDashboardData();
    } catch (error) {
      alert(error.message || "Failed to add project.");
    }
  });

  blogForm.addEventListener("submit", async (event) => {
    event.preventDefault();

    const title = document.getElementById("blogTitle").value.trim();
    const category = document.getElementById("blogCategory").value.trim();
    const content = document.getElementById("blogContent").value.trim();

    if (!title || !category || !content) {
      return;
    }

    try {
      await db.collection("blogPosts").add({
        title,
        category,
        content,
        createdAt: firebase.firestore.FieldValue.serverTimestamp()
      });

      blogForm.reset();
      await loadDashboardData();
    } catch (error) {
      alert(error.message || "Failed to add blog post.");
    }
  });

  messageForm.addEventListener("submit", async (event) => {
    event.preventDefault();

    const name = document.getElementById("messageName").value.trim();
    const email = document.getElementById("messageEmail").value.trim();
    const text = document.getElementById("messageText").value.trim();

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

      messageForm.reset();
      await loadDashboardData();
    } catch (error) {
      alert(error.message || "Failed to send message.");
    }
  });

  async function loadDashboardData() {
    const [projectsSnap, blogSnap, messagesSnap] = await Promise.all([
      db.collection("projects").orderBy("createdAt", "desc").get(),
      db.collection("blogPosts").orderBy("createdAt", "desc").get(),
      db.collection("messages").orderBy("createdAt", "desc").get()
    ]);

    projectCount.textContent = projectsSnap.size;
    blogCount.textContent = blogSnap.size;
    messageCount.textContent = messagesSnap.size;

    renderList(projectsList, projectsSnap.docs, (doc) => ({
      title: doc.data().title,
      subtitle: doc.data().category,
      text: doc.data().description
    }));

    renderList(blogList, blogSnap.docs, (doc) => ({
      title: doc.data().title,
      subtitle: doc.data().category,
      text: doc.data().content
    }));

    renderList(messageList, messagesSnap.docs, (doc) => ({
      title: doc.data().name,
      subtitle: doc.data().email,
      text: doc.data().text
    }));
  }

  function renderList(container, docs, mapData) {
    container.innerHTML = "";

    if (!docs.length) {
      container.innerHTML = '<div class="empty-state">No items added yet.</div>';
      return;
    }

    docs.forEach((doc) => {
      const item = mapData(doc);
      const card = document.createElement("div");
      card.className = "item-card";
      card.innerHTML = `
        <h4>${escapeHtml(item.title)}</h4>
        <p><strong>${escapeHtml(item.subtitle)}</strong></p>
        <p>${escapeHtml(item.text)}</p>
        <span class="item-meta">Saved</span>
      `;
      container.appendChild(card);
    });
  }

  function escapeHtml(value) {
    return String(value)
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      .replace(/\"/g, "&quot;")
      .replace(/'/g, "&#039;");
  }
});
