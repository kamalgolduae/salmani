/**
 * DR. ABDUSSALAM SALMANI — HIGH-END LUXURY WEBSITE ENGINE
 * Complete interactive logic: Booking router, WhatsApp generator,
 * vCard downloader, theme switcher, tabs, counters, and animations.
 */

(function () {
  "use strict";

  // Core Practitioner Profile Data
  const PROFILE = {
    name: "Dr. Abdussalam Salmani",
    degrees: "PhD (Psychology), MSc (Psychology), MBA (HRM), MA & BEd (Arabic)",
    title: "Consultant Psychologist, Educational Psychologist & Family Counsellor",
    phones: ["+91 90485 05850", "+91 90745 74246"],
    whatsapp: "919048505850",
    email: "salmanijalal@gmail.com",
    clinic: "BSS Skill School & Counseling Centre",
    address: "Tower 17, EC Mall, ICA Campus, Calicut International City, Kondotty, Kerala, India - 673638"
  };

  // Utility selectors
  const $ = (id) => document.getElementById(id);
  const $$ = (selector) => document.querySelectorAll(selector);

  /* ==========================================================================
     1. PERMANENT LUXURY OBSIDIAN VELVET THEME
     ========================================================================== */
  document.documentElement.setAttribute("data-theme", "dark");
  localStorage.setItem("salmani_theme", "dark");

  /* ==========================================================================
     2. MOBILE NAVIGATION DRAWER
     ========================================================================== */
  const mobileMenuBtn = $("mobile-menu-btn");
  const mobileDrawer = $("mobile-nav-drawer");
  const drawerCloseBtn = $("drawer-close-btn");
  const drawerLinks = $$(".drawer-link");

  function openDrawer() {
    if (!mobileDrawer) return;
    mobileDrawer.classList.add("open");
    document.body.style.overflow = "hidden";
  }

  function closeDrawer() {
    if (!mobileDrawer) return;
    mobileDrawer.classList.remove("open");
    document.body.style.overflow = "";
  }

  if (mobileMenuBtn) mobileMenuBtn.addEventListener("click", openDrawer);
  if (drawerCloseBtn) drawerCloseBtn.addEventListener("click", closeDrawer);
  drawerLinks.forEach((link) => link.addEventListener("click", closeDrawer));

  /* ==========================================================================
     3. STICKY HEADER & SCROLL SPY
     ========================================================================== */
  const headerBar = $("header-bar");
  const navLinks = $$(".desktop-nav a");
  const sections = $$("main section[id]");

  function handleScroll() {
    const scrollY = window.scrollY;

    // Header blur state
    if (headerBar) {
      if (scrollY > 60) {
        headerBar.classList.add("scrolled");
      } else {
        headerBar.classList.remove("scrolled");
      }
    }

    // Scroll spy
    let currentId = "";
    sections.forEach((section) => {
      const rect = section.getBoundingClientRect();
      if (rect.top <= 140 && rect.bottom >= 140) {
        currentId = section.id;
      }
    });

    navLinks.forEach((link) => {
      const href = link.getAttribute("href");
      if (href === `#${currentId}`) {
        link.classList.add("active");
      } else {
        link.classList.remove("active");
      }
    });

    // Timeline progress tracking
    const journeySec = $("journey");
    const timelineFill = $("timeline-progress-fill");
    if (journeySec && timelineFill) {
      const rect = journeySec.getBoundingClientRect();
      const vh = window.innerHeight;
      const progress = Math.min(Math.max((vh * 0.8 - rect.top) / (rect.height * 0.7), 0), 1);
      timelineFill.style.width = `${(progress * 100).toFixed(1)}%`;

      const cards = $$(".timeline-card");
      cards.forEach((card, idx) => {
        if (progress > (idx + 0.3) / cards.length) {
          card.classList.add("active");
        } else {
          card.classList.remove("active");
        }
      });
    }
  }

  window.addEventListener("scroll", handleScroll, { passive: true });
  window.addEventListener("resize", handleScroll);

  /* ==========================================================================
     4. INTERSECTION OBSERVER FOR REVEAL ANIMATIONS
     ========================================================================== */
  const reveals = $$(".rv");
  if ("IntersectionObserver" in window) {
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

    // Animate hero items on load
    requestAnimationFrame(() => {
      $$(".hero .rv").forEach((el) => el.classList.add("in"));
    });
  } else {
    reveals.forEach((el) => el.classList.add("in"));
  }

  /* ==========================================================================
     5. STAT COUNTERS ANIMATION
     ========================================================================== */
  const statNumbers = $$(".stat-val");
  if ("IntersectionObserver" in window && statNumbers.length > 0) {
    const statObserver = new IntersectionObserver(
      (entries, obs) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            obs.unobserve(entry.target);
            const target = entry.target;
            const rawVal = target.getAttribute("data-val") || "";
            const match = rawVal.match(/^(\d+)(\D*)$/);

            if (match) {
              const end = parseInt(match[1], 10);
              const suffix = match[2];
              const duration = 1400;
              let startTime = null;

              function step(timestamp) {
                if (!startTime) startTime = timestamp;
                const progress = Math.min((timestamp - startTime) / duration, 1);
                // Ease out cubic
                const eased = 1 - Math.pow(1 - progress, 3);
                target.textContent = Math.round(end * eased) + suffix;
                if (progress < 1) {
                  requestAnimationFrame(step);
                } else {
                  target.textContent = rawVal;
                }
              }
              requestAnimationFrame(step);
            }
          }
        });
      },
      { threshold: 0.5 }
    );

    statNumbers.forEach((num) => statObserver.observe(num));
  }

  /* ==========================================================================
     6. PRACTICE FILTER TABS (BSS Clinical vs Escola Global Training)
     ========================================================================== */
  const tabBtns = $$(".tab-btn");
  const practiceBlocks = $$(".practice-block");

  tabBtns.forEach((btn) => {
    btn.addEventListener("click", () => {
      tabBtns.forEach((b) => b.classList.remove("active"));
      btn.classList.add("active");

      const filter = btn.getAttribute("data-filter");
      practiceBlocks.forEach((block) => {
        const id = block.getAttribute("id");
        if (filter === "all" || id === filter) {
          block.style.display = "block";
          // Trigger reveal class
          block.querySelectorAll(".rv").forEach((r) => r.classList.add("in"));
        } else {
          block.style.display = "none";
        }
      });
    });
  });

  /* ==========================================================================
     7. INTERACTIVE FAQ ACCORDION
     ========================================================================== */
  const faqItems = $$(".faq-item");
  faqItems.forEach((item) => {
    const questionBtn = item.querySelector(".faq-question");
    const answer = item.querySelector(".faq-answer");

    if (questionBtn && answer) {
      questionBtn.addEventListener("click", () => {
        const isOpen = item.classList.contains("active");

        // Close other items
        faqItems.forEach((other) => {
          if (other !== item) {
            other.classList.remove("active");
            const otherAnswer = other.querySelector(".faq-answer");
            if (otherAnswer) otherAnswer.style.maxHeight = null;
          }
        });

        // Toggle current
        if (!isOpen) {
          item.classList.add("active");
          answer.style.maxHeight = answer.scrollHeight + 40 + "px";
        } else {
          item.classList.remove("active");
          answer.style.maxHeight = null;
        }
      });
    }
  });

  /* ==========================================================================
     8. INTERACTIVE APPOINTMENT & ENQUIRY ENGINE (Google Forms + WhatsApp)
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

  // Show a toast notification after successful Google Form submission
  function showSuccessToast() {
    let toast = document.getElementById("gform-success-toast");
    if (!toast) {
      toast = document.createElement("div");
      toast.id = "gform-success-toast";
      toast.setAttribute("role", "status");
      toast.setAttribute("aria-live", "polite");
      toast.style.cssText = [
        "position:fixed", "bottom:2rem", "left:50%", "transform:translateX(-50%)",
        "background:var(--gold-500,#c9a227)", "color:#1a1a1a", "font-weight:700",
        "padding:1rem 2rem", "border-radius:0.75rem", "box-shadow:0 8px 32px rgba(0,0,0,.45)",
        "z-index:9999", "font-size:1rem", "text-align:center", "max-width:90vw",
        "opacity:0", "transition:opacity .4s ease"
      ].join(";");
      toast.textContent = "✅ Enquiry submitted! Dr. Salmani will contact you shortly.";
      document.body.appendChild(toast);
    }
    // Fade in
    requestAnimationFrame(() => { toast.style.opacity = "1"; });
    // Fade out after 5 seconds
    setTimeout(() => {
      toast.style.opacity = "0";
      setTimeout(() => toast.remove(), 500);
    }, 5000);
  }

  // Detect when the hidden iframe loads after form POST → show success + reset form
  let gformSubmitted = false;
  if (gformIframe) {
    gformIframe.addEventListener("load", () => {
      if (gformSubmitted) {
        showSuccessToast();
        if (consultationForm) consultationForm.reset();
        gformSubmitted = false;
      }
    });
  }

  if (consultationForm) {
    consultationForm.addEventListener("submit", () => {
      gformSubmitted = true;
    });
  }

  // WhatsApp secondary button — still composes and sends a formatted message
  function composeEnquiryText() {
    const name = fName ? fName.value.trim() || "Not specified" : "Not specified";
    const phone = fPhone ? fPhone.value.trim() || "Not specified" : "Not specified";
    const service = fService ? fService.value : "General Consultation";
    const mode = fMode ? fMode.value : "In-Person (Kondotty Clinic)";
    const time = fTime ? fTime.value : "Any suitable time";
    const message = fMessage ? fMessage.value.trim() : "";

    return (
      `*Consultation Enquiry for Dr. Abdussalam Salmani*\n` +
      `----------------------------------------\n` +
      `• *Client / Contact Name:* ${name}\n` +
      `• *Phone Number:* ${phone}\n` +
      `• *Service Required:* ${service}\n` +
      `• *Preferred Mode:* ${mode}\n` +
      `• *Preferred Slot:* ${time}\n` +
      (message ? `• *Brief Details:* ${message}\n` : "") +
      `----------------------------------------\n` +
      `_Sent via drsalmani.in online portal_`
    );
  }

  if (btnSendWa) {
    btnSendWa.addEventListener("click", () => {
      const text = composeEnquiryText();
      const url = `https://wa.me/${PROFILE.whatsapp}?text=${encodeURIComponent(text)}`;
      window.open(url, "_blank", "noopener,noreferrer");
    });
  }

  // Pre-fill form from service cards
  window.selectServiceAndScroll = function (serviceName) {
    if (fService) {
      for (let i = 0; i < fService.options.length; i++) {
        if (fService.options[i].text.toLowerCase().includes(serviceName.toLowerCase())) {
          fService.selectedIndex = i;
          break;
        }
      }
    }
    const contactSection = $("contact");
    if (contactSection) {
      contactSection.scrollIntoView({ behavior: "smooth" });
      if (fName) fName.focus();
    }
  };

  /* ==========================================================================
     9. INSTANT vCard DOWNLOADER (.vcf for Mobile Contacts)
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

  // Initialize
  handleScroll();
})();
