/*!
 * Zakaria Boulgarne — Portfolio
 * Navbar shrink au scroll + animation réseau (canvas) dans le header
 */

// ----- Navbar : rétrécit + s'assombrit au scroll -----
(function () {
  const nav = document.getElementById("mainNav");
  if (!nav) return;

  const toggle = () => {
    if (window.scrollY > 50) {
      nav.classList.add("navbar-shrink");
    } else {
      nav.classList.remove("navbar-shrink");
    }
  };

  toggle();
  window.addEventListener("scroll", toggle);

  // Ferme le menu mobile après clic sur un lien
  document.querySelectorAll("#navbarResponsive .nav-link").forEach((link) => {
    link.addEventListener("click", () => {
      const collapse = document.getElementById("navbarResponsive");
      if (collapse && collapse.classList.contains("show") && window.bootstrap) {
        window.bootstrap.Collapse.getOrCreateInstance(collapse).hide();
      }
    });
  });
})();

// ----- Animation réseau (canvas) dans le header -----
(function () {
  const canvas = document.getElementById("network-canvas");
  if (!canvas) return;

  const ctx = canvas.getContext("2d");
  const prefersReducedMotion = window.matchMedia(
    "(prefers-reduced-motion: reduce)"
  ).matches;

  let width, height, nodes;
  const LINK_DISTANCE = 150;
  const NODE_COLOR = "63, 215, 201";

  function resize() {
    const rect = canvas.parentElement.getBoundingClientRect();
    width = canvas.width = rect.width;
    height = canvas.height = rect.height;
  }

  function createNodes() {
    const count = Math.max(28, Math.min(70, Math.floor((width * height) / 22000)));
    nodes = Array.from({ length: count }, () => ({
      x: Math.random() * width,
      y: Math.random() * height,
      vx: (Math.random() - 0.5) * 0.35,
      vy: (Math.random() - 0.5) * 0.35,
      r: Math.random() * 1.6 + 0.8,
    }));
  }

  function step() {
    ctx.clearRect(0, 0, width, height);

    // liens
    for (let i = 0; i < nodes.length; i++) {
      for (let j = i + 1; j < nodes.length; j++) {
        const a = nodes[i];
        const b = nodes[j];
        const dx = a.x - b.x;
        const dy = a.y - b.y;
        const dist = Math.sqrt(dx * dx + dy * dy);
        if (dist < LINK_DISTANCE) {
          const opacity = 0.16 * (1 - dist / LINK_DISTANCE);
          ctx.strokeStyle = `rgba(${NODE_COLOR}, ${opacity})`;
          ctx.lineWidth = 1;
          ctx.beginPath();
          ctx.moveTo(a.x, a.y);
          ctx.lineTo(b.x, b.y);
          ctx.stroke();
        }
      }
    }

    // noeuds
    nodes.forEach((n) => {
      ctx.beginPath();
      ctx.fillStyle = `rgba(${NODE_COLOR}, 0.85)`;
      ctx.arc(n.x, n.y, n.r, 0, Math.PI * 2);
      ctx.fill();

      if (!prefersReducedMotion) {
        n.x += n.vx;
        n.y += n.vy;

        if (n.x < 0 || n.x > width) n.vx *= -1;
        if (n.y < 0 || n.y > height) n.vy *= -1;
      }
    });

    if (!prefersReducedMotion) {
      requestAnimationFrame(step);
    }
  }

  function init() {
    resize();
    createNodes();
    step();
  }

  window.addEventListener("resize", () => {
    resize();
    createNodes();
    if (prefersReducedMotion) step();
  });

  init();
})();
