/**
 * BOOK A CONSULTATION — 5-step booking with ₹500 UPI advance + UTR submission.
 *
 * Payment is NOT verified by this page. A UTR is only a reference typed by
 * the visitor; the office matches it against received payments and then
 * confirms the booking by phone/WhatsApp. Statuses therefore stop at
 * PAYMENT_SUBMITTED on the visitor's side.
 *
 * Booking requests are posted to the office's Google Form (same form as the
 * enquiry form), with the booking details in the message field.
 */

(function () {
  "use strict";

  /* ---------------- Configuration ---------------- */
  const BOOKING = {
    advanceAmount: 500,
    // UPI ID shown under the QR and used for the "Pay in a UPI app" button.
    // Must match the QR code (confirmed payee: Imthiyas Kamal).
    upiId: "9895075058@ybl",
    payeeName: "Imthiyas Kamal",
    // Put the supplied QR image at this path (PNG/JPG/WebP).
    qrImage: "assets/payment/upi-qr-web.png",
    whatsapp: "919048505850",
    form: {
      action: "https://docs.google.com/forms/d/e/1FAIpQLScDzMoowkeIZjhj5vDCyOgXt8pgpFrKZDcyuA-ECUUcFj9QUw/formResponse",
      fields: {
        name: "entry.1872235412",
        phone: "entry.1422811881",
        service: "entry.1631577008",
        mode: "entry.1372565443",
        slot: "entry.1725899432",
        message: "entry.988205658"
      }
    }
  };

  const STATUS = {
    PENDING_PAYMENT: "Pending payment",
    PAYMENT_SUBMITTED: "Payment submitted",
    PAYMENT_VERIFIED: "Payment verified",
    BOOKING_CONFIRMED: "Booking confirmed",
    CANCELLED: "Cancelled"
  };

  const STORE_KEY = "salmani_bookings";

  const form = document.getElementById("booking-form");
  if (!form) return;

  const $ = (id) => document.getElementById(id);
  const panels = form.querySelectorAll(".step-panel");
  const stepItems = document.querySelectorAll("#stepper li");
  const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  let step = 1;
  let draftRef = null;

  /* ---------------- Helpers ---------------- */
  const pad = (n) => String(n).padStart(2, "0");
  const isoDate = (d) => `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}`;
  const today = () => isoDate(new Date());
  const value = (name) => {
    const el = form.elements[name];
    if (!el) return "";
    if (el instanceof RadioNodeList) return el.value || "";
    if (el.type === "checkbox") return el.checked;
    return (el.value || "").trim();
  };
  const niceDate = (iso) => {
    if (!iso) return "";
    const [y, m, d] = iso.split("-").map(Number);
    return new Date(y, m - 1, d).toLocaleDateString("en-IN", { weekday: "short", day: "numeric", month: "short", year: "numeric" });
  };

  function loadBookings() {
    try {
      return JSON.parse(localStorage.getItem(STORE_KEY)) || [];
    } catch (e) {
      return [];
    }
  }

  function saveBooking(record) {
    try {
      const list = loadBookings().filter((b) => b.ref !== record.ref);
      list.unshift(record);
      localStorage.setItem(STORE_KEY, JSON.stringify(list.slice(0, 10)));
    } catch (e) {
      /* storage unavailable — the booking itself is unaffected */
    }
  }

  function newRef() {
    const d = new Date();
    const rand = Math.random().toString(36).slice(2, 6).toUpperCase();
    return `DS-${String(d.getFullYear()).slice(2)}${pad(d.getMonth() + 1)}${pad(d.getDate())}-${rand}`;
  }

  /* ---------------- Validation ---------------- */
  function setError(name, message) {
    const slot = form.querySelector(`[data-error-for="${name}"]`);
    const el = form.elements[name];
    const input = el instanceof RadioNodeList ? null : el;
    if (slot) {
      slot.textContent = message || "";
      slot.hidden = !message;
    }
    if (input) {
      if (message) input.setAttribute("aria-invalid", "true");
      else input.removeAttribute("aria-invalid");
      if (slot && slot.id === "") slot.id = `err-${name}`;
      if (slot) input.setAttribute("aria-describedby", slot.id);
    }
    return !message;
  }

  const phoneOk = (p) => {
    const digits = p.replace(/\D/g, "");
    return digits.length >= 10 && digits.length <= 15;
  };
  const emailOk = (e) => !e || /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(e);

  function validate(n) {
    const checks = [];
    if (n === 1) {
      checks.push(setError("service", value("service") ? "" : "Please choose a consultation."));
      const date = value("date");
      let msg = "";
      if (!date) msg = "Please choose a preferred date.";
      else if (date < today()) msg = "Please choose today or a later date.";
      else {
        const [y, m, d] = date.split("-").map(Number);
        if (new Date(y, m - 1, d).getDay() === 0) msg = "Consultations are held Monday to Saturday.";
      }
      checks.push(setError("date", msg));
    }
    if (n === 2) {
      checks.push(setError("name", value("name").length >= 2 ? "" : "Please enter your full name."));
      checks.push(setError("phone", phoneOk(value("phone")) ? "" : "Please enter a valid mobile number with country code if outside India."));
      checks.push(setError("email", emailOk(value("email")) ? "" : "Please check the email address."));
    }
    if (n === 3) {
      checks.push(setError("concern", value("concern").length >= 5 ? "" : "Please add a line about what you would like help with."));
      checks.push(setError("consent", value("consent") ? "" : "Please confirm you understand the advance and verification."));
    }
    if (n === 5) {
      checks.push(setError("payerName", value("payerName").length >= 2 ? "" : "Please enter the name used for the booking."));
      checks.push(setError("payerPhone", phoneOk(value("payerPhone")) ? "" : "Please enter a valid phone number."));
      checks.push(setError("payerEmail", emailOk(value("payerEmail")) ? "" : "Please check the email address."));

      const utr = value("utr").replace(/\s+/g, "");
      let utrMsg = "";
      if (!utr) utrMsg = "Please enter the UTR / transaction reference from your payment app.";
      else if (!/^[A-Za-z0-9]{10,22}$/.test(utr)) utrMsg = "A UTR has 10–22 letters or digits (most UPI references are 12 digits). Do not enter your UPI PIN.";
      else if (/^(.)\1+$/.test(utr)) utrMsg = "That does not look like a transaction reference. Please copy it from your payment app.";
      checks.push(setError("utr", utrMsg));

      const pd = value("payDate");
      const earliest = isoDate(new Date(Date.now() - 45 * 864e5));
      let pdMsg = "";
      if (!pd) pdMsg = "Please enter the payment date.";
      else if (pd > today()) pdMsg = "The payment date cannot be in the future.";
      else if (pd < earliest) pdMsg = "Please check the payment date.";
      checks.push(setError("payDate", pdMsg));
    }
    const ok = checks.every(Boolean);
    if (!ok) {
      const firstBad = form.querySelector('.step-panel.active [aria-invalid="true"], .step-panel.active .field-error:not([hidden])');
      if (firstBad) {
        const focusTarget = firstBad.matches(".field-error")
          ? firstBad.closest(".step-panel").querySelector("input, textarea, select")
          : firstBad;
        if (focusTarget) focusTarget.focus();
      }
    }
    return ok;
  }

  /* ---------------- Step navigation ---------------- */
  function goTo(n) {
    step = n;
    panels.forEach((p) => p.classList.toggle("active", Number(p.dataset.step) === n));
    stepItems.forEach((li, i) => {
      li.classList.toggle("done", i + 1 < n);
      li.classList.toggle("current", i + 1 === n);
      if (i + 1 === n) li.setAttribute("aria-current", "step");
      else li.removeAttribute("aria-current");
    });

    if (n === 4) enterPayment();
    if (n === 5) enterDetails();

    const card = $("booking-app");
    const heading = form.querySelector(".step-panel.active h2");
    if (heading) {
      heading.setAttribute("tabindex", "-1");
      heading.focus({ preventScroll: true });
    }
    if (card && card.getBoundingClientRect().top < 0) {
      card.scrollIntoView({ behavior: reduceMotion ? "auto" : "smooth", block: "start" });
    }
  }

  form.addEventListener("click", (e) => {
    if (e.target.closest("[data-next]")) {
      if (validate(step)) goTo(step + 1);
    } else if (e.target.closest("[data-back]")) {
      goTo(step - 1);
    }
  });

  // clear an error as soon as the field is corrected
  form.addEventListener("input", (e) => {
    const name = e.target.name;
    if (name && e.target.getAttribute("aria-invalid") === "true") setError(name, "");
  });
  form.addEventListener("change", (e) => {
    const name = e.target.name;
    if (name === "service" || name === "consent") setError(name, "");
  });

  /* ---------------- Step 4: advance payment ---------------- */
  function enterPayment() {
    if (!draftRef) draftRef = newRef();
    saveBooking({
      ref: draftRef,
      service: value("service"),
      created: new Date().toISOString(),
      status: "PENDING_PAYMENT"
    });
    renderMyBookings();
  }

  function setupPaymentPanel() {
    const qr = $("upi-qr");
    const missing = $("upi-qr-missing");
    if (qr) {
      qr.addEventListener("error", () => {
        qr.hidden = true;
        if (missing) missing.hidden = false;
      });
      qr.src = BOOKING.qrImage;
    }

    if (BOOKING.upiId) {
      $("upi-id-row").hidden = false;
      $("upi-id").textContent = BOOKING.upiId;
      $("upi-payee").textContent = BOOKING.payeeName;
      $("copy-upi").addEventListener("click", async (e) => {
        try {
          await navigator.clipboard.writeText(BOOKING.upiId);
          e.target.textContent = "Copied";
          setTimeout(() => { e.target.textContent = "Copy"; }, 1600);
        } catch (err) { /* clipboard unavailable */ }
      });

      // UPI deep link only helps on phones where a UPI app is installed
      if (/Android|iPhone|iPad/i.test(navigator.userAgent)) {
        const link = $("upi-deeplink");
        const params = new URLSearchParams({
          pa: BOOKING.upiId,
          pn: BOOKING.payeeName,
          am: String(BOOKING.advanceAmount),
          cu: "INR",
          tn: "Consultation advance"
        });
        link.href = "upi://pay?" + params.toString();
        link.hidden = false;
      }
    }
  }

  /* ---------------- Step 5: payment details ---------------- */
  function enterDetails() {
    const pn = $("b-pname");
    const pp = $("b-pphone");
    const pe = $("b-pemail");
    const pd = $("b-pdate");
    if (pn && !pn.value) pn.value = value("name");
    if (pp && !pp.value) pp.value = value("phone");
    if (pe && !pe.value) pe.value = value("email");
    if (pd) {
      pd.max = today();
      if (!pd.value) pd.value = today();
    }

    const serviceLabel = form.querySelector('input[name="service"]:checked');
    const rows = [
      ["Reference", draftRef],
      ["Consultation", serviceLabel ? serviceLabel.closest(".choice").querySelector("strong").textContent : value("service")],
      ["Format", value("mode").startsWith("Online") ? "Online video" : "In person · Kondotty"],
      ["Preferred date", niceDate(value("date"))],
      ["Advance", `₹${BOOKING.advanceAmount} (adjusted against final fee)`]
    ];
    const dl = $("booking-summary");
    dl.replaceChildren();
    rows.forEach(([k, v]) => {
      const dt = document.createElement("dt");
      const dd = document.createElement("dd");
      dt.textContent = k;
      dd.textContent = v;
      dl.append(dt, dd);
    });
  }

  /* ---------------- Submission ---------------- */
  function composeMessage(utr) {
    return [
      `BOOKING REQUEST — ${draftRef}`,
      `Status: PAYMENT SUBMITTED (awaiting manual verification)`,
      `Advance: ₹${BOOKING.advanceAmount} (to be adjusted against final fee)`,
      `UTR / Reference: ${utr}`,
      `Payment date: ${value("payDate")}`,
      `Payer: ${value("payerName")} · ${value("payerPhone")}${value("payerEmail") ? " · " + value("payerEmail") : ""}`,
      `Preferred date: ${value("date")} (${value("slot")})`,
      `City/Country: ${value("city") || "—"}`,
      `Session for: ${value("for")} · Age: ${value("age") || "—"} · Language: ${value("language")} · Previous counselling: ${value("prior")}`,
      `Concern: ${value("concern")}`
    ].join("\n");
  }

  function postToGoogleForm(fields) {
    return new Promise((resolve) => {
      const iframe = $("booking-gform-iframe");
      const f = document.createElement("form");
      f.action = BOOKING.form.action;
      f.method = "POST";
      f.target = iframe ? iframe.name : "_blank";
      f.hidden = true;
      Object.entries(fields).forEach(([key, val]) => {
        const input = document.createElement("input");
        input.type = "hidden";
        input.name = BOOKING.form.fields[key];
        input.value = val;
        f.appendChild(input);
      });
      document.body.appendChild(f);

      let done = false;
      const finish = () => {
        if (done) return;
        done = true;
        f.remove();
        resolve();
      };
      if (iframe) iframe.addEventListener("load", finish, { once: true });
      setTimeout(finish, 5000);
      f.submit();
    });
  }

  form.addEventListener("submit", async (e) => {
    e.preventDefault();
    if (!validate(5)) return;

    if (!navigator.onLine) {
      setError("utr", "You appear to be offline. Please reconnect and submit again.");
      return;
    }

    const btn = $("booking-submit");
    btn.disabled = true;
    btn.querySelector("span").textContent = "Submitting…";

    const utr = value("utr").replace(/\s+/g, "").toUpperCase();
    await postToGoogleForm({
      name: value("payerName"),
      phone: value("payerPhone"),
      service: value("service"),
      mode: value("mode"),
      slot: value("slot"),
      message: composeMessage(utr)
    });

    // Only non-sensitive fields are kept on this device (no concern/health details)
    saveBooking({
      ref: draftRef,
      service: value("service"),
      created: new Date().toISOString(),
      utr: utr.slice(-4),
      status: "PAYMENT_SUBMITTED"
    });

    showResult(utr);
  });

  function showResult(utr) {
    form.hidden = true;
    document.getElementById("stepper").hidden = true;
    const result = $("booking-result");
    result.hidden = false;
    $("result-ref").textContent = draftRef;

    const wa = [
      `Hello Dr. Salmani's office,`,
      `I have submitted a consultation booking and paid the ₹${BOOKING.advanceAmount} advance.`,
      `Reference: ${draftRef}`,
      `Name: ${value("payerName")}`,
      `UTR: ${utr}`,
      `Payment date: ${value("payDate")}`,
      `Please confirm once verified. Thank you.`
    ].join("\n");
    $("result-wa").href = `https://wa.me/${BOOKING.whatsapp}?text=${encodeURIComponent(wa)}`;

    result.focus();
    renderMyBookings();
    result.scrollIntoView({ behavior: reduceMotion ? "auto" : "smooth", block: "start" });
  }

  /* ---------------- Requests on this device ---------------- */
  function renderMyBookings() {
    const wrap = $("my-bookings");
    const body = $("my-bookings-body");
    const list = loadBookings();
    if (!wrap || !body || !list.length) return;
    body.replaceChildren();
    list.forEach((b) => {
      const tr = document.createElement("tr");
      const cells = [
        b.ref,
        (b.service || "").split(" (")[0],
        new Date(b.created).toLocaleDateString("en-IN", { day: "numeric", month: "short" })
      ];
      cells.forEach((c) => {
        const td = document.createElement("td");
        td.textContent = c;
        tr.appendChild(td);
      });
      const td = document.createElement("td");
      const badge = document.createElement("span");
      badge.className = "status-badge";
      badge.dataset.status = b.status;
      badge.textContent = STATUS[b.status] || b.status;
      td.appendChild(badge);
      tr.appendChild(td);
      body.appendChild(tr);
    });
    wrap.hidden = false;
  }

  /* ---------------- Init ---------------- */
  const dateInput = $("b-date");
  if (dateInput) dateInput.min = today();

  // "?service=Personal Counselling" from service cards pre-selects the matching option
  const requested = new URLSearchParams(location.search).get("service");
  if (requested) {
    const words = requested.toLowerCase().split(/[^a-z]+/).filter((w) => w.length > 3);
    let best = null;
    let bestScore = 0;
    form.querySelectorAll('input[name="service"]').forEach((r) => {
      const text = r.value.toLowerCase();
      const score = words.filter((w) => text.includes(w)).length;
      if (score > bestScore) { best = r; bestScore = score; }
    });
    if (best) best.checked = true;
  }

  setupPaymentPanel();
  renderMyBookings();
})();
