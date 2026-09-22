/**
 * Shared global navigation.
 *
 * Existing resource pages already load this file directly. To keep those
 * pages unchanged while moving course metadata into the registry, the
 * registry and rendering primitives are loaded synchronously when needed.
 */
(function () {
  var script = document.currentScript;
  var base = script.getAttribute("data-base") || "./";

  if (!window.MI_SEMESTRE_DATA) {
    document.write('<script src="' + base + 'data/site-data.js"></script>');
  }
  if (!window.MI_COMPONENTS) {
    document.write('<script src="' + base + 'assets/components.js"></script>');
  }

  var data = window.MI_SEMESTRE_DATA;
  var components = window.MI_COMPONENTS;
  var active = script.getAttribute("data-course") || "";

  if (!data || !components) {
    throw new Error("Mi Semestre shared registry could not be loaded");
  }

  // Backwards compatibility for existing pages that read SITE_COURSES.
  window.SITE_COURSES = data.courses;
  script.insertAdjacentHTML("afterend", components.renderGlobalNavigation({
    base: base,
    activeCourse: active
  }));
})();
