# resume.kcemanes.com

My resume, as a static site. Built with [Astro](https://astro.build), TypeScript and
Tailwind CSS; deployed to GitHub Pages.

**Live:** <https://resume.kcemanes.com>

## Editing the resume

All content lives in one file: [`src/data/resume.yml`](src/data/resume.yml). Nothing else
needs to change to update the resume.

The file is validated against a [Zod](https://zod.dev) schema
([`src/lib/schema.ts`](src/lib/schema.ts)) at build time, so a typo, a misspelled key or a
missing required field **fails the build** with the offending path — rather than silently
rendering an empty section.

Bullet points take either form:

```yaml
highlights:
  - A single point with no sub-points.
  - text: A point that has sub-points.
    children:
      - First sub-point.
      - Second sub-point.
```

Years can be written bare (`time: 2019`) or quoted — both are accepted.

## Development

Requires Node 22 (see [`.nvmrc`](.nvmrc)).

```bash
npm install
npm run dev      # http://localhost:4321
npm run build    # type-check, validate data, build to dist/
npm run preview  # serve dist/ locally
npm run format   # prettier
```

## PDF

Press **PDF** in the top-right (or just Ctrl/Cmd-P). The print stylesheet re-lays the page
for A4: **a single column**, with the teal sidebar becoming a plain full-width header band,
the photo and controls hidden, and the light theme forced regardless of what is on screen.

There is no separate print page and no PDF library: it is the same document, restyled by
`@media print`.

## ATS notes (read before changing the print CSS)

The exported PDF is meant to survive an Applicant Tracking System, which parses the PDF's
**linear text stream**. Three rules keep that stream readable, each one verified by
extracting text from a generated PDF:

1. **Nothing in the print flow may be positioned.** A `position: relative`/`absolute`
   element paints _after_ its in-flow siblings in the same stacking context, and Chrome
   writes it to the PDF in paint order — so a positioned block's text lands out of
   sequence. The experience entries are `relative` on screen for the timeline rail and
   `print:static` on paper for exactly this reason. Symptom when broken: sections come out
   scrambled (Education and Skills emitted ahead of the last two roles).
2. **No wide `letter-spacing` in print.** `tracking-[0.16em]` makes Chrome emit one glyph
   at a time, so `EDUCATION` extracts as `E D U CAT I O N` and no parser can match it to a
   known section heading. Headings use `print:tracking-normal`.
3. **Print is one column.** A single flow guarantees the text stream matches document
   order. Every section lives in the main flow — Education included, which is why it is
   _not_ in the sidebar component.

`break-inside: avoid` is safe _given rule 1_ and is used to stop entries splitting mid-page;
it was verified not to reorder the stream once nothing was positioned.

Contact rows also render a plain-text label (`Email:`, `LinkedIn:`) in print, since a parser
cannot read the inline SVG icons used on screen.

## Layout

```
src/
  data/resume.yml       all content
  lib/schema.ts         Zod schema — the contract for resume.yml
  lib/resume.ts         parse + validate at build time
  layouts/Base.astro    <head>, SEO meta, JSON-LD, no-flash theme script
  components/           Sidebar, Section, ExperienceItem, Toolbar, Icon
  styles/global.css     design tokens, dark mode, print stylesheet
  styles/fonts.css      Inter, latin subset only
public/                 CNAME, favicon, robots.txt
```

## Notes

- **No client-side framework.** The only JavaScript is the theme toggle and print handler,
  inlined into the HTML (well under 1 KB). Everything else is static.
- **No third-party requests.** The font is self-hosted and icons are inline SVG, so the
  page loads nothing from a CDN and sets no cookies.
- **Accessibility.** Semantic landmarks, a skip link, visible focus rings, and all text
  meets WCAG AA contrast in both themes.
- **SEO.** Canonical URL, Open Graph tags, `sitemap.xml`, `robots.txt`, and a
  schema.org `Person` graph built from the resume data (skills, credentials, education).
- The build is ~145 KB total, most of which is the 48 KB font.

## License

The code in this repository is MIT licensed (see [LICENSE.md](LICENSE.md)). The resume
content itself — text, photo — is not.
