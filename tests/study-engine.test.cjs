const { test } = require("node:test");
const assert = require("node:assert/strict");
const fs = require("node:fs");
const path = require("node:path");
const vm = require("node:vm");
const { execFileSync } = require("node:child_process");

const root = path.resolve(__dirname, "..");
const model = require("../data/study-data.js");
const engine = require("../assets/study-engine.js");
const { createStudyStore } = require("../assets/study-store.js");
const window = {};
vm.runInNewContext(fs.readFileSync(path.join(root, "data/site-data.js"), "utf8"), { window });
const registry = window.MI_SEMESTRE_DATA;
const target = { kind: "concept", id: "conta-devengo" };

function copy(value) { return JSON.parse(JSON.stringify(value)); }
function evidence(id = "event-1") {
  return {
    schemaVersion: 1,
    id,
    courseId: "contabilidad",
    kind: "self-assessment",
    activityId: "conta-auto-evaluar-devengo",
    target: copy(target),
    result: { rating: "uncertain" },
    occurredAt: "2026-09-22T12:00:00.000Z",
    origin: "native"
  };
}
function memoryStorage() {
  const values = new Map();
  return {
    get length() { return values.size; },
    key(index) { return [...values.keys()][index] ?? null; },
    getItem(key) { return values.has(key) ? values.get(key) : null; },
    setItem(key, value) { values.set(key, String(value)); }
  };
}
function store(storage = memoryStorage()) {
  return createStudyStore({ model, registry, engine, storage });
}

test("browser script load exports only a factory without reading dependencies", () => {
  const source = fs.readFileSync(path.join(root, "assets/study-store.js"), "utf8");
  const browser = {
    get localStorage() { throw new Error("localStorage must not be read on load"); }
  };
  vm.runInNewContext(source, { window: browser });
  assert.equal(typeof browser.MI_STUDY_STORE.createStudyStore, "function");
  assert.deepEqual(Object.keys(browser.MI_STUDY_STORE), ["createStudyStore"]);
});
test("CommonJS export loads without browser dependencies and factory requires explicit inputs", () => {
  assert.equal(typeof createStudyStore, "function");
  assert.throws(() => createStudyStore(), /needs model, registry, engine, and storage/);
  for (const missing of ["model", "registry", "engine", "storage"]) {
    const options = { model, registry, engine, storage: memoryStorage() };
    delete options[missing];
    assert.throws(() => createStudyStore(options), /needs model, registry, engine, and storage/);
  }
});

