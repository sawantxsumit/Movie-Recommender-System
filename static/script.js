document.addEventListener("DOMContentLoaded", () => {
  const movieInput = document.getElementById("movie-input");
  const numInput = document.getElementById("movie-count");
  const decrease = document.getElementById("decrease");
  const increase = document.getElementById("increase");
  const btn = document.getElementById("recommend");

  // header span + grid container
  const recoTitleSpan = document.querySelector(".reco-title span");
  const grid = document.getElementById("cards-grid");

  if (!movieInput || !numInput || !btn || !grid) {
    console.warn("Missing DOM elements.");
    return;
  }

  /* -------------------- MOVIE LIST / DATALIST -------------------- */

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

  /* -------------------- COUNTER BUTTONS -------------------- */

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

  /* -------------------- API CALL -------------------- */

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

  /* -------------------- RENDERING -------------------- */

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
  }

  function renderRecommendations(items, movieName) {
    clearGrid();

    if (recoTitleSpan && movieName) {
      recoTitleSpan.textContent = movieName;
    }

    if (!Array.isArray(items) || items.length === 0) {
      const empty = document.createElement("div");
      empty.className = "empty";
      empty.textContent = "No recommendations found.";
      grid.appendChild(empty);
      return;
    }

    items.forEach((it) => {
      const card = document.createElement("div");
      card.className = "movie-card";

      const posterWrap = document.createElement("div");
      posterWrap.className = "poster-wrapper";

      const img = document.createElement("img");
      img.src = it.poster || SVG_FALLBACK;
      img.alt = it.title || "Poster";
      img.loading = "lazy";
      img.onerror = () => {
        img.onerror = null;
        img.src = SVG_FALLBACK;
      };

      posterWrap.appendChild(img);

      const titleDiv = document.createElement("div");
      titleDiv.className = "movie-title";
      titleDiv.textContent = it.title || "Untitled";

      card.appendChild(posterWrap);
      card.appendChild(titleDiv);

      grid.appendChild(card);
    });
  }

  /* -------------------- BUTTON + ENTER KEY -------------------- */

  btn.addEventListener("click", async () => {
    const prevText = btn.textContent;
    btn.disabled = true;
    btn.textContent = "Loading...";

    const res = await askRecommend();

    if (res.ok) {
      renderRecommendations(
        res.data,
        (movieInput.value || movieInput.placeholder || "").trim()
      );
    } else {
      console.error("Server error", res.status, res.data);
      const msg =
        res.data?.Error || res.data?.error || "Server error"; // handle both keys
      showError(msg);
    }

    btn.disabled = false;
    btn.textContent = prevText;
  });

  movieInput.addEventListener("keydown", (ev) => {
    if (ev.key === "Enter") {
      ev.preventDefault();
      btn.click();
    }
  });

  // optional: expose for console testing
  window.askRecommend = askRecommend;
  window.renderRecommendations = renderRecommendations;
});
