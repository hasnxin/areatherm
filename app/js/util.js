/* AreaTherm — small shared UI helpers. */
window.U = {
  n(x, d) { d = d == null ? 1 : d; return Number.isFinite(x) ? x.toFixed(d) : "—"; },
  qs(sel, root) { return (root || document).querySelector(sel); },
  qsa(sel, root) { return Array.from((root || document).querySelectorAll(sel)); },
  on(sel, evt, fn, root) { const e = this.qs(sel, root); if (e) e.addEventListener(evt, fn); },
  esc(s) { return String(s).replace(/[&<>"]/g, c => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" }[c])); }
};
