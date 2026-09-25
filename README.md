# Dr. Abdussalam Salmani, PhD — Official Website

> **High-End Digital Presence for Senior Consultant Psychologist, Educational Psychologist, Family Counsellor & International Keynote Trainer**
> Location: *Calicut International City, Kondotty, Kerala, India*

---

## 🌟 Overview & Design Philosophy

This website is a bespoke, luxury digital platform built for **Dr. Abdussalam Salmani, PhD**, reflecting over three decades of educational leadership and fifteen years of doctoral clinical and family consulting practice.

The visual direction directly adopts the **Prestige Obsidian Velvet & Royal Champagne Gold** aesthetic inspired by Dr. Salmani's official executive profile brochure, combined with modern interactive capabilities:

- **Ivory Marble Motivation Wall**: off-white marble backdrop with engraved motivational icons and words drifting in zig-zag paths (static when reduced motion is preferred).
- **Dual Practice Hub**:
  - **BSS Skill School & Counseling Centre** (Tower 17, EC Mall, ICA Campus, Kondotty): Confidential one-to-one clinical, family, pre-marital, and learning difficulty sessions.
  - **Escola International**: Over 4,000 keynote addresses and training masterclasses for universities, schools, PTAs, and corporate organizations.
- **Smart Appointment & WhatsApp Router**: Real-time pre-formatted message generator that routes client details directly to Dr. Salmani's WhatsApp (+91 90485 05850) or official email.
- **1-Click Digital Business Card (.vcf)**: Allows visitors and event organizers to save Dr. Salmani's complete contact card to their smartphone contacts instantly.
- **Official Profile PDF Download**: Integrated download for schools and corporate institutions seeking his credentials brochure.
- **100% Zero-Dependency & Production-Ready**: Pure HTML5, modern CSS3 (custom properties, glassmorphism), and vanilla JavaScript.

---

## 📂 Project Structure

The site is plain HTML/CSS/JS. Shared parts (header, footer, icons) live in `src/` and are stitched into each page by a small Python script.

```text
Salmani/
├── index.html, about.html, expertise.html, counselling.html, achievements.html,
│   gallery.html, resources.html, book.html, contact.html   # GENERATED — do not edit
├── src/
│   ├── pages/        # the content of each page (edit these)
│   └── partials/     # head, header, footer, icon sprite, FAQ, enquiry form
├── styles.css        # ivory-marble theme + all components
├── script.js         # marble motivation wall, nav, reveals, forms, vCard
├── gallery.js        # gallery masonry, filters, homepage preview, lightbox
├── booking.js        # 5-step booking, ₹500 UPI advance, UTR submission
├── tools/
│   ├── build_site.py     # python tools/build_site.py  → rebuilds the HTML pages
│   └── build_gallery.py  # python tools/build_gallery.py → optimises gallery images
└── assets/
    ├── Training_imgs/, banners/   # ORIGINAL photos/posters (never modified)
    ├── gallery/                   # optimised copies + gallery-data.js + INVENTORY.md
    └── payment/upi-qr.png         # UPI QR code for the booking page
```

### Adding gallery photos
1. Drop originals into `assets/Training_imgs/` or `assets/banners/` (optional: `assets/certificates/`).
2. Run `python tools/build_gallery.py` (needs Pillow). It reports formats, sizes, orientation and duplicates in `assets/gallery/INVENTORY.md`, and writes WebP/AVIF/JPG copies.
3. Add verified captions in `assets/gallery/gallery-data.js` (`title`, `date`, `description`, `alt`, `featured`, `homepage`). They are kept on re-runs.

### Booking payments
The ₹500 advance is paid by UPI QR; the visitor submits their UTR. Requests reach the existing Google Form with the booking details in the message field. **Payments are verified manually** — the site never marks a payment as successful on its own.

## 🚀 Key Features

### 1. Dual Practice Presentation
- **Clinical Practice**: Personal Counselling, Adolescent & Family Therapy, Couples & Pre-marital Guidance, Learning Disability Assessment, Meditation & Relaxation Protocols, Mental Health Awareness.
- **Global Training**: Life Skills, Effective Parenting, Exam & Interview Composure, Career Aptitude Discovery, Public Speaking Eloquence, Leadership & HRM.

### 2. Verified Credentials & Pedigree
- **PhD in Psychology (2015)**
- **MSc in Psychology (2012)**
- **MBA in Human Resource Management (2009)**
- **MA & BEd in Arabic Language & Literature (University of Calicut)**
- **UGC NET (1999) & Kerala SET (2000) Qualified**
- **Certified NLP Practitioner**
- **JCI Senator & Certified International Trainer**
- **Former District Joint Co-ordinator**, Career Guidance & Adolescent Counselling (CG & AC), Malappuram
- **Multilingual Delivery**: Malayalam (Native), English, Arabic, and Hindi

### 3. Smart WhatsApp & Consultation Routing
The interactive booking module formats client submissions directly into structured WhatsApp messages:
- Client Name & Contact
- Selected Service / Practice
- Preferred Format (In-Person at Kondotty Clinic vs. Online Video Consultation)
- Preferred Time Slot
- Client Message Notes

---

## 🌐 How to Preview or Deploy

### Local Preview
After editing anything in `src/`, run `python tools/build_site.py`. Then run a local server:
```bash
# Python
python -m http.server 8000
# Then visit: http://localhost:8000
```

### Hosting & Deployment
The website is completely static with zero build steps required. It can be hosted immediately on:
- **Netlify / Vercel**: Drag and drop the `Salmani` folder.
- **GitHub Pages**: Push repository and enable Pages under Settings.
- **cPanel / Apache / Nginx**: Upload contents to `public_html/`.

---

## 📞 Official Contacts

- **Phone (Primary / WhatsApp)**: +91 90485 05850
- **Phone (Secondary)**: +91 90745 74246
- **Email**: salmanijalal@gmail.com
- **Clinic Address**: Tower 17, EC Mall, ICA Campus, Calicut International City, Kondotty, Malappuram Dt., Kerala, India - 673638
