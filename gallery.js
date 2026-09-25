/**
 * TRAINING & WORK GALLERY
 * Renders window.GALLERY_ITEMS (assets/gallery/gallery-data.js) into:
 *   #gallery-grid     — full editorial masonry with filters (gallery.html)
 *   #gallery-preview  — short homepage selection
 *   [data-category]   — a preview limited to one category (e.g. certificates)
 * and opens every image in a shared, keyboard- and swipe-friendly lightbox.
 */

(function () {
  "use strict";

  // featured images lead; otherwise keep the data file's order
  const ITEMS = (Array.isArray(window.GALLERY_ITEMS) ? window.GALLERY_ITEMS : [])
    .map((it, i) => [it, i])
    .sort((a, b) => (b[0].featured ? 1 : 0) - (a[0].featured ? 1 : 0) || a[1] - b[1])
    .map(([it]) => it);
  const LABELS = {
    training: "Training & Work",
    banners: "Banners & Posters",
    certificates: "Certificates"
  };
  const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  const $ = (id) => document.getElementById(id);

  const labelFor = (item) => LABELS[item.category] || item.category;
  const altFor = (item, i) => item.alt || item.title || `${labelFor(item)} — photograph ${i + 1}`;
  const ratio = (item) => (item.width && item.height ? item.width / item.height : 4 / 3);

  function srcset(item, format) {
    return (item.widths || []).map((w) => `${item.base}-${w}.${format} ${w}w`).join(", ");
  }

  function pictureHTML(item, index, sizes, eager) {
    const sources = (item.formats || [])
      .map((f) => `<source type="image/${f}" srcset="${srcset(item, f)}" sizes="${sizes}">`)
      .join("");
    const loading = eager ? 'loading="eager"' + (index === 0 ? ' fetchpriority="high"' : "") : 'loading="lazy"';
    return (
      `<picture>${sources}<img src="${item.fallback}" alt="${escapeAttr(altFor(item, index))}"` +
      ` width="${item.width || 1200}" height="${item.height || 900}" ${loading} decoding="async"></picture>`
    );
  }

  function escapeAttr(s) {
    return String(s).replace(/&/g, "&amp;").replace(/"/g, "&quot;").replace(/</g, "&lt;");
  }

  function escapeHTML(s) {
    return String(s).replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
  }

  function figureHTML(item, index, sizes, eager, extraClass) {
    const cls = ["g-item"];
    if (item.category === "banners" || item.category === "certificates") cls.push("is-poster");
    if (extraClass) cls.push(extraClass);
    const caption = item.title || labelFor(item);
    return (
      `<figure class="${cls.join(" ")}" data-index="${index}">` +
      `<button type="button" aria-label="Open image: ${escapeAttr(altFor(item, index))}">` +
      pictureHTML(item, index, sizes, eager) +
      `</button>` +
      `<figcaption class="g-caption"><span class="g-cat">${escapeHTML(labelFor(item))}</span>` +
      (item.title ? escapeHTML(caption) : "") +
      `</figcaption></figure>`
    );
  }

  function emptyHTML(count, note) {
    let tiles = "";
    for (let i = 0; i < count; i++) {
      tiles += '<div class="ph"><svg viewBox="0 0 24 24"><use href="#i-image"/></svg></div>';
    }
    return `<div class="gallery-empty" aria-hidden="true">${tiles}</div><p class="gallery-empty-note">${note}</p>`;
  }

  function revealAll(root) {
    const figs = root.querySelectorAll(".g-item");
    if (reduceMotion || !("IntersectionObserver" in window)) {
      figs.forEach((f) => f.classList.add("in"));
      return;
    }
    const io = new IntersectionObserver((entries, obs) => {
      entries.forEach((e) => {
        if (e.isIntersecting) {
          e.target.classList.add("in");
          obs.unobserve(e.target);
        }
      });
    }, { rootMargin: "0px 0px -30px 0px", threshold: 0.05 });
    figs.forEach((f, i) => {
      f.style.transitionDelay = `${Math.min(i % 8, 6) * 45}ms`;
      io.observe(f);
    });
  }

  /* ---------------- Lightbox ---------------- */
  const Lightbox = (function () {
    let list = [];
    let index = 0;
    let lastFocus = null;
    let el, img, capCat, capTitle, capDesc, counter, closeBtn, prevBtn, nextBtn;

    function build() {
      el = document.createElement("div");
      el.className = "lightbox";
      el.setAttribute("role", "dialog");
      el.setAttribute("aria-modal", "true");
      el.setAttribute("aria-label", "Image viewer");
      el.innerHTML =
        '<div class="lb-top"><span class="lb-counter" aria-live="polite"></span>' +
        '<button type="button" class="lb-btn lb-close" aria-label="Close viewer"><svg viewBox="0 0 24 24"><use href="#i-close"/></svg></button></div>' +
        '<div class="lb-stage">' +
        '<button type="button" class="lb-btn lb-prev" aria-label="Previous image"><svg viewBox="0 0 24 24"><use href="#i-arrow"/></svg></button>' +
        '<img alt="">' +
        '<button type="button" class="lb-btn lb-next" aria-label="Next image"><svg viewBox="0 0 24 24"><use href="#i-arrow"/></svg></button>' +
        "</div>" +
        '<div class="lb-caption"><span class="lb-cat"></span><h3></h3><p></p></div>';
      document.body.appendChild(el);

      img = el.querySelector(".lb-stage img");
      capCat = el.querySelector(".lb-cat");
      capTitle = el.querySelector(".lb-caption h3");
      capDesc = el.querySelector(".lb-caption p");
      counter = el.querySelector(".lb-counter");
      closeBtn = el.querySelector(".lb-close");
      prevBtn = el.querySelector(".lb-prev");
      nextBtn = el.querySelector(".lb-next");

      closeBtn.addEventListener("click", close);
      prevBtn.addEventListener("click", () => go(-1));
      nextBtn.addEventListener("click", () => go(1));

      // click on the dark backdrop (not the image or buttons) closes
      el.querySelector(".lb-stage").addEventListener("click", (e) => {
        if (e.target === e.currentTarget) close();
      });

      el.addEventListener("keydown", (e) => {
        if (e.key === "Escape") close();
        else if (e.key === "ArrowLeft") go(-1);
        else if (e.key === "ArrowRight") go(1);
        else if (e.key === "Tab") {
          const focusables = [closeBtn, prevBtn, nextBtn].filter((b) => !b.hidden);
          const first = focusables[0];
          const last = focusables[focusables.length - 1];
          if (e.shiftKey && document.activeElement === first) { e.preventDefault(); last.focus(); }
          else if (!e.shiftKey && document.activeElement === last) { e.preventDefault(); first.focus(); }
        }
      });

      // swipe navigation
      let startX = null;
      let startY = null;
      const stage = el.querySelector(".lb-stage");
      stage.addEventListener("pointerdown", (e) => { startX = e.clientX; startY = e.clientY; });
      stage.addEventListener("pointerup", (e) => {
        if (startX === null) return;
        const dx = e.clientX - startX;
        const dy = e.clientY - startY;
        startX = null;
        if (Math.abs(dx) > 50 && Math.abs(dx) > Math.abs(dy)) go(dx < 0 ? 1 : -1);
        else if (dy > 90 && Math.abs(dy) > Math.abs(dx)) close();
      });
    }

    function largest(item) {
      const w = (item.widths || []).slice(-1)[0];
      const f = (item.formats || []).includes("webp") ? "webp" : null;
      return w && f ? `${item.base}-${w}.${f}` : item.fallback;
    }

    function show() {
      const item = list[index];
      const apply = () => {
        img.src = largest(item);
        img.alt = altFor(item, index);
        img.classList.remove("swapping");
      };
      if (reduceMotion || !img.src) apply();
      else {
        img.classList.add("swapping");
        setTimeout(apply, 160);
      }
      capCat.textContent = labelFor(item) + (item.date ? " · " + item.date : "");
      capTitle.textContent = item.title || "";
      capTitle.hidden = !item.title;
      capDesc.textContent = item.description || "";
      capDesc.hidden = !item.description;
      counter.textContent = `${index + 1} / ${list.length}`;
      prevBtn.hidden = nextBtn.hidden = list.length < 2;

      // warm the neighbours
      [1, -1].forEach((d) => {
        const n = list[(index + d + list.length) % list.length];
        if (n) new Image().src = largest(n);
      });
    }

    function go(delta) {
      if (list.length < 2) return;
      index = (index + delta + list.length) % list.length;
      show();
    }

    function open(items, i) {
      if (!el) build();
      list = items;
      index = i;
      lastFocus = document.activeElement;
      img.removeAttribute("src");
      show();
      el.classList.add("open");
      document.body.classList.add("lb-lock");
      closeBtn.focus();
    }

    function close() {
      if (!el) return;
      el.classList.remove("open");
      document.body.classList.remove("lb-lock");
      if (lastFocus) lastFocus.focus();
    }

    return { open };
  })();

  /* ---------------- Full gallery page ---------------- */
  function initFullGallery() {
    const grid = $("gallery-grid");
    const bar = $("gallery-filters");
    if (!grid) return;

    if (!ITEMS.length) {
      grid.classList.remove("gallery-grid");
      grid.innerHTML = emptyHTML(5, "Photographs from training sessions, workshops and events are being curated and will appear here soon.");
      if (bar) bar.hidden = true;
      return;
    }

    // Filters: All + each category present + any tags used in the data
    const filters = [{ key: "all", label: "All", test: () => true }];
    Object.keys(LABELS).forEach((cat) => {
      if (ITEMS.some((it) => it.category === cat)) {
        filters.push({ key: cat, label: LABELS[cat], test: (it) => it.category === cat });
      }
    });
    const tags = [...new Set(ITEMS.flatMap((it) => it.tags || []))];
    tags.forEach((tag) => filters.push({ key: "tag-" + tag, label: tag, test: (it) => (it.tags || []).includes(tag) }));

    if (bar) {
      bar.innerHTML = filters
        .map((f) => {
          const n = ITEMS.filter(f.test).length;
          return `<button type="button" class="gallery-filter" data-key="${escapeAttr(f.key)}" aria-pressed="false">${escapeHTML(f.label)} <span class="count">${n}</span></button>`;
        })
        .join("");
      bar.hidden = filters.length < 3;
    }

    const sizes = "(max-width: 420px) 100vw, (max-width: 720px) 50vw, (max-width: 1024px) 34vw, 26vw";
    const sizesWide = "(max-width: 420px) 100vw, (max-width: 1024px) 67vw, 52vw";
    let current = [];

    function render(key) {
      const f = filters.find((x) => x.key === key) || filters[0];
      current = ITEMS.filter(f.test);
      grid.innerHTML = current
        .map((it, i) => {
          const wide = it.featured || ratio(it) > 1.75;
          const extra = it.featured ? "is-featured" : wide ? "is-wide" : "";
          return figureHTML(it, i, wide ? sizesWide : sizes, i < 4, extra);
        })
        .join("");
      if (bar) {
        bar.querySelectorAll(".gallery-filter").forEach((b) => b.setAttribute("aria-pressed", String(b.dataset.key === f.key)));
      }
      layout();
      revealAll(grid);
    }

    // masonry: each figure spans enough 8px rows to keep its true aspect ratio
    function layout() {
      const style = getComputedStyle(grid);
      const cols = style.gridTemplateColumns.split(" ").length;
      const gap = parseFloat(style.columnGap) || 14;
      const row = parseFloat(style.gridAutoRows) || 8;
      const colW = (grid.clientWidth - gap * (cols - 1)) / cols;
      grid.querySelectorAll(".g-item").forEach((fig) => {
        const item = current[Number(fig.dataset.index)];
        const doubled = fig.classList.contains("is-featured") || fig.classList.contains("is-wide");
        const span = Math.min(cols, doubled ? 2 : 1);
        const w = colW * span + gap * (span - 1);
        const h = w / ratio(item);
        fig.style.gridRowEnd = `span ${Math.ceil((h + gap) / row)}`;
      });
    }

    let t;
    window.addEventListener("resize", () => {
      clearTimeout(t);
      t = setTimeout(layout, 120);
    });

    if (bar) {
      bar.addEventListener("click", (e) => {
        const b = e.target.closest(".gallery-filter");
        if (!b) return;
        history.replaceState(null, "", b.dataset.key === "all" ? location.pathname : "#" + b.dataset.key);
        render(b.dataset.key);
      });
    }

    // reads `current` at click time so it always matches the active filter
    grid.addEventListener("click", (e) => {
      const fig = e.target.closest(".g-item");
      if (fig) Lightbox.open(current, Number(fig.dataset.index));
    });

    render(location.hash.slice(1) || "all");
  }

  /* ---------------- Previews (homepage, achievements) ---------------- */
  function initPreview(root) {
    const limit = Number(root.dataset.limit) || 5;
    const cat = root.dataset.category;
    let items;
    if (cat) {
      items = ITEMS.filter((it) => it.category === cat);
    } else {
      const picked = ITEMS.filter((it) => it.homepage);
      items = (picked.length ? picked : ITEMS.filter((it) => it.category !== "certificates"));
    }
    items = items.slice(0, limit);

    if (!items.length) {
      root.classList.remove("gallery-preview");
      root.innerHTML = emptyHTML(cat ? 3 : 5, cat ? "Certificates will be added here once verified." : "Photographs from training sessions and events will appear here soon.");
      return;
    }

    const sizes = "(max-width: 720px) 50vw, 34vw";
    root.innerHTML = items.map((it, i) => figureHTML(it, i, i === 0 ? "(max-width: 720px) 100vw, 50vw" : sizes, false, "")).join("");
    // the preview crops into fixed editorial frames; posters keep "contain" so text is never cut
    revealAll(root);
    root.addEventListener("click", (e) => {
      const fig = e.target.closest(".g-item");
      if (fig) Lightbox.open(items, Number(fig.dataset.index));
    });
  }

  initFullGallery();
  document.querySelectorAll("#gallery-preview, .gallery-preview[data-category]").forEach(initPreview);
})();
