window.MathJax = {
  tex2jax: {
    inlineMath: [['$','$'], ['\\(','\\)']],
    skipTags: ['script', 'noscript', 'style', 'textarea'],
  },
  TeX: {
    Macros: {
      defeq: "\\triangleq",
      coleq: "\\texttt{:-}",
      reals: "\\mathbb{R}",
      set: ["\\left\\{#1\\right\\}", 1],
      setst: ["\\left\\{#1 \\,\\middle|\\, #2\\right\\}", 2],
      parens: ["\\left(#1\\right)", 1],
      norm: ["\\left\\lVert#1\\right\\rVert", 1],
      twonorm: ["\\norm{#1}_2", 1],
    },
  },
};
