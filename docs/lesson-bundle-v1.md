# LessonBundle v1

`LessonBundle` is source-grounded teaching content. The Chapter 1 specimen is `data/lesson-bundle-administracion.js`. It is plain JavaScript data that can be loaded by the static site or by Node; it has no runtime, API, or student state.

## Required shape

- `schemaVersion: 1`, stable `lessonId`, `courseId`, and `title`.
- `source`: accredited `sourceId`, SHA-256, and inclusive printed/PDF page bounds. It contains no local filesystem path.
- `sourceRefs`: named chapter locations, each with an exact heading and inclusive printed/PDF page bounds.
- `overview`, `objectives`, `summary`, `sections`, `concepts`, `conceptMap`, `examples`, `flashcards`, `exercises`, `quiz`, and `glossary`: concise pedagogical content. Every content record, including map nodes and links, has nonempty `refs` resolving to `sourceRefs`.
- `capabilities`: the content sections actually present, for display and discovery.

The specimen uses concept IDs shared with the Administración StudyModel. These IDs are references, not duplicate academic definitions. An ActivityDefinition may carry `lessonExerciseId` to select a LessonBundle exercise; its Evidence target remains a StudyModel `TargetRef`.

## Boundary

Professor Hub / learning content owns the bundle, its academic wording, and provenance. Mi Semestre owns course and unit context, ActivityDefinition, immutable Evidence, derived MemoryState, and the bitácora. A bundle has no learner ID, response history, score, mastery assertion, or persistence behavior. The revealable lesson quiz is practice content; it writes no Evidence.

`node scripts/validate-lesson.mjs` checks the v1 shape and the current Chapter 1 source identity, page scope, source references, and StudyModel links. It does not claim to prove scholarly correctness; the RAW source and human review remain authoritative.