test("valid model passes and has no invented production Skill", () => {
  assert.equal(engine.validateStudyModel(model, registry), true);
  assert.equal(model.skills.length, 0);
});
test("bad courseId fails", () => {
  const bad = copy(model); bad.courseId = "missing";
  assert.throws(() => engine.validateStudyModel(bad, registry), /courseId/);
});
test("duplicate IDs across types fail", () => {
  const bad = copy(model); bad.skills.push({ id: bad.concepts[0].id, unitId: bad.units[0].id, title: "fixture" });
  assert.throws(() => engine.validateStudyModel(bad, registry), /duplicate study ID/);
});
test("missing TargetRef fails", () => {
  const bad = copy(model); bad.activityDefinitions[0].targets[0].id = "missing";
  assert.throws(() => engine.validateStudyModel(bad, registry), /TargetRef/);
});
test("Skill TargetRef is supported by a fixture", () => {
  const fixture = copy(model);
  fixture.skills.push({ id: "fixture-skill", unitId: fixture.units[0].id, title: "fixture only" });
  fixture.activityDefinitions[0].targets.push({ kind: "skill", id: "fixture-skill" });
  assert.equal(engine.validateStudyModel(fixture, registry), true);
});
test("self requires fails", () => {
  const bad = copy(model); bad.relations[0].to = copy(bad.relations[0].from);
  assert.throws(() => engine.validateStudyModel(bad, registry), /self-link/);
});
test("prerequisite cycle fails", () => {
  const bad = copy(model);
  bad.relations.push({ type: "requires", from: copy(bad.relations[0].to), to: copy(bad.relations[0].from) });
  assert.throws(() => engine.validateStudyModel(bad, registry), /cycle/);
});
test("valid Evidence appends and is listed after persistence", async () => {
  const storage = memoryStorage();
  const first = store(storage);
  await first.appendEvidence(evidence());
  const second = store(storage);
  assert.deepEqual(await second.listEvidence({ target }), [evidence()]);
  assert.deepEqual(await second.getMemoryState(target), {
    assessment: "self-reported", latestSelfAssessment: "uncertain", lastObservedAt: evidence().occurredAt
  });
});
test("another course's stored event does not hide this course's history", async () => {
  const storage = memoryStorage();
  storage.setItem("mi-semestre.study.evidence.v1.other-1", JSON.stringify({ id: "other-1", courseId: "economia" }));
  const study = store(storage);
  await study.appendEvidence(evidence());
  assert.deepEqual(await study.listEvidence(), [evidence()]);
  await assert.rejects(study.appendEvidence(evidence("other-1")), /duplicate/);
});
test("duplicate Evidence ID cannot append", async () => {
  const study = store();
  await study.appendEvidence(evidence());
  await assert.rejects(study.appendEvidence(evidence()), /duplicate/);
});
test("unknown Evidence field and invalid result fail", async () => {
  const study = store();
  const extra = evidence(); extra.metadata = { anything: true };
  await assert.rejects(study.appendEvidence(extra), /unknown field/);
  const badResult = evidence(); badResult.result.rating = "mastered";
  await assert.rejects(study.appendEvidence(badResult), /rating/);
});
test("Evidence requires a real timestamp and linked TargetRef", async () => {
  const study = store();
  const badDate = evidence(); badDate.occurredAt = "2026-02-30T12:00:00.000Z";
  await assert.rejects(study.appendEvidence(badDate), /timestamp/);
  const badTarget = evidence(); badTarget.target.id = "missing";
  await assert.rejects(study.appendEvidence(badTarget), /TargetRef/);
});
test("zero Evidence is explicitly unknown", () => {
  assert.deepEqual(engine.projectMemoryState(model, [], target), {
    assessment: "unknown", latestSelfAssessment: null, lastObservedAt: null
  });
});
test("empty persisted history is explicitly unknown", async () => {
  assert.deepEqual(await store().getMemoryState(target), {
    assessment: "unknown", latestSelfAssessment: null, lastObservedAt: null
  });
});
test("MemoryState is deterministic and reports only self-assessment", () => {
  const events = [evidence()];
  const first = engine.projectMemoryState(model, events, target);
  assert.deepEqual(first, engine.projectMemoryState(model, events, target));
  assert.deepEqual(first, {
    assessment: "self-reported", latestSelfAssessment: "uncertain", lastObservedAt: events[0].occurredAt
  });
});
test("store exposes no Evidence mutation or deletion API", () => {
  const study = store();
  assert.deepEqual(Object.keys(study).sort(), ["appendEvidence", "getMemoryState", "listEvidence"]);
  assert.equal(study.updateEvidence, undefined);
  assert.equal(study.deleteEvidence, undefined);
  assert.equal(study.replaceEvidence, undefined);
});
test("MemoryState derivation has no hidden clock", () => {
  const source = fs.readFileSync(path.join(root, "assets/study-engine.js"), "utf8");
  assert.doesNotMatch(source, /Date\.now\s*\(|new Date\s*\(\s*\)/);
});
test("all academic resource bodies match the Phase 3D base", () => {
  assert.equal(registry.resources.length, 12);
  for (const resource of registry.resources) {
    const current = fs.readFileSync(path.join(root, resource.href));
    const baseline = execFileSync("git", ["show", "mi-semestre-phase-3d:" + resource.href], { cwd: root });
    assert.deepEqual(current, baseline, resource.href);
  }
});
test("storage errors are surfaced", async () => {
  const broken = memoryStorage();
  broken.setItem = () => { throw new Error("quota exceeded"); };
  await assert.rejects(store(broken).appendEvidence(evidence()), /quota exceeded/);
});
