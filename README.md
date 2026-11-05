# Tskhay & Associates website

The Tskhay & Associates website, built with React and Vite and published with **GitHub Pages**. Every change committed to the `main` branch rebuilds and republishes the site within a couple of minutes.

The current site at tskhayandassociates.com is not affected until the domain is pointed at GitHub Pages (see the last section). Do that only after Konstantin approves the new site.

## What's in this repository

| Path | What it is |
| --- | --- |
| `src/content/site.js` | Every word and link on the website, plus the newsletter and contact form settings. Edit text here. |
| `src/content/clients.js` | Client logos and quotes. Empty until approved, so nothing shows. |
| `src/content/caseStudies.js` | Case studies. Empty for now, so nothing shows. |
| `src/components/` | The page sections (header, hero, services, and so on). |
| `src/styles.css` | Colors, fonts, spacing and layout. |
| `public/` | Images, logo, browser-tab icon, sharing image, robots.txt and sitemap. |
| `index.html` | The homepage. |
| `lets-talk/index.html` | Forwards the old `/lets-talk` address to the contact form on the homepage. |
| `eltv/index.html`, `src/eltv/` | The eLTV simulator page at `/eltv/`. Formulas are in `src/eltv/model.js`; its words are in `src/content/eltv.js`. |
| `.github/workflows/deploy.yml` | Tells GitHub how to build and publish the site. |

## Publishing with GitHub Pages

GitHub Pages works on public repositories with a free GitHub account. A private repository needs a paid plan. The code contains nothing secret, but keep internal notes out of a public repository.

1. Upload the project files so the repository's main page lists `.github`, `lets-talk`, `public`, `src`, `README.md`, `index.html`, `package.json`, `package-lock.json` and `vite.config.js`.
2. Go to **Settings** > **Pages**. Under **Build and deployment**, set **Source** to **GitHub Actions**.
3. Open the **Actions** tab. When the newest run shows green checks for **build** and **deploy**, the site is live. The address is shown under **Settings** > **Pages**.

## The contact form

Every "Contact Us" button scrolls to the form in the Let's Talk section. GitHub Pages can't receive form messages by itself, so:

- **Without a form service** (the default), sending the form opens the visitor's email app with their message filled in.
- **With Formspree**, messages are sent straight to Konstantin's inbox and the visitor sees a thank-you message. To switch this on: create a free form at formspree.io (ideally with konstantin@tskhayandassociates.com), copy its address (it looks like `https://formspree.io/f/abcdwxyz`), open `src/content/site.js`, paste it between the quotes in `export const formEndpoint = '';`, and commit.

## Course and newsletter links

Both are set near the top of `src/content/site.js`:

- `courseUrl`: the People Analytics course page.
- `newsletterUrl`: the Kit newsletter signup page. While it is empty, the Newsletter link stays hidden. Paste the Kit link between the quotes and commit to show it.

## Changing text and images

- **Text:** open `src/content/site.js`, select the pencil icon, change the words between the quotes, and commit. Keep the quote marks and commas as they are.
- **Photos:** replace the file in `public/` with a new one of the same name and shape (`konstantin-tskhay.webp` 800 × 1000, `konstantin-networking.webp` 1200 × 900).
- **Client logos and quotes:** follow the instructions at the top of `src/content/clients.js`.
- **Case studies:** follow the instructions at the top of `src/content/caseStudies.js`.

If a change breaks the build, the Actions tab shows a red X and the live site stays on the last working version. Open the failed run to see the error.

## Connecting tskhayandassociates.com (only after approval)

The domain also carries Konstantin's email. Change only the website records below. Don't change the nameservers, and don't edit or delete MX or TXT records. Screenshot the GoDaddy DNS page before changing anything.

1. In GitHub, go to **Settings** > **Pages** > **Custom domain**, enter `www.tskhayandassociates.com`, and select **Save**.
2. In GoDaddy DNS, replace the existing **A** record for `@` with four A records pointing to `185.199.108.153`, `185.199.109.153`, `185.199.110.153` and `185.199.111.153`. These are GitHub's published addresses; check GitHub's "Managing a custom domain" page in case they have changed.
3. Set the **CNAME** record for `www` to `tskhay-and-associates-website.github.io` (the organization that owns this repository).
4. When GitHub shows the DNS check as successful, tick **Enforce HTTPS** under **Settings** > **Pages**.
5. Open **Actions**, select the workflow, and select **Run workflow**, so the site rebuilds for the new address.
6. Check https://tskhayandassociates.com and https://www.tskhayandassociates.com, and send a test email to confirm email still arrives.

## The eLTV simulator

The page at `/eltv/` is the Executive eLTV & Workforce Risk Simulator, restyled to match the site.

- `src/eltv/model.js`: the Tskhay-Charney formula, scenario presets and chart maths, copied unchanged from the original calculator. Edit only when the model itself changes.
- `src/eltv/EltvApp.jsx` and `src/eltv/eltv.css`: layout and look.
- `src/content/eltv.js`: page text, including the FiveX collaboration note.
- Everything runs in the visitor's browser. Nothing they enter is stored or sent.

## Technical notes

- React 18 and Vite 5. The eLTV page also uses Recharts (chart) and lucide-react (icons). The workflow runs `npm ci` and `npm run build` and publishes the `dist` folder.
- The Jost font is bundled with the site, so no external font service is called.
- No tracking, analytics or cookies. If Formspree is switched on, the form sends the visitor's name, email, company and message to it.
