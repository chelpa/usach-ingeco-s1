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

  var CAPABILITY_LABELS = {
    summary: "Resumen",
    exercises: "Ejercicios",
    "concept-map": "Mapa conceptual",
    flashcards: "Flashcards",
    "study-plan": "Plan de estudio",
    "formula-sheet": "Formulario",
    search: "Buscador",
    solutions: "Soluciones",
    navigation: "Navegación",
    quiz: "Autoevaluación",
    progress: "Progreso",
    glossary: "Glosario",
    feynman: "Explicación Feynman",
    "dark-mode": "Modo oscuro",
    code: "Código",
    checklist: "Checklist",
    practice: "Práctica"
  };

  var DASHBOARD_ACTION_LABELS = {
    summary: "Repasar",
    exercises: "Resolver ejercicios",
    flashcards: "Flashcards",
    quiz: "Quiz",
    practice: "Practicar",
    checklist: "Ver checklist",
    "study-plan": "Ver plan de estudio",
    "formula-sheet": "Ver formulario",
    solutions: "Ver soluciones",
    code: "Ver código"
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

  function assessmentsForCourse(courseId) {
    return data.assessments.filter(function (assessment) {
      return assessment.courseId === courseId;
    });
  }

  function sourceById(sourceId) {
    return data.sources.find(function (source) { return source.id === sourceId; });
  }

  function sourcesForCourse(courseId) {
    return data.sources.filter(function (source) { return source.courseId === courseId; });
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
    var activeHome = options.activeHome || false;
    var activeNotebook = options.activeNotebook || false;
    var showCourseBack = options.showCourseBack || false;
    var currentCourse = courseById(activeCourse);
    var courseLinks = data.courses.map(function (course) {
      var active = course.id === activeCourse;
      return '<a class="site-drawer-course-link' + (active ? " active" : "") + '" href="' +
        escapeHtml(joinPath(base, "courses/" + course.id + "/index.html")) + '"' +
        (active ? ' aria-current="page"' : "") + ">" +
        '<span>' + escapeHtml(course.shortName) + '</span><small>' + escapeHtml(course.name) + '</small></a>';
    }).join("");
    var contextLink = showCourseBack && currentCourse ?
      '<a class="site-nav-context" href="' + escapeHtml(joinPath(base, "courses/" + currentCourse.id + "/index.html")) + '">' +
      '← ' + escapeHtml(currentCourse.shortName) + '</a>' : "";
    var courseDrawer =
      '<button class="site-ramo-trigger" type="button" aria-haspopup="dialog" aria-expanded="false" aria-controls="site-course-drawer">☰ Ramos</button>' +
      '<div class="site-course-drawer" id="site-course-drawer" data-course-drawer aria-hidden="true">' +
      '<div class="site-course-drawer-backdrop" data-course-drawer-close aria-hidden="true"></div>' +
      '<section class="site-course-drawer-panel" role="dialog" aria-modal="true" aria-label="Ramos registrados" tabindex="-1">' +
      '<div class="site-course-drawer-heading"><div><span>Mi Semestre</span><h2>Ramos</h2></div>' +
      '<button class="site-course-drawer-close" type="button" data-course-drawer-close aria-label="Cerrar ramos">×</button></div>' +
      '<div class="site-course-drawer-list">' + courseLinks + '</div></section></div>';

    return '<div class="site-nav" data-component="global-navigation">' +
      '<div class="site-nav-inner">' +
      '<a class="brand" href="' + escapeHtml(joinPath(base, "index.html")) + '">🎓 Mi Semestre</a>' +
      '<a class="site-nav-link' + (activeHome ? " active" : "") + '" href="' +
      escapeHtml(joinPath(base, "index.html")) + '"' + (activeHome ? ' aria-current="page"' : "") + '>Inicio</a>' +
      '<a class="notebook-link' + (activeNotebook ? " active" : "") + '" href="' +
      escapeHtml(joinPath(base, "notebook.html")) + '"' + (activeNotebook ? ' aria-current="page"' : "") +
      '>Cuaderno</a>' +
      courseDrawer +
      contextLink +
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

  function renderDashboardCourseCards(options) {
    options = options || {};
    var base = options.base || "./";
    var courses = options.courses || data.courses;

    return courses.map(function (course) {
      var resources = resourcesForCourse(course.id);
      var assessments = assessmentsForCourse(course.id);
      var hasMaterial = resources.length > 0;
      var resourceLabel = resources.length === 1 ? "1 material" : resources.length + " materiales";
      var assessmentLabel = assessments.length === 1 ? "1 evaluación registrada" : assessments.length + " evaluaciones registradas";
      var placeholder = course.status === "unnamed";

      return '<article class="dashboard-course-card' + (placeholder ? " is-placeholder" : "") + '" data-course-id="' +
        escapeHtml(course.id) + '">' +
        '<div class="dashboard-course-card-top"><span class="dashboard-course-short">' + escapeHtml(course.shortName) +
        '</span>' + (placeholder ? '<span class="dashboard-course-pending">Pendiente</span>' : "") + '</div>' +
        '<h3>' + escapeHtml(course.name) + '</h3>' +
        '<p class="dashboard-course-facts"><span>' + escapeHtml(hasMaterial ? resourceLabel : "Sin material registrado") +
        '</span><span>' + escapeHtml(assessmentLabel) + '</span></p>' +
        '<div class="dashboard-course-links"><a href="' + escapeHtml(joinPath(base, "courses/" + course.id + "/index.html")) +
        '">Entrar al ramo <span aria-hidden="true">→</span></a>' +
        (hasMaterial ? '<a href="' + escapeHtml(joinPath(base, "notebook.html#curso-" + course.id)) +
          '">Ver material</a>' : "") + '</div>' +
        '</article>';
    }).join("");
  }

  function renderDashboardAssessments(options) {
    options = options || {};
    var base = options.base || "./";

    return data.assessments.map(function (assessment) {
      var course = courseById(assessment.courseId);
      var resources = (assessment.resourceIds || []).map(function (resourceId) {
        return data.resources.find(function (resource) { return resource.id === resourceId; });
      }).filter(Boolean);
      var kind = assessment.kind === "pep" ? "PEP" : assessment.kind === "assignment" ? "Trabajo" : assessment.kind;
      var date = assessment.date ? formatDate(assessment.date) : "Fecha no registrada";
      var status = STATUS_LABELS[assessment.status] || assessment.status;
      var resourceLinks = resources.map(function (resource) {
        return '<a href="' + escapeHtml(joinPath(base, resource.href)) + '">' + escapeHtml(resource.title) + '</a>';
      }).join("");

      return '<article class="dashboard-assessment-card" data-assessment-id="' + escapeHtml(assessment.id) + '">' +
        '<div class="dashboard-assessment-kicker"><span>' + escapeHtml(course ? course.shortName : assessment.courseId) +
        '</span><span>' + escapeHtml(kind) + '</span><span>' + escapeHtml(status) + '</span></div>' +
        '<h3>' + escapeHtml(assessment.title) + '</h3>' +
        '<p class="dashboard-assessment-date">' + escapeHtml(date) + '</p>' +
        '<div class="dashboard-related"><span>Material relacionado</span>' +
        (resourceLinks ? '<div>' + resourceLinks + '</div>' : '<p>Sin material relacionado registrado.</p>') + '</div>' +
        '</article>';
    }).join("");
  }

  function renderDashboardStudyActions(options) {
    options = options || {};
    var base = options.base || "./";

    return data.resources.map(function (resource) {
      var course = courseById(resource.courseId);
      var actions = (resource.capabilities || []).filter(function (capability) {
        return DASHBOARD_ACTION_LABELS[capability];
      }).map(function (capability) {
        return '<span>' + escapeHtml(DASHBOARD_ACTION_LABELS[capability]) + '</span>';
      }).join("");
      var assessmentNames = (resource.assessmentIds || []).map(function (assessmentId) {
        var assessment = assessmentById(assessmentId);
        return assessment ? assessment.title : "";
      }).filter(Boolean).join(" · ");

      return '<article class="dashboard-action-card" data-resource-id="' + escapeHtml(resource.id) + '">' +
        '<div class="dashboard-action-course">' + escapeHtml(course ? course.shortName : resource.courseId) + '</div>' +
        '<h3><a href="' + escapeHtml(joinPath(base, resource.href)) + '">' + escapeHtml(resource.title) + '</a></h3>' +
        (actions ? '<div class="dashboard-action-tags" aria-label="Acciones disponibles">' + actions + '</div>' : "") +
        (assessmentNames ? '<p class="dashboard-action-assessment">Material relacionado: ' + escapeHtml(assessmentNames) + '</p>' : "") +
        '<a class="dashboard-open-resource" href="' + escapeHtml(joinPath(base, resource.href)) + '">Abrir material <span aria-hidden="true">→</span></a>' +
        '</article>';
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

  function notebookTypeLabel(type) {
    return TYPE_LABELS[type] || type;
  }

  function notebookCapabilityLabel(capability) {
    return CAPABILITY_LABELS[capability] || capability;
  }

  function renderNotebookCourseList(options) {
    options = options || {};
    var courses = options.courses || data.courses;

    return courses.map(function (course) {
      var resources = resourcesForCourse(course.id);
      var count = resources.length;
      var countLabel = count === 1 ? "1 material" : count + " materiales";
      var availability = count ? "Material disponible" : "Sin material registrado";
      return '<a class="notebook-course-item" href="#curso-' + escapeHtml(course.id) + '" data-notebook-course="' +
        escapeHtml(course.id) + '">' +
        '<span class="notebook-course-item-mark" aria-hidden="true"></span>' +
        '<span class="notebook-course-item-copy"><strong>' + escapeHtml(course.shortName) + '</strong>' +
        '<span>' + escapeHtml(course.name) + '</span></span>' +
        '<span class="notebook-course-item-count">' + escapeHtml(countLabel) + '<small>' + availability + '</small></span>' +
        '</a>';
    }).join("");
  }

  function renderNotebookTypeSummary(options) {
    options = options || {};
    var resources = options.resources || data.resources;
    var counts = [];
    resources.forEach(function (resource) {
      var item = counts.find(function (count) { return count.type === resource.type; });
      if (!item) {
        item = { type: resource.type, count: 0 };
        counts.push(item);
      }
      item.count += 1;
    });
    return counts.map(function (item) {
      return '<li><span>' + escapeHtml(notebookTypeLabel(item.type)) + '</span><strong>' + item.count + '</strong></li>';
    }).join("");
  }

  function renderNotebookResource(resource, base) {
    var sourceRows = (resource.provenance || []).map(function (provenance) {
      var source = sourceById(provenance.sourceId);
      var label = source ? sourceLabel(source) : "Provenance pendiente";
      return '<li><span>' + escapeHtml(provenance.relation || "Fuente") + '</span>' + escapeHtml(label) + '</li>';
    }).join("");
    var assessmentRows = (resource.assessmentIds || []).map(function (assessmentId) {
      var assessment = assessmentById(assessmentId);
      if (!assessment) return "";
      return '<span class="notebook-assessment">' + escapeHtml(assessment.title +
        (assessment.date ? " · " + formatDate(assessment.date) : " · sin fecha registrada")) + '</span>';
    }).join("");
    var capabilities = (resource.capabilities || []).map(function (capability) {
      return '<span>' + escapeHtml(notebookCapabilityLabel(capability)) + '</span>';
    }).join("");

    return '<article class="notebook-resource" data-resource-id="' + escapeHtml(resource.id) + '">' +
      '<div class="notebook-resource-kicker"><span>' + escapeHtml(notebookTypeLabel(resource.type)) + '</span>' +
      '<span class="notebook-resource-status status-' + escapeHtml(resource.status) + '">' +
      escapeHtml(STATUS_LABELS[resource.status] || resource.status) + '</span></div>' +
      '<h3>' + escapeHtml(resource.title) + '</h3>' +
      '<p>' + escapeHtml(resource.description) + '</p>' +
      (capabilities ? '<div class="notebook-capabilities" aria-label="Incluye">' + capabilities + '</div>' : "") +
      '<div class="notebook-resource-foot">' +
      '<div class="notebook-provenance"><span class="notebook-meta-label">Provenencia</span>' +
      (sourceRows ? '<ul>' + sourceRows + '</ul>' : '<p>Provenance pendiente</p>') +
      (assessmentRows ? '<div class="notebook-assessments"><span class="notebook-meta-label">Relacionada con</span>' + assessmentRows + '</div>' : "") +
      '</div>' +
      '<a class="notebook-open" href="' + escapeHtml(joinPath(base, resource.href)) + '">Abrir recurso <span aria-hidden="true">→</span></a>' +
      '</div></article>';
  }

  function renderNotebookCourse(options) {
    options = options || {};
    var course = courseById(options.courseId);
    var base = options.base || "./";
    if (!course) return "";
    var resources = resourcesForCourse(course.id);
    var assessments = assessmentsForCourse(course.id);
    var groups = [];
    resources.forEach(function (resource) {
      var group = groups.find(function (item) { return item.type === resource.type; });
      if (!group) {
        group = { type: resource.type, resources: [] };
        groups.push(group);
      }
      group.resources.push(resource);
    });
    var assessmentContext = assessments.map(function (assessment) {
      var date = assessment.date ? formatDate(assessment.date) : "Sin fecha registrada";
      return '<li><strong>' + escapeHtml(assessment.title) + '</strong><span>' + escapeHtml(date) + '</span></li>';
    }).join("");
    var groupMarkup = groups.map(function (group) {
      return '<section class="notebook-resource-group"><h3>' + escapeHtml(notebookTypeLabel(group.type)) +
        '<span>' + group.resources.length + '</span></h3>' +
        group.resources.map(function (resource) { return renderNotebookResource(resource, base); }).join("") + '</section>';
    }).join("");

    return '<section class="notebook-course-sheet" id="curso-' + escapeHtml(course.id) + '" data-notebook-sheet="' +
      escapeHtml(course.id) + '" tabindex="-1">' +
      '<header class="notebook-course-heading"><div><p class="notebook-overline">Curso · ' +
      escapeHtml(course.status === "unnamed" ? "pendiente de definir" : "material de estudio") + '</p>' +
      '<h2>' + escapeHtml(course.name) + '</h2><p>' + escapeHtml(course.shortName) + ' · ' +
      escapeHtml(resources.length === 1 ? "1 material registrado" : resources.length + " materiales registrados") +
      '</p></div><a href="courses/' + escapeHtml(course.id) + '/index.html" class="notebook-course-page">Ver índice del curso</a></header>' +
      (assessments.length ? '<aside class="notebook-assessment-context"><span class="notebook-meta-label">Contexto de evaluación conocido</span><ul>' + assessmentContext + '</ul></aside>' : "") +
      (resources.length ? '<div class="notebook-resource-groups">' + groupMarkup + '</div>' :
        '<div class="notebook-placeholder"><p class="notebook-overline">Sin material registrado</p><h3>Este ramo permanece como marcador de posición.</h3><p>Aún no hay recursos ni procedencia asociados en el registro.</p></div>') +
      '</section>';
  }

  window.MI_COMPONENTS = {
    assessmentsForCourse: assessmentsForCourse,
    assessmentById: assessmentById,
    courseById: courseById,
    escapeHtml: escapeHtml,
    renderDashboardAssessments: renderDashboardAssessments,
    renderDashboardCourseCards: renderDashboardCourseCards,
    renderDashboardStudyActions: renderDashboardStudyActions,
    renderAssessmentBadges: renderAssessmentBadges,
    renderCourseCards: renderCourseCards,
    renderCourseMaterials: renderCourseMaterials,
    renderGlobalNavigation: renderGlobalNavigation,
    renderNotebookCourse: renderNotebookCourse,
    renderNotebookCourseList: renderNotebookCourseList,
    renderNotebookTypeSummary: renderNotebookTypeSummary,
    renderProvenanceBadges: renderProvenanceBadges,
    renderResourceCards: renderResourceCards,
    resourcesForCourse: resourcesForCourse,
    sourceById: sourceById,
    sourcesForCourse: sourcesForCourse
  };
})();
