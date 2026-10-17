# yasersyed.github.io

Personal portfolio for Syed Yaser Ahmed, served by GitHub Pages from `master` at https://yasersyed.github.io. There is no build step: what's committed is what's served.

## The idea

The page is a **workbench**: a green cutting mat with a parts cabinet on it. Each drawer is one language, framework or tool, labelled with label-maker tape. Opening a drawer writes its contents on an index card: where the tool was used, a short note, and the public repos built with it.

The site highlights **tools and side projects, not the day job**. Keep the job to the short "Day job" list. Earlier versions were rejected for being generic templates and for centring on the job, so don't drift back to a hero-plus-cards layout or job-first copy.

## Files

| Path | What it is |
| --- | --- |
| `index.html` | The whole page: hero, cabinet, index card, "On the bench" projects, day job, school, and one `<template>` per drawer |
| `css/site.css` | All styles. Colour and font tokens are at the top in `:root` |
| `js/site.js` | Drawer clicks (copies the matching `<template>` into the card) and the ruler numbers along the top |
| `js/carousel.js` | Screenshot slideshow used on the bench (scroll-snap, arrows, dots, arrow keys) |
| `images/apps/<project>/` | Screenshots, as WebP |
| `Resume.pdf` | The resume behind the "Resume" link. Replace the file to update it |

`preview.html` is a local, git-excluded copy used to publish previews. Ignore it.

There are no dependencies. Fonts come from Google Fonts (Barlow Condensed for tape labels and headings, Atkinson Hyperlegible for body text). Don't add Bootstrap, jQuery, a framework or a bundler.

## Common changes

### Add, edit or remove a drawer

A drawer is two pieces that share a slug: a button in the cabinet and a `<template>` near the end of `index.html`.

```html
<!-- In the right cabinet section -->
<button type="button" class="drawer" data-tool="go" aria-pressed="false" aria-controls="card"><span class="tape black">Go</span><span class="parts" aria-hidden="true"><i></i></span></button>

<!-- With the other templates -->
<template id="tool-go"><h2 class="card-label"><span class="tape black">Go</span></h2><p class="where">Side projects</p><p class="note">One or two plain sentences in Yaser's voice.</p><h3>Built with it</h3><ul><li><a href="https://github.com/yasersyed/REPO">REPO</a> <span>· what it is</span></li></ul></template>
```

- `data-tool="go"` must match `id="tool-go"`.
- Use one `<i></i>` in `.parts` per repo listed. The dots stand for the parts visible through the drawer.
- With no public repo, use `<li class="none">Work code, so nothing public yet.</li>`.
- The tape colour matches the section: `black` Languages, `blue` Backend, `red` Infra & cloud, `yellow` Data, `white` Frontend, `silver` Workshop.
- Only link repos that really use the tool. Check the repo first; don't guess.
- The drawer open on page load is the one with `aria-pressed="true"` (currently Rust). Its card body is also copied into `<aside id="card">`, so the page works without JavaScript. To change the default, move `aria-pressed="true"` and replace the `#card` contents with the new template's body.

### Add a project to "On the bench"

Copy one `<article class="project">` block. Each project opens with a 16:10 picture so the cards line up. Use one of:

- `<img class="shot">` for a single screenshot
- `.carousel` for several screenshots (see the Habit Tracker block)
- `<pre class="code">` for a short real code excerpt
- `.placeholder` until real material exists

Then add the tape name, one sentence, `.made` tapes for its stack, and the repo link. The grid has two columns, so keep an even count or accept one card alone in the last row.

### Screenshots

Use real screenshots only, never mocked output. Save them as WebP about 1280px wide (portrait phone shots about 780px wide), roughly quality 82. Python's Pillow works:

```python
from PIL import Image
im = Image.open("shot.png").convert("RGB")
im.resize((1280, round(im.height * 1280 / im.width))).save("out.webp", "WEBP", quality=82, method=6)
```

How the existing ones were made:

- **Habit Tracker:** run `yasersyed/habit-tracker` locally (MongoDB in Docker on 27017, backend on 5000, Vite on 3000). Register a demo user through `/api/auth/register`, then seed habits and about 90 days of records through `/api/habits` and `/api/records`. Log in with Playwright by putting the JWT in `localStorage.token`, and capture `/`, `/statistics` and `/calendar`. Leave the activity heatmap out of shots: it only counts the latest 20 records (the `/records/range` call has no `limit`).
- **CKAD Practitioner:** run `cargo build --release`, launch the binary in `tmux new-session -d -x 96 -y 28`, press `h`, capture with `tmux capture-pane -e -p`, convert the ANSI to HTML (`ansi2html`), and screenshot that with Playwright.

## Checking a change

Before committing, render the page in Chromium. Playwright is available. Use `executablePath: '/opt/pw-browsers/chromium'` in cloud sessions. Check at 1280px and 390px wide:

- no console errors or failed requests
- `document.documentElement.scrollWidth` equals the viewport width (no sideways scroll)
- clicking a drawer swaps the card

## Style and conventions

- **Copy:** plain and first person, in Yaser's voice. The drawer notes are the personality of the site, so keep them short and specific, with no marketing language. Facts must match the resume or the repos.
- **Code comments:** say why, not how, and keep them short.
- **Reuse:** extend `site.css` tokens and the existing `.tape`, `.drawer`, `.project` and carousel pieces before adding new ones.
- **One look:** the page deliberately has no light/dark switch, because it's one physical scene.
- **Contact details:** don't put a phone number or email on the page. The resume PDF has them.

## Open items

- **Nabata:** the bench card is a placeholder with TODO text. It needs screenshots, a description and a stack.
- **Drawer notes:** the notes are drafts and should be reviewed in Yaser's own words.
