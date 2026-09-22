/* Static study definitions. Academic facts remain in site-data.js. */
(function (root) {
  var model = {
    schemaVersion: 1,
    courseId: "contabilidad",
    sourceResourceId: "contabilidad-kit-estudio",
    units: [
      { id: "conta-ajustes-ppe", title: "Ajustes de cierre y PPE", order: 1 }
    ],
    concepts: [
      { id: "conta-devengo", unitId: "conta-ajustes-ppe", title: "Base de devengo" },
      { id: "conta-regularizaciones", unitId: "conta-ajustes-ppe", title: "Regularizaciones periódicas" },
      { id: "conta-reconocimiento-ppe", unitId: "conta-ajustes-ppe", title: "Reconocimiento de PPE" },
      { id: "conta-depreciacion-ppe", unitId: "conta-ajustes-ppe", title: "Depreciación de PPE" }
    ],
    skills: [],
    relations: [
      {
        type: "requires",
        from: { kind: "concept", id: "conta-regularizaciones" },
        to: { kind: "concept", id: "conta-devengo" }
      }
    ],
    activityDefinitions: [
      {
        id: "conta-auto-evaluar-devengo",
        unitId: "conta-ajustes-ppe",
        kind: "self-check",
        title: "Autoevaluar la base de devengo",
        resourceId: "contabilidad-kit-estudio",
        targets: [{ kind: "concept", id: "conta-devengo" }]
      }
    ]
  };

  if (typeof module === "object" && module.exports) module.exports = model;
  if (root) root.MI_SEMESTRE_STUDY_DATA = model;
})(typeof window !== "undefined" ? window : null);
