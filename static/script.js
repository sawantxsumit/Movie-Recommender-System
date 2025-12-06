document.addEventListener("DOMContentLoaded", () => {
  const movieInput = document.getElementById("movie-input");
  const numInput = document.getElementById("movie-count");
  const decrease = document.getElementById("decrease");
  const increase = document.getElementById("increase");
  const btn = document.getElementById("recommend");
  
  // The main heading
  const recoTitle = document.querySelector(".reco-title");
  
  // The grid
  const grid = document.getElementById("cards-grid");

  if (!movieInput || !numInput || !btn || !grid) {
    console.warn("Missing DOM elements.");
    return;
  }

  /* MOVIE LIST */
  const movieNames = Array.isArray(window.MOVIE_NAMES) ? window.MOVIE_NAMES : [];
  const datalist = document.getElementById("movies");

  if (datalist && movieNames.length) {
    datalist.innerHTML = "";
    movieNames.forEach((name) => {
      const opt = document.createElement("option");
      opt.value = name;
      datalist.appendChild(opt);
    });
  }

  /* No. of recommendation buttons */
  if (decrease) {
    decrease.addEventListener("click", () => {
      numInput.value = Math.max(
        Number(numInput.min || 1),
        Number(numInput.value) - 1
      );
    });
  }

  if (increase) {
    increase.addEventListener("click", () => {
      numInput.value = Math.min(
        Number(numInput.max || 10),
        Number(numInput.value) + 1
      );
    });
  }

  /* API CALL  */
  async function askRecommend() {
    const movie = (movieInput.value || movieInput.placeholder || "").trim();
    if (!movie) {
      showError("Please enter a movie name.");
      return { ok: false, status: 400, data: { error: "movie required" } };
    }

    const count = Number(numInput.value) || 5;

    try {
      const resp = await fetch("/recommend", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ movie, count }),
      });

      let payload = null;
      try {
        payload = await resp.json();
      } catch (jsonErr) {
        console.error("Failed to parse JSON response", jsonErr);
      }

      return { ok: resp.ok, status: resp.status, data: payload };
    } catch (networkErr) {
      console.error("Network/fetch error", networkErr);
      return { ok: false, status: 0, data: { error: networkErr.message } };
    }
  }

  /* MODAL ELEMENTS  */
  const modal = document.getElementById("movie-modal");
  const closeModal = document.querySelector(".close-modal");

  // Elements
  const modalImg = document.getElementById("modal-img");
  const modalTitle = document.getElementById("modal-title");
  const modalDesc = document.getElementById("modal-desc");
  const modalRating = document.getElementById("modal-rating");
  const modalDate = document.getElementById("modal-date");
  const modalRuntime = document.getElementById("modal-runtime");
  const modalGenres = document.getElementById("modal-genres");

  // Close Logic
  if (closeModal) {
    closeModal.onclick = () => { modal.style.display = "none"; };
  }
  window.onclick = (e) => {
    if (e.target === modal) { modal.style.display = "none"; }
  };

  /* RENDERING  */
  const SVG_FALLBACK =
    "data:image/svg+xml;utf8," +
    encodeURIComponent(
      `<svg xmlns="http://www.w3.org/2000/svg" width="200" height="300">
        <rect width="100%" height="100%" fill="#111827"/>
        <text x="50%" y="50%" dominant-baseline="middle"
              text-anchor="middle" fill="#6b7280" font-size="16">
          No Image
        </text>
      </svg>`
    );

  function clearGrid() {
    grid.innerHTML = "";
  }

  function showError(msg) {
    clearGrid();
    const div = document.createElement("div");
    div.className = "error";
    div.textContent = `Error: ${msg}`;
    grid.appendChild(div);
    
    // Reset title on error
    if (recoTitle) {
        recoTitle.textContent = "Error";
        recoTitle.classList.remove("pulse");
    }
  }

  function renderRecommendations(items, movieName) {
    clearGrid();

    // RESTORE TITLE STRUCTURE
    if (recoTitle) {
        recoTitle.classList.remove("pulse");
        recoTitle.innerHTML = `Recommendations for <span>${movieName}</span>`;
    }

   if (!Array.isArray(items) || items.length === 0) {
      grid.innerHTML = '<div class="empty">No recommendations found.</div>';
      return;
    }
    items.forEach((it) => {
      const card = document.createElement("div");
      card.className = "movie-card";

      // --- CLICK EVENT: OPEN MODAL ---
      card.addEventListener("click", () => {
        // 1. Fill Data
        modalTitle.textContent = it.title || "Unknown";
        modalDesc.textContent = it.overview || "No description available.";
        modalImg.src = it.poster || SVG_FALLBACK;
        
        // 2. Fill Badges 
        modalRating.textContent = `★ ${it.rating || 'N/A'}`;
        modalDate.textContent = it.date || 'N/A';
        modalRuntime.textContent = it.runtime || 'N/A';
        modalGenres.textContent = it.genres || 'Unknown Genre';

        // 3. Show Modal
        modal.style.display = "block";
      });

      const posterWrap = document.createElement("div");
      posterWrap.className = "poster-wrapper";

      const img = document.createElement("img");
      img.src = it.poster || SVG_FALLBACK;
      img.alt = it.title;
      img.loading = "lazy";
      img.onerror = () => { img.src = SVG_FALLBACK; };

      posterWrap.appendChild(img);

      const titleDiv = document.createElement("div");
      titleDiv.className = "movie-title";
      titleDiv.textContent = it.title || "Untitled";

      card.appendChild(posterWrap);
      card.appendChild(titleDiv);

      grid.appendChild(card);
    });
  }

  /*  BUTTON CLICK LOGIC  */
  btn.addEventListener("click", async () => {
    // 1. Button Loading State
    btn.disabled = true;
    btn.innerHTML = '<span class="loader"></span>'; 
    
    // 2. (REPLACES "Recommendations for...")
    if (recoTitle) {
        recoTitle.textContent = "Looking for recommendations...";
        recoTitle.classList.add("pulse");
    }

    try {
      const res = await askRecommend();

      if (res.ok) {
        renderRecommendations(
          res.data,
          (movieInput.value || movieInput.placeholder || "").trim()
        );
      } else {
        console.error("Server error", res.status, res.data);
        const msg = res.data?.Error || res.data?.error || "Server error";
        showError(msg);
      }
    } catch (e) {
      console.error("Unexpected error:", e);
      showError("Something went wrong.");
    } finally {
      // 3. Reset Button State
      btn.disabled = false;
      btn.textContent = "Recommend";
    }
  });

  movieInput.addEventListener("keydown", (ev) => {
    if (ev.key === "Enter") {
      ev.preventDefault();
      btn.click();
    }
  });

  window.askRecommend = askRecommend;
});