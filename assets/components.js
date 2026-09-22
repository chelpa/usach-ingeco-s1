/* Shared rendering primitives for the static Mi Semestre application. */
(function () {
  var data = window.MI_SEMESTRE_DATA;

  if (!data) {
    throw new Error("MI_SEMESTRE_DATA must be loaded before components.js");
  }

  var TYPE_LABELS = {
    summary: "Resumen",
    compendium: "Compendio",
    "study-kit": "Kit de estudio",
    "interactive-guide": "Guía interactiva",
    "official-guide": "Guía oficial",
    "solution-manual": "Solucionario",
    practice: "Práctica",
    reference: "Referencia"
  };

  var STATUS_LABELS = {
    published: "Disponible",
    archived: "Versión anterior",
    draft: "Borrador",
    documented: "Registrada",
    undated: "Sin fecha registrada"
  };

  function escapeHtml(value) {
    return String(value == null ? "" : value)
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;")
      .replace(/'/g, "&#39;");
  }

  function courseById(courseId) {
    return data.courses.find(function (course) { return course.id === courseId; });
  }

  function resourcesForCourse(courseId) {
    return data.resources
      .filter(function (resource) { return resource.courseId === courseId; })
      .sort(function (a, b) { return (a.displayOrder || 0) - (b.displayOrder || 0); });
  }

  function assessmentById(assessmentId) {
    return data.assessments.find(function (assessment) { return assessment.id === assessmentId; });
  }

  function sourceById(sourceId) {
    return data.sources.find(function (source) { return source.id === sourceId; });
  }

  function joinPath(base, href) {
    var cleanBase = base || "./";
    if (cleanBase.slice(-1) !== "/") cleanBase += "/";
    return cleanBase + String(href).replace(/^\.\//, "");
  }

  function sourceLabel(source) {
    if (!source) return "Provenance pendiente";
    var parts = [source.title];
    if (source.institution) parts.push(source.institution);
    return parts.filter(Boolean).join(" · ");
  }

  function formatDate(date) {
    if (!date) return "";
    var parts = date.split("-");
    if (parts.length !== 3) return date;
    var months = ["ene", "feb", "mar", "abr", "may", "jun", "jul", "ago", "sep", "oct", "nov", "dic"];
    return parts[2].replace(/^0/, "") + " " + months[Number(parts[1]) - 1] + " " + parts[0];
  }

  function renderGlobalNavigation(options) {
    options = options || {};
    var base = options.base || "./";
    var activeCourse = options.activeCourse || "";
    var links = data.courses.map(function (course) {
      var active = course.id === activeCourse;
      return '<a href="' + escapeHtml(joinPath(base, "courses/" + course.id + "/index.html")) + '"' +
        (active ? ' class="active" aria-current="page"' : "") + ">" +
        escapeHtml(course.shortName) + "</a>";
    }).join("");

    return '<div class="site-nav" data-component="global-navigation">' +
      '<div class="site-nav-inner">' +
      '<a class="brand" href="' + escapeHtml(joinPath(base, "index.html")) + '">🎓 Mi Semestre</a>' +
      '<div class="course-links" aria-label="Cursos">' + links + "</div>" +
      '<span class="sem-label">2° SEMESTRE 2026</span>' +
      "</div>" +
      "</div>";
  }

  function renderCourseCards(options) {
    options = options || {};
    var base = options.base || "./";
    var courses = options.courses || data.courses;

    return courses.map(function (course) {
      var resources = resourcesForCourse(course.id);
      var available = resources.filter(function (resource) {
        return resource.status === "published" || resource.status === "archived";
      });
      var ready = available.length > 0;
      var countLabel = available.length === 1 ? "1 recurso" : available.length + " recursos";

      return '<a class="course-card" href="' +
        escapeHtml(joinPath(base, "courses/" + course.id + "/index.html")) + '"' +
        ' data-course-id="' + escapeHtml(course.id) + '">' +
        '<span class="short">' + escapeHtml(course.shortName) + "</span>" +
        '<div class="name">' + escapeHtml(course.name) + "</div>" +
        '<div class="status' + (ready ? " ready" : "") + '">' +
        (ready ? "✓ Material disponible · " + countLabel : "Próximamente") +
        "</div>" +
        "</a>";
    }).join("");
  }

  function renderProvenanceBadges(resource) {
    var badges = (resource.provenance || []).map(function (provenance) {
      var source = sourceById(provenance.sourceId);
      return '<span class="meta-badge provenance-badge" title="' +
        escapeHtml(sourceLabel(source)) + '">Fuente: ' +
        escapeHtml(source ? source.title : "pendiente") + "</span>";
    });

    if (!badges.length) {
      badges.push('<span class="meta-badge provenance-badge">Provenance pendiente</span>');
    }

    return badges.join("");
  }

  function renderAssessmentBadges(resource) {
    return (resource.assessmentIds || []).map(function (assessmentId) {
      var assessment = assessmentById(assessmentId);
      if (!assessment) return "";
      var date = assessment.date ? " · " + formatDate(assessment.date) : "";
      return '<span class="meta-badge assessment-badge">Evaluación: ' +
        escapeHtml(assessment.title + date) + "</span>";
    }).join("");
  }

  function renderResourceCards(options) {
    options = options || {};
    var base = options.base || "./";
    var resources = resourcesForCourse(options.courseId);

    return resources.map(function (resource) {
      var typeLabel = TYPE_LABELS[resource.type] || resource.type;
      var statusLabel = STATUS_LABELS[resource.status] || resource.status;
      var statusClass = resource.status === "published" ? "" : " status-" + resource.status;
      var badges = renderProvenanceBadges(resource) + renderAssessmentBadges(resource);

      return '<a class="resource-card" href="' + escapeHtml(joinPath(base, resource.href)) +
        '" data-resource-id="' + escapeHtml(resource.id) + '">' +
        '<div>' +
        '<div class="rtitle">' + escapeHtml(resource.title) + "</div>" +
        '<div class="rdesc">' + escapeHtml(resource.description) + "</div>" +
        '<div class="resource-meta" aria-label="Metadatos del recurso">' +
        '<span class="meta-badge type-badge">' + escapeHtml(typeLabel) + "</span>" +
        '<span class="meta-badge status-badge' + statusClass + '">' + escapeHtml(statusLabel) + "</span>" +
        badges +
        "</div>" +
        "</div>" +
        '<div class="rarrow" aria-hidden="true">→</div>' +
        "</a>";
    }).join("");
  }

  function renderCourseMaterials(options) {
    options = options || {};
    var resources = resourcesForCourse(options.courseId);

    if (resources.length) {
      return renderResourceCards(options);
    }

    return '<div class="empty-state">' +
      'Aún no hay material subido para este ramo.<br>' +
      'Cuando tengas apuntes, guías o quieras un resumen para una prueba, súbelos y los convertimos en una página como la de PEP 2 de MAyE I.' +
      '</div>';
  }

  window.MI_COMPONENTS = {
    assessmentById: assessmentById,
    courseById: courseById,
    escapeHtml: escapeHtml,
    renderAssessmentBadges: renderAssessmentBadges,
    renderCourseCards: renderCourseCards,
    renderCourseMaterials: renderCourseMaterials,
    renderGlobalNavigation: renderGlobalNavigation,
    renderProvenanceBadges: renderProvenanceBadges,
    renderResourceCards: renderResourceCards,
    resourcesForCourse: resourcesForCourse,
    sourceById: sourceById
  };
})();
