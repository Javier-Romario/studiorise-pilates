# Migrating from Wix to this Astro site

A beginner-friendly, step-by-step guide for taking this website live and
pointing the studio's domain at it instead of Wix.

**Audience:** anyone comfortable logging into a website account and following
instructions. No programming knowledge required. Any step that needs a code
change is written out in full.

---

## 1. The big picture (read this first)

Right now the studio's domain (e.g. `studiorisepilates.com`) points at **Wix**,
which both *hosts* the site and lets you *edit* it in a drag-and-drop editor.

This project is an **Astro** site — a modern, very fast website that is
"pre-built" into plain HTML/CSS files before it goes online. Once built, there
is no server to manage: the finished files just need to sit somewhere public.

Migrating means doing three things, in order:

1. **Prepare the content** — make sure names, addresses, hours, and the booking
   widget are all correct in `src/data/content.json`.
2. **Choose a host** — pick where the finished files will live (Section 4).
3. **Point the domain** — change the domain's DNS settings so visitors reach
   the new host instead of Wix (Section 5).

> ⚠️ **Read Section 6 (email) before you change anything DNS-related.**
> Email for `@studiorisepilates.com` is easy to break by accident, and it is the
> single most common way a migration goes wrong for a business.

---

## 2. Two things that are easy to confuse

- **Domain** = the address people type, e.g. `studiorisepilates.com`.
  You *register* it (often yearly) with a registrar.
- **Hosting** = where the website files physically live and get served from.

Wix bundles both together, which hides the distinction. When you migrate, you
can (and often should) keep the domain where it is and simply point it at a new
host. You do **not** have to move the domain unless you want to.

**Where is the domain registered?** Look it up:

- If the domain was bought *through Wix*, it is registered at Wix.
- If it was bought at GoDaddy, Namecheap, Google, etc., it is registered there.

Either way, the migration works the same: you keep the domain, and you change
its DNS (name server or DNS record) settings to point at the new host.

---

## 3. Pre-flight checklist

Do all of this **before** touching the domain. Nothing here affects the live
Wix site, so there is no risk.

- [ ] **Get DNS login details.** Find where the domain is managed and confirm
      you can log in (Wix account, GoDaddy, Namecheap, etc.).
- [ ] **Confirm the domain name** the studio wants to use
      (`studiorisepilates.com`? `www.studiorisepilates.com`? both?).
- [ ] **Save the current email (MX) records** — see Section 6. Do not skip.
- [ ] **Confirm the real business details.** The content file currently has a
      few placeholders that must be checked with the owner:

      | Item | Current value | Action |
      | ---- | ------------- | ------ |
      | Rugby address | The Independent Quarter, Regent Street, Rugby, CV21 2PS | Confirm postcode / number |
      | Phone number | *(missing)* | Add one |
      | Opening hours | "Seven days a week" | Replace with real schedule |
      | Instagram handle | `@studiorisepilates` | Confirm |
      | Glofox booking widget | not connected | Get the iframe `src` |

- [ ] **Get the Glofox booking link.** In Glofox's Website Integration Builder,
      enter the Branch ID and generate the **Class Schedule** widget, then copy
      the iframe `src` (the URL). Paste it into `booking.glofox.src` in
      `src/data/content.json`.

### How to edit the content (no coding needed)

1. Run the site locally:

   ```bash
   npm install
   npm run dev
   ```

2. Open `http://localhost:4321/admin` in your browser.
3. Edit the JSON, then either:
   - **Download** the JSON and drop it over `src/data/content.json`, **or**
   - **Commit to GitHub** using a fine-grained personal access token
     (repo *Contents: read & write*). The live site rebuilds automatically.

Full schema reference: [`ARCHITECTURE.md`](./ARCHITECTURE.md).

---

## 4. Where should the site be hosted?

### Can it stay on GitHub Pages? Yes — with a caveat.

GitHub Pages (where it is deployed now) **can** host this site forever, for
free, on a custom domain with free HTTPS. There is nothing technically wrong
with that. The caveat is *who* operates it day-to-day:

- GitHub Pages is tied to a GitHub account and a git repository. Content edits
  go through the repo (or the `/admin` page, which commits to the repo).
- It is perfectly fine for a developer-managed site, but it is a slightly
  awkward thing to hand to a non-technical client, and it depends on a personal
  GitHub account staying healthy.

So: **GitHub Pages works, but for a professional client we recommend a
dedicated static host instead.** They are just as free, add client-friendly
features (deploy previews, redirects, forms, analytics), and don't tie the
business website to one person's GitHub account.

