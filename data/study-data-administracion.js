/* Chapter 1 study-state targets. Academic wording lives in the LessonBundle. */
(function (root) {
  var model = {
    schemaVersion: 1,
    courseId: "administracion",
    lessonId: "administracion-chiavenato-cap1",
    sourceResourceId: "administracion-chiavenato-cap1",
    units: [
      { id: "admin-chiavenato-cap1", title: "Capítulo 1 · La administración y sus perspectivas", order: 1 }
    ],
    concepts: [
      { id: "admin-concepto-administracion", unitId: "admin-chiavenato-cap1" },
      { id: "admin-ciencia-tecnologia-arte", unitId: "admin-chiavenato-cap1" },
      { id: "admin-teorias-enfasis", unitId: "admin-chiavenato-cap1" },
      { id: "admin-seis-variables-tga", unitId: "admin-chiavenato-cap1" },
      { id: "admin-perspectivas", unitId: "admin-chiavenato-cap1" }
    ],
    skills: [],
    relations: [],
    activityDefinitions: [
      {
        id: "admin-recordar-variables", unitId: "admin-chiavenato-cap1", kind: "self-check",
        title: "Recordar y explicar las seis variables de la TGA",
        resourceId: "administracion-chiavenato-cap1",
        lessonExerciseId: "exercise-variables",
        targets: [{ kind: "concept", id: "admin-seis-variables-tga" }]
      }
    ]
  };

  if (typeof module === "object" && module.exports) module.exports = model;
  if (root) root.MI_SEMESTRE_STUDY_DATA = model;
})(typeof window !== "undefined" ? window : null);
