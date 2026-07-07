# विघ्नहर्ता मित्र मंडळ — Official Website

A premium, animated static website for Vighnaharta Mitra Mandal's 28th Ganeshotsav, built with plain HTML5, CSS3 and vanilla JavaScript (ES6). No backend, no build step — deploys straight to Vercel as a static site.

## Tech used
- **GSAP + ScrollTrigger** — hero motion, parallax, scroll reveals
- **AOS** — scroll-triggered fade/slide reveals
- **Three.js (r128)** — 3D jersey viewer
- **Swiper.js** — loaded and ready for any future carousel needs
- **LightGallery** — loaded and ready as an alternative gallery viewer (a custom lightbox is used by default, see below)
- **Font Awesome 6** — iconography

## Folder structure
```
Vighnaharta-Mitra-Mandal/
├── index.html
├── vercel.json
├── css/
│   ├── style.css        # variables, layout, components
│   ├── animation.css     # keyframes & motion utility classes
│   └── responsive.css    # breakpoints
├── js/
│   ├── app.js           # loader, counters, gallery, lightbox, countdowns
│   ├── particles.js     # canvas starfield + floating gold motes
│   ├── scroll.js        # AOS/GSAP ScrollTrigger init, navbar state
│   ├── cursor.js         # custom cursor + glow
│   └── jersey.js         # Three.js 3D jersey viewer
└── images/
    ├── hero/            # ganesha-illustration.svg (original artwork placeholder)
    ├── gallery/          # add real photos here, organised by category
    ├── jersey/           # add jersey-front.png here for the 3D viewer
    ├── logo/             # favicon.svg
    ├── background/
    └── sponsors/
```

## Replacing placeholder content

1. **Gallery photos** — drop files directly into `images/gallery/` named `bappa1`, `bappa2`, `bappa3`, ... in the order you want them displayed. `js/app.js` automatically probes for `bappa1.jpg/.jpeg/.png/.webp`, then `bappa2`, and so on, stopping at the first missing number — so just keep the numbering contiguous (no gaps). No code changes needed when adding more photos.
2. **Jersey image** — already wired up: `images/jersey/jersey-front.png` and `images/jersey/jersey-back.png` are used as the front/back faces in the 3D viewer (`js/jersey.js`) and the hero showcase. Replace these two files (keep the same filenames) to update the design.
3. **Sponsor / committee logos** — swap the Font Awesome icon placeholders in the Sponsors section of `index.html` with `<img>` tags once logos are supplied.
4. **QR code** — replace the `.qr-placeholder` block in the Donation section with an `<img>` of the real UPI QR code.
5. **Bank & contact details** — update the placeholder account number and IFSC in `index.html` (Donation section) with the mandal's real details.

## Deploying to Vercel

1. Push this folder to a GitHub repository (or drag-and-drop the folder into the Vercel dashboard).
2. In Vercel, "Import Project" → select the repo → framework preset **Other** (static) → deploy.
3. No environment variables or build command are required.

## Accessibility & performance notes
- Respects `prefers-reduced-motion` (disables non-essential animation).
- Images use `loading="lazy"`.
- Semantic HTML5 landmarks (`header`, `nav`, `section`, `footer`) throughout.
- Custom cursor is automatically disabled on touch devices.
