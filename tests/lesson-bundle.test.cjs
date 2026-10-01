const { test } = require("node:test");
const assert = require("node:assert/strict");
const fs = require("node:fs");
const path = require("node:path");
const vm = require("node:vm");

const root = path.resolve(__dirname, "..");
const bundle = require("../data/lesson-bundle-administracion.js");
const model = require("../data/study-data-administracion.js");
const browser = { window: {} };
vm.runInNewContext(fs.readFileSync(path.join(root, "data/site-data.js"), "utf8"), browser);
const registry = browser.window.MI_SEMESTRE_DATA;
const validator = import("../scripts/validate-lesson.mjs");
function copy(value) { return JSON.parse(JSON.stringify(value)); }

test("Chapter 1 LessonBundle v1 resolves source and StudyModel targets", async () => {
  const { validateLesson } = await validator;
  assert.equal(validateLesson(bundle, model, registry), true);
  assert.equal(bundle.concepts.length, 5);
  assert.ok(bundle.quiz.length >= 1);
});
test("unresolved or out-of-scope provenance fails", async () => {
  const { validateLesson } = await validator;
  const missingRef = copy(bundle);
  missingRef.flashcards[0].refs = ["missing"];
  assert.throws(() => validateLesson(missingRef, model, registry), /unresolved source refs/);
  const outside = copy(bundle);
  outside.sourceRefs.variables.printedPages = [12, 19];
  assert.throws(() => validateLesson(outside, model, registry), /invalid sourceRef/);
});
test("source identity, mapping, and learner-state boundary are enforced", async () => {
  const { validateLesson } = await validator;
  const digest = copy(bundle); digest.source.sha256 = "0".repeat(64);
  assert.throws(() => validateLesson(digest, model, registry), /source identity/);
  const mapping = copy(model); mapping.concepts[0].id = "unmapped";
  assert.throws(() => validateLesson(bundle, mapping, registry), /concept targets/);
  const state = copy(bundle); state.quiz[0].mastery = true;
  assert.throws(() => validateLesson(state, model, registry), /student state/);
});
test("quiz answers must resolve to one offered option", async () => {
  const { validateLesson } = await validator;
  const invalid = copy(bundle); invalid.quiz[0].correctIndex = 99;
  assert.throws(() => validateLesson(invalid, model, registry), /invalid quiz item/);
});
