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
  var active = script.getAttribute("data-course") || "";
  var activeNotebook = script.getAttribute("data-notebook") === "true";
  var resourceContext = script.getAttribute("data-resource") === "true";

  function renderNavigation() {
    var data = window.MI_SEMESTRE_DATA;
    var components = window.MI_COMPONENTS;
    if (!data || !components) {
      throw new Error("Mi Semestre shared registry could not be loaded");
    }

    // Backwards compatibility for existing pages that read SITE_COURSES.
    window.SITE_COURSES = data.courses;
    script.insertAdjacentHTML("afterend", components.renderGlobalNavigation({
      base: base,
      activeCourse: active,
      activeNotebook: activeNotebook,
      showCourseBack: resourceContext
    }));

    var navigation = script.nextElementSibling;
    function setNavigationHeight() {
      document.documentElement.style.setProperty("--mi-semestre-nav-height", navigation.offsetHeight + "px");
    }
    setNavigationHeight();
    if (window.ResizeObserver) {
      new ResizeObserver(setNavigationHeight).observe(navigation);
    } else {
      window.addEventListener("resize", setNavigationHeight);
    }

    var trigger = navigation.querySelector(".site-ramo-trigger");
    var drawer = navigation.querySelector("[data-course-drawer]");
    if (!trigger || !drawer) return;
    var drawerPanel = navigation.querySelector(".site-course-drawer-panel");
    var lastFocusedElement = null;

    function closeDrawer() {
      drawer.classList.remove("is-open");
      drawer.setAttribute("aria-hidden", "true");
      trigger.setAttribute("aria-expanded", "false");
      document.body.classList.remove("course-drawer-open");
      if (lastFocusedElement) lastFocusedElement.focus();
    }

    function openDrawer() {
      lastFocusedElement = document.activeElement;
      drawer.classList.add("is-open");
      drawer.setAttribute("aria-hidden", "false");
      trigger.setAttribute("aria-expanded", "true");
      document.body.classList.add("course-drawer-open");
      drawerPanel.focus();
    }

    trigger.addEventListener("click", function () {
      if (drawer.classList.contains("is-open")) closeDrawer(); else openDrawer();
    });
    drawer.querySelectorAll("[data-course-drawer-close]").forEach(function (closeControl) {
      closeControl.addEventListener("click", closeDrawer);
    });
    drawer.querySelectorAll(".site-drawer-course-link").forEach(function (courseLink) {
      courseLink.addEventListener("click", closeDrawer);
    });
    document.addEventListener("keydown", function (event) {
      if (!drawer.classList.contains("is-open")) return;
      if (event.key === "Escape") {
        event.preventDefault();
        closeDrawer();
      }
      if (event.key === "Tab") {
        var focusable = drawerPanel.querySelectorAll("button, [href]");
        var first = focusable[0];
        var last = focusable[focusable.length - 1];
        if (event.shiftKey && document.activeElement === first) {
          event.preventDefault(); last.focus();
        } else if (!event.shiftKey && document.activeElement === last) {
          event.preventDefault(); first.focus();
        }
      }
    });
  }

  if (window.MI_SEMESTRE_DATA && window.MI_COMPONENTS) {
    renderNavigation();
  } else {
    // Resource pages load this shell directly. Queue the renderer after the
    // document-written dependencies so it runs only once both are available.
    window.MI_SEMESTRE_RENDER_NAVIGATION = renderNavigation;
    if (!window.MI_SEMESTRE_DATA) {
      document.write('<script src="' + base + 'data/site-data.js"></script>');
    }
    if (!window.MI_COMPONENTS) {
      document.write('<script src="' + base + 'assets/components.js"></script>');
    }
    document.write('<script>window.MI_SEMESTRE_RENDER_NAVIGATION();</script>');
  }
})();
