# Jiaqi Zheng Personal Academic Site

A minimalist yet playful academic homepage balancing professional presentation with soft, kawaii-inspired aesthetics (Hello Kitty pink + Gojo Satoru blue accents) while avoiding direct use of copyrighted character artwork.

## Structure
```
index.html
style.css
script.js
components/
  navigation.css
  header.css
  footer.css
pages/
  about.html
  research.html
  publications.html
  teaching.html
  contact.html
assets/
  images/ (subfolders: hello-kitty, gojo, profile, icons)
  fonts/
  documents/
    cv.pdf (add your CV)
    research-papers/
```

## Theming
- Primary Pink: #FFB6C1
- Accent Blue: #87CEEB
- Neutral Text: #333
- Light Background: #FAFAFA

Gradients blend pink → blue for subtle energy without overwhelming academic readability.

## Content To Fill
Update placeholder text in:
- `index.html` hero (research interests, stats numbers, news list)
- `pages/*.html` sections (education, publications, courses, links)
- Add real PDF to `assets/documents/cv.pdf`
- Replace placeholder images (ensure license compliance). Use your own illustrations or royalty-free substitutes.

## Accessibility & Performance Notes
- Semantic landmarks (header / nav / main / footer)
- Skip link included
- Responsive navigation (CSS + small JS)
- Avoid heavy image assets; compress with 70–80% quality JPEG or AVIF/WebP

## Deployment
This folder is inside a GitHub Pages repository (`username.github.io`). Ensure links are relative (`./` or no leading slash) so subdirectory hosting works.

## Future Enhancements
- Add dark mode toggle
- Publication BibTeX modal viewer
- Google Scholar & ORCID automatic badges
- Simple blog (e.g., `pages/blog/` + markdown → HTML build script)

## License
You own your original content. Do not commit unlicensed character artwork. Use stylized abstract motifs instead.
