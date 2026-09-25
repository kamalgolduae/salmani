/**
 * DR. ABDUSSALAM SALMANI — SITE ENGINE (shared by every page)
 * Marble motivation wall, navigation drawer, reveal animations, counters,
 * practice tabs, interactive pillars, FAQ, Google Forms enquiry + WhatsApp,
 * and the vCard downloader.
 */

(function () {
  "use strict";

  const PROFILE = {
    name: "Dr. Abdussalam Salmani",
    whatsapp: "919048505850",
    email: "salmanijalal@gmail.com"
  };

  const $ = (id) => document.getElementById(id);
  const $$ = (selector, root) => (root || document).querySelectorAll(selector);
  const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  /* ==========================================================================
     1. IVORY MARBLE MOTIVATION WALL
     Engraved motivational icons and words laid out on a zig-zag lattice,
     each drifting along its own zig-zag path (see @keyframes wallZig).
     ========================================================================== */
  const WALL_ICONS = [
    // rocket
    '<path d="M4.5 16.5c-1.5 1.26-2 5-2 5s3.74-.5 5-2c.71-.84.7-2.13-.09-2.91a2.18 2.18 0 0 0-2.91-.09z"/><path d="M12 15l-3-3a22 22 0 0 1 2-3.95A12.88 12.88 0 0 1 22 2c0 2.72-.78 7.5-6 11a22.35 22.35 0 0 1-4 2z"/><path d="M9 12H4s.55-3.03 2-4c1.62-1.08 5 0 5 0"/><path d="M12 15v5s3.03-.55 4-2c1.08-1.62 0-5 0-5"/>',
    // mountain with summit flag
    '<path d="M8 3l4 8 5-5 5 15H2L8 3z"/><path d="M8 3V0.8l3 1.1-3 1.1"/>',
    // lightbulb
    '<path d="M9 18h6"/><path d="M10 22h4"/><path d="M15.09 14c.18-.98.65-1.74 1.41-2.5A4.65 4.65 0 0 0 18 8 6 6 0 0 0 6 8c0 1 .23 2.23 1.5 3.5A4.61 4.61 0 0 1 8.91 14"/>',
    // target
    '<circle cx="12" cy="12" r="10"/><circle cx="12" cy="12" r="6"/><circle cx="12" cy="12" r="2"/>',
    // star
    '<path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/>',
    // trophy
    '<path d="M6 9H4.5a2.5 2.5 0 0 1 0-5H6"/><path d="M18 9h1.5a2.5 2.5 0 0 0 0-5H18"/><path d="M4 22h16"/><path d="M10 14.66V17c0 .55-.47.98-.97 1.21C7.85 18.75 7 20.24 7 22"/><path d="M14 14.66V17c0 .55.47.98.97 1.21C16.15 18.75 17 20.24 17 22"/><path d="M18 2H6v7a6 6 0 0 0 12 0V2Z"/>',
    // heart
    '<path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78L12 21.23l8.84-8.84a5.5 5.5 0 0 0 0-7.78z"/>',
    // compass
    '<circle cx="12" cy="12" r="10"/><polygon points="16.24 7.76 14.12 14.12 7.76 16.24 9.88 9.88 16.24 7.76"/>',
    // open book
    '<path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z"/><path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z"/>',
    // brain
    '<path d="M9.5 2A2.5 2.5 0 0 1 12 4.5v15a2.5 2.5 0 0 1-4.96.44 2.5 2.5 0 0 1-2.96-3.08 3 3 0 0 1-.34-5.58 2.5 2.5 0 0 1 1.32-4.24 2.5 2.5 0 0 1 4.44-2.04z"/><path d="M14.5 2A2.5 2.5 0 0 0 12 4.5v15a2.5 2.5 0 0 0 4.96.44 2.5 2.5 0 0 0 2.96-3.08 3 3 0 0 0 .34-5.58 2.5 2.5 0 0 0-1.32-4.24 2.5 2.5 0 0 0-4.44-2.04z"/>',
    // sprout
    '<path d="M7 20h10"/><path d="M10 20c5.5-2.5.8-6.4 3-10"/><path d="M9.5 9.4c1.1.8 1.8 2.2 2.3 3.7-2 .4-3.5.4-4.8-.3-1.2-.6-2.3-1.9-3-4.2 2.8-.5 4.4 0 5.5.8z"/><path d="M14.1 6a7 7 0 0 0-1.1 4c1.9-.1 3.3-.6 4.3-1.4 1-1 1.6-2.3 1.7-4.6-2.7.1-4 1-4.9 2z"/>',
    // sun
    '<circle cx="12" cy="12" r="4"/><path d="M12 2v2M12 20v2M4.93 4.93l1.41 1.41M17.66 17.66l1.41 1.41M2 12h2M20 12h2M6.34 17.66l-1.41 1.41M19.07 4.93l-1.41 1.41"/>',
    // trending up
    '<path d="M23 6l-9.5 9.5-5-5L1 18"/><path d="M17 6h6v6"/>',
    // graduation cap
    '<path d="M22 10v6"/><path d="M2 10l10-5 10 5-10 5z"/><path d="M6 12v5c3 3 9 3 12 0v-5"/>',
    // key
    '<circle cx="7.5" cy="15.5" r="5.5"/><path d="M11.4 11.6L21 2"/><path d="M15.5 7.5l3 3L22 7l-3-3"/>',
    // steps upward
    '<path d="M3 21h4v-4h4v-4h4V9h4V5h3"/><path d="M17 2l3 3-3 3"/>',
    // feather pen
    '<path d="M20.24 12.24a6 6 0 0 0-8.49-8.49L5 10.5V19h8.5z"/><path d="M16 8L2 22"/><path d="M17.5 15H9"/>',
    // speech bubble
    '<path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z"/>',
    // medal
    '<circle cx="12" cy="8" r="7"/><polyline points="8.21 13.89 7 23 12 20 17 23 15.79 13.88"/>',
    // puzzle
    '<path d="M19.44 7.85c-.05.32.06.65.29.88l1.57 1.57c.94.94.94 2.47 0 3.41l-1.61 1.61a.98.98 0 0 1-.84.28c-.47-.07-.8-.48-.97-.93a2.5 2.5 0 1 0-3.21 3.21c.45.17.86.5.93.97a.98.98 0 0 1-.28.84l-1.61 1.61a2.41 2.41 0 0 1-3.41 0l-1.57-1.57a1.03 1.03 0 0 0-.88-.29c-.49.07-.84.5-1.02.97a2.5 2.5 0 1 1-3.24-3.24c.46-.18.89-.53.97-1.02a1.03 1.03 0 0 0-.29-.88L2.7 13.7a2.41 2.41 0 0 1 0-3.41L4.23 8.77c.24-.24.58-.35.92-.3.52.08.88.53 1.07 1.01a2.5 2.5 0 1 0 3.26-3.26c-.48-.2-.93-.56-1.01-1.07-.05-.34.06-.68.3-.92L10.3 2.7a2.41 2.41 0 0 1 3.41 0l1.57 1.57c.23.23.56.34.88.29.49-.07.84-.5 1.02-.97a2.5 2.5 0 1 1 3.24 3.24c-.46.18-.89.53-.97 1.02z"/>'
  ];

  const WALL_WORDS = [
    "Believe", "Grow", "Rise", "Dream", "Focus", "Hope", "Courage", "Learn",
    "Balance", "Inspire", "Persevere", "Listen", "Patience", "Gratitude", "You can"
  ];

  // Small seeded PRNG so the wall looks the same on every visit
  function mulberry32(seed) {
    return function () {
      seed |= 0;
      seed = (seed + 0x6d2b79f5) | 0;
      let t = Math.imul(seed ^ (seed >>> 15), 1 | seed);
      t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
      return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
    };
  }

  function buildWall() {
    const field = $("wall-field");
    if (!field) return;

    const w = field.offsetWidth;
    const h = field.offsetHeight;
    const compact = window.innerWidth < 720;
    const cellW = compact ? 118 : 172;
    const cellH = compact ? 112 : 138;
    const cols = Math.ceil(w / cellW) + 1;
    const rows = Math.ceil(h / cellH) + 1;
    const rand = mulberry32(20260925);
    const between = (a, b) => a + (b - a) * rand();
    const frag = document.createDocumentFragment();

    for (let r = 0; r < rows; r++) {
      for (let c = 0; c < cols; c++) {
        // zig-zag lattice: alternate rows shift half a cell, alternate columns step up/down
        const x = c * cellW + (r % 2 ? cellW / 2 : 0) + between(-18, 18);
        const y = r * cellH + (c % 2 ? cellH * 0.32 : -cellH * 0.08) + between(-10, 10);
        const isWord = rand() < 0.17;
        const el = document.createElement("span");
        el.className = "wall-item" + (isWord ? " wall-word" : "");

        if (isWord) {
          el.textContent = WALL_WORDS[Math.floor(rand() * WALL_WORDS.length)];
          el.style.setProperty("--s", Math.round(between(compact ? 14 : 17, compact ? 20 : 27)) + "px");
          el.style.setProperty("--o", between(0.2, 0.3).toFixed(2));
        } else {
          const icon = WALL_ICONS[Math.floor(rand() * WALL_ICONS.length)];
          el.innerHTML = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.35" stroke-linecap="round" stroke-linejoin="round">' + icon + "</svg>";
          el.style.setProperty("--s", Math.round(between(compact ? 22 : 26, compact ? 32 : 44)) + "px");
          el.style.setProperty("--o", between(0.18, 0.3).toFixed(2));
        }

        const dir = rand() < 0.5 ? -1 : 1;
        el.style.left = x.toFixed(0) + "px";
        el.style.top = y.toFixed(0) + "px";
        el.style.setProperty("--dx", (dir * between(10, 24)).toFixed(1) + "px");
        el.style.setProperty("--dy", between(5, 11).toFixed(1) + "px");
        el.style.setProperty("--r", between(-14, 14).toFixed(1) + "deg");
        el.style.setProperty("--dur", between(9, 18).toFixed(1) + "s");
        el.style.setProperty("--delay", (-between(0, 18)).toFixed(1) + "s");
        frag.appendChild(el);
      }
    }

    field.replaceChildren(frag);
  }

  buildWall();
  let wallWidth = window.innerWidth;
  let wallTimer;
  window.addEventListener("resize", () => {
    clearTimeout(wallTimer);
    wallTimer = setTimeout(() => {
      // ignore mobile address-bar height changes; rebuild on real width changes
      if (Math.abs(window.innerWidth - wallWidth) > 60) {
        wallWidth = window.innerWidth;
        buildWall();
      }
    }, 250);
  });

  /* ==========================================================================
     2. MOBILE NAVIGATION DRAWER
     ========================================================================== */
  const mobileMenuBtn = $("mobile-menu-btn");
  const mobileDrawer = $("mobile-nav-drawer");
  const drawerCloseBtn = $("drawer-close-btn");

  function openDrawer() {
    if (!mobileDrawer) return;
    mobileDrawer.classList.add("open");
    document.body.style.overflow = "hidden";
    if (mobileMenuBtn) mobileMenuBtn.setAttribute("aria-expanded", "true");
    if (drawerCloseBtn) drawerCloseBtn.focus();
  }

  function closeDrawer() {
    if (!mobileDrawer) return;
    mobileDrawer.classList.remove("open");
    document.body.style.overflow = "";
    if (mobileMenuBtn) mobileMenuBtn.setAttribute("aria-expanded", "false");
  }

  if (mobileMenuBtn) mobileMenuBtn.addEventListener("click", openDrawer);
  if (drawerCloseBtn) drawerCloseBtn.addEventListener("click", closeDrawer);
  $$(".drawer-link").forEach((link) => link.addEventListener("click", closeDrawer));
  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape" && mobileDrawer && mobileDrawer.classList.contains("open")) closeDrawer();
  });

  /* ==========================================================================
     3. STICKY HEADER & JOURNEY TIMELINE PROGRESS
     ========================================================================== */
  const headerBar = $("header-bar");
  const journeySec = $("journey");
  const timelineFill = $("timeline-progress-fill");
  const timelineCards = $$(".timeline-card");

  function handleScroll() {
    if (headerBar) headerBar.classList.toggle("scrolled", window.scrollY > 60);

    if (journeySec && timelineFill) {
      const rect = journeySec.getBoundingClientRect();
      const vh = window.innerHeight;
      const progress = Math.min(Math.max((vh * 0.8 - rect.top) / (rect.height * 0.7), 0), 1);
      timelineFill.style.width = `${(progress * 100).toFixed(1)}%`;
      timelineCards.forEach((card, idx) => {
        card.classList.toggle("active", progress > (idx + 0.3) / timelineCards.length);
      });
    }
  }

  window.addEventListener("scroll", handleScroll, { passive: true });
  window.addEventListener("resize", handleScroll);

  /* ==========================================================================
     4. REVEAL ANIMATIONS
     ========================================================================== */
  const reveals = $$(".rv");
  if ("IntersectionObserver" in window && !reduceMotion) {
    const observer = new IntersectionObserver(
      (entries, obs) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("in");
            obs.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.12, rootMargin: "0px 0px -40px 0px" }
    );
    reveals.forEach((el) => observer.observe(el));
    requestAnimationFrame(() => {
      $$(".hero .rv, .page-hero .rv").forEach((el) => el.classList.add("in"));
    });
  } else {
    reveals.forEach((el) => el.classList.add("in"));
  }

  /* ==========================================================================
     5. STAT COUNTERS
     ========================================================================== */
  const statNumbers = $$(".stat-val");
  if ("IntersectionObserver" in window && statNumbers.length > 0 && !reduceMotion) {
    const statObserver = new IntersectionObserver(
      (entries, obs) => {
        entries.forEach((entry) => {
          if (!entry.isIntersecting) return;
          obs.unobserve(entry.target);
          const target = entry.target;
          const rawVal = target.getAttribute("data-val") || "";
          const match = rawVal.match(/^(\d+)(\D*)$/);
          if (!match) return;

          const end = parseInt(match[1], 10);
          const suffix = match[2];
          const duration = 1400;
          let startTime = null;

          function step(timestamp) {
            if (!startTime) startTime = timestamp;
            const progress = Math.min((timestamp - startTime) / duration, 1);
            const eased = 1 - Math.pow(1 - progress, 3);
            target.textContent = Math.round(end * eased) + suffix;
            if (progress < 1) requestAnimationFrame(step);
            else target.textContent = rawVal;
          }
          requestAnimationFrame(step);
        });
      },
      { threshold: 0.5 }
    );
    statNumbers.forEach((num) => statObserver.observe(num));
  }

  /* ==========================================================================
     6. PRACTICE FILTER TABS (BSS Clinical vs Escola Training)
     ========================================================================== */
  const tabBtns = $$(".tab-btn");
  const practiceBlocks = $$(".practice-block");

  tabBtns.forEach((btn) => {
    btn.addEventListener("click", () => {
      tabBtns.forEach((b) => b.classList.remove("active"));
      btn.classList.add("active");
      const filter = btn.getAttribute("data-filter");
      practiceBlocks.forEach((block) => {
        const show = filter === "all" || block.id === filter;
        block.style.display = show ? "block" : "none";
        if (show) block.querySelectorAll(".rv").forEach((r) => r.classList.add("in"));
      });
    });
  });

  /* ==========================================================================
     7. INTERACTIVE PILLARS (Expertise page)
     ========================================================================== */
  const pillarCols = $$(".pillar-col");

  function activatePillar(col) {
    pillarCols.forEach((c) => {
      const on = c === col;
      c.classList.toggle("active", on);
      const tab = c.querySelector(".pillar-tab");
      if (tab) tab.setAttribute("aria-expanded", on ? "true" : "false");
    });
  }

  pillarCols.forEach((col) => {
    const tab = col.querySelector(".pillar-tab");
    if (!tab) return;
    tab.addEventListener("click", () => activatePillar(col));
    col.addEventListener("mouseenter", () => {
      if (window.matchMedia("(hover: hover) and (min-width: 1025px)").matches) activatePillar(col);
    });
  });

  function pillarFromHash() {
    const id = decodeURIComponent(location.hash.slice(1));
    const col = id && document.getElementById(id);
    if (col && col.classList.contains("pillar-col")) {
      activatePillar(col);
      const stage = $("pillar-stage");
      if (stage) stage.scrollIntoView({ behavior: reduceMotion ? "auto" : "smooth", block: "start" });
    }
  }
  if (pillarCols.length) {
    pillarFromHash();
    window.addEventListener("hashchange", pillarFromHash);
  }

  /* ==========================================================================
     8. FAQ ACCORDION
     ========================================================================== */
  const faqItems = $$(".faq-item");
  faqItems.forEach((item) => {
    const questionBtn = item.querySelector(".faq-question");
    const answer = item.querySelector(".faq-answer");
    if (!questionBtn || !answer) return;

    questionBtn.setAttribute("aria-expanded", "false");
    questionBtn.addEventListener("click", () => {
      const isOpen = item.classList.contains("active");
      faqItems.forEach((other) => {
        other.classList.remove("active");
        const otherAnswer = other.querySelector(".faq-answer");
        const otherBtn = other.querySelector(".faq-question");
        if (otherAnswer) otherAnswer.style.maxHeight = null;
        if (otherBtn) otherBtn.setAttribute("aria-expanded", "false");
      });
      if (!isOpen) {
        item.classList.add("active");
        answer.style.maxHeight = answer.scrollHeight + 40 + "px";
        questionBtn.setAttribute("aria-expanded", "true");
      }
    });
  });

  /* ==========================================================================
     9. ENQUIRY FORM (Google Forms + WhatsApp)
     ========================================================================== */
  const fName = $("f-name");
  const fPhone = $("f-phone");
  const fService = $("f-service");
  const fMode = $("f-mode");
  const fTime = $("f-time");
  const fMessage = $("f-message");
  const btnSendWa = $("btn-send-wa");
  const consultationForm = $("consultation-form");
  const gformIframe = $("hidden-gform-iframe");

  function showToast(message) {
    const toast = document.createElement("div");
    toast.setAttribute("role", "status");
    toast.setAttribute("aria-live", "polite");
    toast.style.cssText = [
      "position:fixed", "bottom:5rem", "left:50%", "transform:translateX(-50%)",
      "background:#1C6B63", "color:#fff", "font-weight:700",
      "padding:1rem 2rem", "border-radius:0.75rem", "box-shadow:0 8px 32px rgba(0,0,0,.2)",
      "z-index:9999", "font-size:1rem", "text-align:center", "max-width:90vw",
      "opacity:0", "transition:opacity .4s ease"
    ].join(";");
    toast.textContent = message;
    document.body.appendChild(toast);
    requestAnimationFrame(() => { toast.style.opacity = "1"; });
    setTimeout(() => {
      toast.style.opacity = "0";
      setTimeout(() => toast.remove(), 500);
    }, 5000);
  }

  let gformSubmitted = false;
  if (gformIframe) {
    gformIframe.addEventListener("load", () => {
      if (!gformSubmitted) return;
      showToast("Enquiry submitted. Dr. Salmani's office will contact you shortly.");
      if (consultationForm) consultationForm.reset();
      gformSubmitted = false;
    });
  }
  if (consultationForm) {
    consultationForm.addEventListener("submit", () => { gformSubmitted = true; });
  }

  function composeEnquiryText() {
    const val = (el, fallback) => (el && el.value.trim()) || fallback;
    const message = val(fMessage, "");
    return (
      `*Consultation Enquiry for Dr. Abdussalam Salmani*\n` +
      `----------------------------------------\n` +
      `• *Name:* ${val(fName, "Not specified")}\n` +
      `• *Phone:* ${val(fPhone, "Not specified")}\n` +
      `• *Service:* ${val(fService, "General Consultation")}\n` +
      `• *Preferred Mode:* ${val(fMode, "In-Person (Kondotty Clinic)")}\n` +
      `• *Preferred Slot:* ${val(fTime, "Any suitable time")}\n` +
      (message ? `• *Details:* ${message}\n` : "") +
      `----------------------------------------\n` +
      `_Sent via salmani.vercel.app_`
    );
  }

  if (btnSendWa) {
    btnSendWa.addEventListener("click", () => {
      const url = `https://wa.me/${PROFILE.whatsapp}?text=${encodeURIComponent(composeEnquiryText())}`;
      window.open(url, "_blank", "noopener,noreferrer");
    });
  }

  // Pre-select the service when arriving from a "?service=" link
  const requestedService = new URLSearchParams(location.search).get("service");
  if (requestedService && fService) {
    const words = requestedService.toLowerCase().split(/[^a-z]+/).filter((w) => w.length > 3);
    let best = -1;
    let bestScore = 0;
    Array.from(fService.options).forEach((opt, i) => {
      const text = opt.text.toLowerCase();
      const score = words.filter((w) => text.includes(w)).length;
      if (score > bestScore) { best = i; bestScore = score; }
    });
    if (best >= 0) fService.selectedIndex = best;
  }

  /* ==========================================================================
     10. vCARD DOWNLOADER (.vcf)
     ========================================================================== */
  const vcardBtn = $("btn-vcard-download");
  if (vcardBtn) {
    vcardBtn.addEventListener("click", (e) => {
      e.preventDefault();
      const vcardData = [
        "BEGIN:VCARD",
        "VERSION:3.0",
        "N:Salmani;Abdussalam;Dr.;;",
        "FN:Dr. Abdussalam Salmani",
        "ORG:BSS Skill School & Counseling Centre;Escola International",
        "TITLE:Consultant Psychologist & International Trainer",
        "TEL;TYPE=CELL,VOICE:+919048505850",
        "TEL;TYPE=WORK,VOICE:+919074574246",
        "EMAIL;TYPE=PREF,INTERNET:salmanijalal@gmail.com",
        "ADR;TYPE=WORK:;;Tower 17, EC Mall, ICA Campus;Kondotty;Kerala;673638;India",
        "NOTE:PhD in Psychology. Educational Psychologist, Family Counsellor, NLP Practitioner, JCI Senator.",
        "END:VCARD"
      ].join("\r\n");

      const blob = new Blob([vcardData], { type: "text/vcard;charset=utf-8" });
      const link = document.createElement("a");
      link.href = URL.createObjectURL(blob);
      link.download = "Dr_Abdussalam_Salmani.vcf";
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(link.href);
    });
  }

  handleScroll();
})();
