#!/usr/bin/env node

import fs from "node:fs";
import path from "node:path";
import vm from "node:vm";
import { createRequire } from "node:module";
import { fileURLToPath } from "node:url";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const require = createRequire(import.meta.url);
const expectedDigest = "6b076dbd35e1150716f460ee7b28bc06a7b6dad7eb7541c190bd68872efbed47";
const contentFields = ["objectives", "summary", "sections", "concepts", "examples", "flashcards", "exercises", "quiz", "glossary"];
const capabilities = ["overview", "objectives", "summary", "sections", "concept-map", "examples", "flashcards", "exercises", "quiz", "glossary"];

function validateLesson(bundle, model, registry) {
  function fail(message) { throw new Error("LessonBundle: " + message); }
  function nonEmpty(value) { return typeof value === "string" && value.trim().length > 0; }
  function sameIds(left, right) {
    return left.length === right.length && left.every((id) => right.includes(id));
  }
  function requireRefs(item, label) {
    if (!Array.isArray(item.refs) || !item.refs.length ||
        item.refs.some((id) => !Object.hasOwn(bundle.sourceRefs, id))) fail(label + " has unresolved source refs");
  }
  if (!bundle || bundle.schemaVersion !== 1) fail("unsupported schemaVersion");
  const v1Fields = ["schemaVersion", "lessonId", "courseId", "title", "source", "sourceRefs", "overview", "objectives", "summary", "sections", "concepts", "conceptMap", "examples", "flashcards", "exercises", "quiz", "glossary", "capabilities"];
  if (!sameIds(Object.keys(bundle), v1Fields)) fail("unknown or missing top-level v1 field");
  function rejectStudentState(value) {
    if (!value || typeof value !== "object") return;
    for (const [key, child] of Object.entries(value)) {
      if (/^(studentId|learnerId|mastery|evidence|memoryState|progress|score|attempts)$/i.test(key)) fail("contains student state: " + key);
      rejectStudentState(child);
    }
  }
  rejectStudentState(bundle);
  if (bundle.lessonId !== "administracion-chiavenato-cap1" || bundle.courseId !== "administracion" || !nonEmpty(bundle.title)) fail("identity does not match Chapter 1");
  if (JSON.stringify(bundle).match(/\/Users\/|\/private\/|file:\/\//)) fail("contains a local path");
  if (!bundle.source || bundle.source.sourceId !== "administracion-chiavenato" || bundle.source.sha256 !== expectedDigest ||
      JSON.stringify(bundle.source.printedPages) !== "[7,18]" || JSON.stringify(bundle.source.pdfPages) !== "[22,33]") fail("source identity or scope changed");
  if (!registry.sources.some((source) => source.id === bundle.source.sourceId && source.courseId === bundle.courseId)) fail("sourceId is not registered");
  if (!bundle.sourceRefs || typeof bundle.sourceRefs !== "object" || Array.isArray(bundle.sourceRefs) || !Object.keys(bundle.sourceRefs).length) fail("sourceRefs are missing");
  for (const [id, ref] of Object.entries(bundle.sourceRefs)) {
    const p = ref?.printedPages, d = ref?.pdfPages;
    if (!nonEmpty(id) || !nonEmpty(ref?.heading) || !Array.isArray(p) || !Array.isArray(d) ||
        p.length !== 2 || d.length !== 2 || !p.every(Number.isInteger) || !d.every(Number.isInteger) ||
        p[0] < 7 || p[1] > 18 || p[0] > p[1] || d[0] !== p[0] + 15 || d[1] !== p[1] + 15) fail("invalid sourceRef " + id);
  }
  if (!bundle.overview || !nonEmpty(bundle.overview.text)) fail("overview is missing");
  requireRefs(bundle.overview, "overview");
  const ids = new Set();
  for (const field of contentFields) {
    if (!Array.isArray(bundle[field]) || !bundle[field].length) fail(field + " is empty");
    for (const item of bundle[field]) {
      if (!nonEmpty(item?.id) || ids.has(item.id)) fail("missing or duplicate content id in " + field);
      ids.add(item.id);
      requireRefs(item, field + ":" + item.id);
      const textFields = {
        objectives: ["text"], summary: ["title", "text"], sections: ["title", "explanation"],
        concepts: ["title", "explanation"], examples: ["title", "scenario", "takeaway"],
        flashcards: ["front", "back"], exercises: ["prompt", "check"],
        quiz: ["prompt", "explanation"], glossary: ["term", "definition"]
      }[field];
      if (textFields.some((key) => !nonEmpty(item[key]))) fail(field + ":" + item.id + " has empty teaching content");
      if (field === "quiz" && (!Array.isArray(item.options) || item.options.length < 2 ||
          item.options.some((option) => !nonEmpty(option)) || !Number.isInteger(item.correctIndex) ||
          item.correctIndex < 0 || item.correctIndex >= item.options.length)) fail("invalid quiz item " + item.id);
    }
  }
  const map = bundle.conceptMap;
  if (!map || !Array.isArray(map.nodes) || !map.nodes.length || !Array.isArray(map.links) || !map.links.length) fail("conceptMap is empty");
  const nodeIds = new Set();
  for (const node of map.nodes) {
    if (!nonEmpty(node.id) || nodeIds.has(node.id) || !nonEmpty(node.label)) fail("invalid conceptMap node");
    nodeIds.add(node.id);
    requireRefs(node, "conceptMap node " + node.id);
  }
  for (const link of map.links) {
    if (!nodeIds.has(link.from) || !nodeIds.has(link.to) || !nonEmpty(link.label)) fail("invalid conceptMap link");
    requireRefs(link, "conceptMap link");
  }
  if (!Array.isArray(bundle.capabilities) || !sameIds(bundle.capabilities, capabilities)) fail("capabilities do not match v1 content");
  if (model.lessonId !== bundle.lessonId || model.courseId !== bundle.courseId ||
      !sameIds(model.concepts.map((item) => item.id), bundle.concepts.map((item) => item.id))) fail("StudyModel concept targets do not match bundle");
  if (model.concepts.some((item) => item.title || item.summary || item.source)) fail("academic definitions remain in StudyModel");
  if (!model.activityDefinitions.every((activity) => bundle.exercises.some((item) => item.id === activity.lessonExerciseId))) fail("ActivityDefinition lessonExerciseId does not resolve");
  if (!registry.resources.some((resource) => resource.id === model.sourceResourceId && resource.courseId === bundle.courseId &&
      resource.href === "courses/administracion/capitulo-1.html" && resource.provenance?.some((entry) => entry.sourceId === bundle.source.sourceId))) fail("lesson resource is not registered");
  return true;
}

export { validateLesson };

if (process.argv[1] && path.resolve(process.argv[1]) === fileURLToPath(import.meta.url)) {
  const browser = { window: {} };
  vm.runInNewContext(fs.readFileSync(path.join(root, "data/site-data.js"), "utf8"), browser);
  try {
    const bundle = require(path.join(root, "data/lesson-bundle-administracion.js"));
    const model = require(path.join(root, "data/study-data-administracion.js"));
    validateLesson(bundle, model, browser.window.MI_SEMESTRE_DATA);
    console.log("LessonBundle v1 valid: Chiavenato Chapter 1 · " + bundle.concepts.length + " concepts, " +
      bundle.flashcards.length + " flashcards, " + bundle.exercises.length + " exercises, " +
      bundle.quiz.length + " quiz questions, " + bundle.glossary.length + " glossary terms.");
  } catch (error) {
    console.error(error.message);
    process.exitCode = 1;
  }
}
