/**
 * Shared top navbar for every page of the site.
 *
 * HOW TO RENAME / REORDER YOUR 7 COURSES:
 *   Just edit the COURSES array below. `id` MUST match the folder name
 *   under /courses/ (e.g. id "maye1" -> folder /courses/maye1/).
 *   `short` shows in the navbar, `name` is the full name used on course
 *   home pages and the landing page.
 *
 * HOW EACH PAGE USES THIS FILE:
 *   <script src="<path-to-assets>/nav.js" data-base="<relative-path-to-site-root>" data-course="<course-id-or-empty>"></script>
 *
 *   - data-base: relative path back to the repo root from THIS file.
 *     Root index.html            -> data-base="./"
 *     courses/<id>/index.html    -> data-base="../../"
 *     courses/<id>/anything.html -> data-base="../../"
 *   - data-course: the course `id` this page belongs to (used to
 *     highlight it in the navbar). Leave empty ("") on the landing page.
 */
(function () {
  var COURSES = [
    { id: "maye1", short: "MAyE I", name: "Matemáticas para la Administración y Economía I" },
    { id: "contabilidad", short: "Contabilidad", name: "Contabilidad General" },
    { id: "economia", short: "Economía", name: "Introducción a la Economía" },
    { id: "administracion", short: "Administración", name: "Administración" },
    { id: "computacion", short: "Computación", name: "Computación" },
    { id: "ramo6", short: "Ramo 6", name: "Ramo 6 (pendiente)" },
    { id: "ramo7", short: "Ramo 7", name: "Ramo 7 (pendiente)" }
  ];

  // Expose so other pages (e.g. the landing page) can build course cards
  // from the same single source of truth without duplicating the list.
  window.SITE_COURSES = COURSES;

  var script = document.currentScript;
  var base = script.getAttribute("data-base") || "./";
  var active = script.getAttribute("data-course") || "";

  var links = COURSES.map(function (c) {
    var cls = c.id === active ? ' class="active"' : "";
    return (
      '<a href="' + base + "courses/" + c.id + '/index.html"' + cls + ">" + c.short + "</a>"
    );
  }).join("");

  var html =
    '<div class="utility-bar">' +
    '<div class="wrap">' +
    '<span>APUNTES PERSONALES · SEGUNDO SEMESTRE 2026</span>' +
    '<span class="u-links"><a href="' + base + 'index.html">Inicio</a></span>' +
    "</div>" +
    "</div>" +
    '<div class="site-nav">' +
    '<div class="site-nav-inner wrap">' +
    '<a class="brand" href="' + base + 'index.html">🎓 Mi Semestre</a>' +
    /* Deliberately a <div>, not a semantic <nav> tag: some imported pages
       (e.g. the Computación guide) define bare `nav{...}` element styles
       for their own sidebar, which would otherwise leak onto this menu. */
    '<div class="course-links">' + links + "</div>" +
    "</div>" +
    "</div>";

  script.insertAdjacentHTML("afterend", html);
})();