### Recommendation: Cloudflare Pages (primary)

**Why:**

- **Free** generous tier (unlimited bandwidth, unlimited requests).
- **Custom domain + automatic HTTPS** out of the box.
- **Global CDN** — the site loads fast everywhere, including the UK.
- **Redirect rules** built in — easy to map old Wix URLs to the new site.
- **Not tied to a personal GitHub account** in a fragile way; the client can
  own the Cloudflare account.
- Bonus: Cloudflare also offers free **email routing** and DNS, so if the domain
  is moved to Cloudflare later, email handling is easy to manage.

### Alternative: Netlify (friendliest UI)

- Very beginner-friendly dashboard, drag-and-drop deploy also possible.
- Built-in **forms** (useful later if the studio wants a contact form).
- Free tier is generous (100 GB bandwidth/month — far more than this site needs).
- Easy **redirects** via a single `_redirects` file.

### Fallback: GitHub Pages (stay where it is)

- Free, already working.
- Best only if a developer keeps maintaining the repo.
- Requires changing `base` from `/studiorise-pilates/` to `/` (see below).

**Bottom line:** use **Cloudflare Pages** for the client site. If the client
prefers a softer-looking dashboard, use **Netlify**. GitHub Pages remains a
valid free fallback.

---

## 5. Step-by-step migration

### Step 0 — Make the config changes

For a custom domain, the site must build at the domain root (`/`), not under a
project path. Open `astro.config.mjs` and change two lines:

```js
export default defineConfig({
  site: 'https://studiorisepilates.com', // your real domain
  base: '/',                              // was '/studiorise-pilates/'
  // ... rest stays the same
});
```

Then rebuild and verify nothing looks broken:

```bash
npm run build
npm run preview   # check http://localhost:4321
```

> If you deploy via GitHub Actions to GitHub Pages, also update
> `.github/workflows/deploy.yml`: change `BASE_PATH: /studiorise-pilates/` to
> `BASE_PATH: /`. Netlify and Cloudflare detect Astro automatically and do
> **not** need this file.

### Step 1 — Push the latest content

Commit the confirmed content and the config change to `main`. This is now the
source of truth that all hosts will build from.

### Step 2 — Create the hosting account

**Cloudflare Pages:**
1. Create a free account at https://dash.cloudflare.com/sign-up.
2. **Workers & Pages → Create → Pages → Connect to Git.**
3. Connect the GitHub repo.
4. Build settings (usually auto-detected):
   - Build command: `npm run build`
   - Build output directory: `dist`
5. Save. Cloudflare builds and gives you a temporary `*.pages.dev` URL — test it.

**Netlify:**
1. Create a free account at https://app.netlify.com.
2. **Add new site → Import an existing project →** connect GitHub and pick the repo.
3. Build command `npm run build`, publish directory `dist` (auto-detected).
4. Deploy. You get a temporary `*.netlify.app` URL — test it.

### Step 3 — Test on the temporary URL first

Before pointing the real domain anywhere, open the temporary
(`*.pages.dev` / `*.netlify.app`) URL and check:

- [ ] All five sections scroll correctly.
- [ ] Videos and images load.
- [ ] Booking section shows the Glofox widget (not the "being connected" note).
- [ ] On a phone: layout fits, sections scroll, no horizontal scroll.
- [ ] The footer shows correct email, Instagram, hours.

### Step 4 — Point the domain at the new host

This is the moment the site goes live. Have your DNS login ready, and be
prepared for it to take a few minutes to a few hours to take effect.

**Cloudflare Pages:**
1. In the Pages project: **Custom domains → Set up a custom domain.**
2. Add both `studiorisepilates.com` and `www.studiorisepilates.com`.
3. Cloudflare gives you a `CNAME` target (looks like `your-project.pages.dev`).
4. At your DNS provider (Wix, GoDaddy, etc.), add:
   - `CNAME` for `www` → `your-project.pages.dev`
   - For the bare domain, use the provider's root redirect feature or add the
     records Cloudflare shows you (some registrars support `ALIAS`/`ANAME` for
     the root).
5. Wait. DNS changes usually propagate within 10–30 minutes but can take up to
   24–48 hours.

**Netlify:**
1. **Site settings → Domain management → Add a domain.**
2. Add the domain; Netlify shows the required DNS records.
3. At your DNS provider, add the `CNAME`/`ALIAS` records Netlify lists.
4. Wait for the HTTPS certificate to be issued automatically.

