window.MathJax = {
  tex2jax: {
    inlineMath: [['$','$'], ['\\(','\\)']],
    skipTags: ['script', 'noscript', 'style', 'textarea'],
  },
  TeX: {
    Macros: {
      set: ["\\left\\{#1\\right\\}", 1],
      setst: ["\\left\\{#1 \\,\\middle|\\, #2\\right\\}", 2],
      parens: ["\\left(#1\\right)", 1],
      reals: "\\mathbb{R}",
      nats: "\\mathbb{N}",
      rats: "\\mathbb{Q}",
      ints: "\\mathbb{Z}",
      defeq: "\\triangleq",
      coleq: "\\texttt{:-}",
      norm: ["\\left\\lVert#1\\right\\rVert", 1],
      twonorm: ["\\norm{#1}_2", 1],
    },
  },
};
