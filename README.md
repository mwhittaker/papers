# [Papers](https://mwhittaker.github.io/papers)
This repository is a compendium of notes on papers I've read.

## Getting Started
If you want to read the paper summaries, simply go
[here](https://mwhittaker.github.io/papers). If you want to add a paper
summary, or clone this repo and create summaries of your own, here's how
everything works.

- First, add your summary as a markdown file in [the `papers`
  directory](papers/).
- Run `make` to convert each markdown file `foo.md` into an HTML file
  `foo.html` using `pandoc`.
- Then, update [`index.html`](index.html) with a link to the HTML file (e.g.
  `foo.html`)

It's as simple as that. Oh, and if you want to include MathJax in your summary,
add the following to the bottom of the markdown file:

```html
<script type="text/javascript" async
  src="https://cdnjs.cloudflare.com/ajax/libs/mathjax/2.7.1/MathJax.js?config=TeX-MML-AM_CHTML">
</script>
```

If you want to add syntax highlighting, add this:

```html
<link href='../css/default_highlight.css' rel='stylesheet'>
<script src="../js/highlight.pack.js"></script>
<script>hljs.initHighlightingOnLoad();</script>
```