### Step 5 — Verify HTTPS

- Visit `https://studiorisepilates.com` and `https://www.studiorisepilates.com`.
- Confirm the padlock shows and there is no "not secure" warning.
- If one of the two (www or bare) doesn't redirect to the other, set up a
  redirect so only one canonical address is used (Cloudflare/Netlify both have
  a one-click option for this).

### Step 6 — Redirect old Wix URLs (SEO)

Wix builds URLs differently from this single-page site. Most traffic lands on
the homepage, but any old links (Google results, Instagram bio, bookmarks)
should be redirected rather than landing on a 404.

The simplest safe approach: **redirect everything to the homepage** of the new
site, and add specific redirects for any known important pages.

- **Cloudflare:** **Rules → Redirect Rules** — create a rule that 301-redirects
  `*` (or specific old paths) to `https://studiorisepilates.com/`.
- **Netlify:** add a `public/_redirects` file:

  ```
  /old-wix-page  /  301
  /*             /  301
  ```

  Then commit and redeploy.

### Step 7 — Keep Wix alive briefly, then cancel

1. Leave the Wix site and subscription running for **at least a week** after
   the new site is live (or until you're confident everything is stable).
2. Check Google Search Console / search results to confirm the new site is
   indexed (optional but recommended).
3. Once confident, cancel the Wix plan.
4. **Do not cancel the Wix domain registration** if the domain is registered at
   Wix — only cancel the *website plan*. If you cancel the domain, the address
   stops working entirely.

---

## 6. ⚠️ Protect the email — do this first

If the studio uses email at its own domain (e.g. `info@studiorisepilates.com`),
the DNS **MX records** control where that email is delivered. Changing DNS
without preserving the MX records will silently break the studio's email.

### How to check and copy the MX records

1. Log in to the current DNS provider (Wix, GoDaddy, etc.).
2. Find the **DNS records** / **Advanced DNS** / **Zone editor** section.
3. Look for records of type **MX**. Copy down exactly:
   - Priority (number)
   - Value (the mail server name)
4. Save this list somewhere safe. Also copy any **TXT** records that mention
   `spf` or `dmarc` (these prevent email being marked as spam).

### What to do with them

- If you **keep the domain at the same registrar** (recommended) and only add
  records for the new host, the MX records are already there — **just don't
  delete or overwrite them.**
- If you **move the domain to Cloudflare** (registrar transfer), Cloudflare
  tries to import existing DNS records automatically — verify the MX/TXT
  records imported correctly before confirming.
- If the studio's email is hosted by **Google Workspace** or **Microsoft 365**,
  the MX/TXT records come from that provider's setup guide; keep them identical.

> When in doubt: **do not change the MX records.** Only the website
> (`A`/`CNAME`) records need to change. Leave everything email-related alone.

---

## 7. Rollback plan (if something goes wrong)

You can always go back to Wix in minutes:

1. Log in to the DNS provider.
2. Change the `A`/`CNAME` records back to Wix's values (Wix shows these in its
   "Connect domain" settings).
3. Wait for propagation (usually under an hour).

The new host keeps running on its temporary URL, so nothing is lost — you just
point the domain back.

---

## 8. Post-launch checklist

- [ ] `https://studiorisepilates.com` loads with a padlock.
- [ ] `www.` and bare domain behave the same (one redirects to the other).
- [ ] Email still works — send a test to `info@studiorisepilates.com`.
- [ ] Booking widget loads and lets a test user reach Glofox.
- [ ] Site is fast on mobile (test on 4G).
- [ ] Google Search Console is set up and the sitemap is submitted.
- [ ] Old Wix URLs redirect (or at least don't 404).
- [ ] Wix plan cancelled **after** everything is stable.

---

## 9. Quick reference — what changed where

| Thing | Where | What to do |
| ----- | ----- | ---------- |
| Site content | `src/data/content.json` | Edit in `/admin` or directly |
| Domain in build | `astro.config.mjs` | `site` = real domain, `base` = `/` |
| Deploy base path | `.github/workflows/deploy.yml` | Only if using GitHub Pages |
| Domain DNS | Registrar (Wix/GoDaddy/…) | Add `CNAME`/`ALIAS` for new host |
| Email | Registrar DNS | Leave MX/TXT records untouched |
| Old URLs | Cloudflare/Netlify | Add 301 redirects |
| Wix | wix.com account | Cancel plan after go-live, keep domain |
