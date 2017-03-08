window.MathJax = {
  tex2jax: {
    inlineMath: [['$','$'], ['\\(','\\)']],
    skipTags: ['script', 'noscript', 'style', 'textarea'],
  },
  TeX: {
    Macros: {
      set: ["\\left\\{#1\\right\\}", 1],
      defeq: "\\triangleq",
      coleq: "\\texttt{:-}",
    },
  },
};
