/* Pure validation and evidence projection for the Study Engine. */
(function (root) {
  var MODEL_VERSION = 1;
  var EVIDENCE_VERSION = 1;
  var EVIDENCE_FIELDS = ["schemaVersion", "id", "courseId", "kind", "activityId", "target", "result", "occurredAt", "origin"];
  var RATINGS = ["uncertain", "can-explain"];

  function fail(message) { throw new Error(message); }
  function isObject(value) { return value !== null && typeof value === "object" && !Array.isArray(value); }
  function nonEmpty(value) { return typeof value === "string" && value.trim().length > 0; }
  function targetKey(ref) { return ref.kind + ":" + ref.id; }
  function sameTarget(a, b) { return a.kind === b.kind && a.id === b.id; }
  function exactKeys(value, fields, label) {
    if (!isObject(value)) fail(label + " must be an object");
    var keys = Object.keys(value);
    for (var i = 0; i < keys.length; i++) {
      if (fields.indexOf(keys[i]) < 0) fail(label + " has unknown field: " + keys[i]);
    }
    for (var j = 0; j < fields.length; j++) {
      if (!Object.prototype.hasOwnProperty.call(value, fields[j])) fail(label + " is missing " + fields[j]);
    }
  }
  function targetExists(ref, model) {
    if (!isObject(ref) || Object.keys(ref).length !== 2 ||
        !nonEmpty(ref.id) || (ref.kind !== "concept" && ref.kind !== "skill")) return false;
    var collection = ref.kind === "concept" ? model.concepts : model.skills;
    return collection.some(function (item) { return item.id === ref.id; });
  }
  function requireTarget(ref, model) {
    if (!targetExists(ref, model)) fail("TargetRef does not resolve");
  }
  function validateStudyModel(model, registry) {
    if (!isObject(model) || model.schemaVersion !== MODEL_VERSION) fail("unsupported StudyModel version");
    if (!registry || !Array.isArray(registry.courses) ||
        !registry.courses.some(function (course) { return course.id === model.courseId; })) fail("study courseId does not resolve");
    if (!Array.isArray(registry.resources) ||
        !registry.resources.some(function (resource) {
          return resource.id === model.sourceResourceId && resource.courseId === model.courseId;
        })) fail("study sourceResourceId does not resolve in course");
    ["units", "concepts", "skills", "activityDefinitions", "relations"].forEach(function (field) {
      if (!Array.isArray(model[field])) fail("StudyModel " + field + " must be an array");
    });
    var ids = new Set();
    ["units", "concepts", "skills", "activityDefinitions"].forEach(function (field) {
      model[field].forEach(function (item) {
        if (!isObject(item) || !nonEmpty(item.id)) fail(field + " entry needs an id");
        if (ids.has(item.id)) fail("duplicate study ID: " + item.id);
        ids.add(item.id);
      });
    });
    var units = new Set(model.units.map(function (item) { return item.id; }));
    ["concepts", "skills", "activityDefinitions"].forEach(function (field) {
      model[field].forEach(function (item) {
        if (!units.has(item.unitId)) fail(item.id + " has missing unitId");
      });
    });
    model.activityDefinitions.forEach(function (activity) {
      if (activity.kind !== "self-check") fail("unsupported ActivityDefinition kind");
      if (!registry.resources.some(function (resource) {
        return resource.id === activity.resourceId && resource.courseId === model.courseId;
      })) fail("ActivityDefinition resourceId does not resolve in course");
      if (!Array.isArray(activity.targets) || activity.targets.length === 0) fail("ActivityDefinition needs targets");
      activity.targets.forEach(function (ref) { requireTarget(ref, model); });
    });
    var edges = new Map();
    model.relations.forEach(function (relation) {
      if (!isObject(relation) || relation.type !== "requires") fail("unsupported relation type");
      requireTarget(relation.from, model);
      requireTarget(relation.to, model);
      var from = targetKey(relation.from);
      var to = targetKey(relation.to);
      if (from === to) fail("requires self-link: " + from);
      if (!edges.has(from)) edges.set(from, []);
      edges.get(from).push(to);
    });
    var visiting = new Set();
    var visited = new Set();
    function visit(node) {
      if (visiting.has(node)) fail("requires cycle detected");
      if (visited.has(node)) return;
      visiting.add(node);
      (edges.get(node) || []).forEach(visit);
      visiting.delete(node);
      visited.add(node);
    }
    edges.forEach(function (_, node) { visit(node); });
    return true;
  }
  function validateEvidence(evidence, model) {
    exactKeys(evidence, EVIDENCE_FIELDS, "Evidence");
    if (evidence.schemaVersion !== EVIDENCE_VERSION) fail("unsupported Evidence version");
    if (!nonEmpty(evidence.id) || !/^[A-Za-z0-9][A-Za-z0-9._:-]{0,127}$/.test(evidence.id)) fail("invalid Evidence id");
    if (evidence.courseId !== model.courseId) fail("Evidence courseId does not resolve");
    if (evidence.kind !== "self-assessment") fail("unsupported Evidence kind");
    var activity = model.activityDefinitions.find(function (item) { return item.id === evidence.activityId; });
    if (!activity) fail("Evidence activityId does not resolve");
    requireTarget(evidence.target, model);
    if (!activity.targets.some(function (ref) { return sameTarget(ref, evidence.target); })) fail("Evidence target is not linked to activity");
    exactKeys(evidence.result, ["rating"], "Evidence result");
    if (RATINGS.indexOf(evidence.result.rating) < 0) fail("invalid self-assessment rating");
    if (evidence.origin !== "native") fail("unsupported Evidence origin");
    if (typeof evidence.occurredAt !== "string" || !/^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}\.\d{3}Z$/.test(evidence.occurredAt) ||
        Number.isNaN(Date.parse(evidence.occurredAt)) || new Date(evidence.occurredAt).toISOString() !== evidence.occurredAt) {
      fail("Evidence occurredAt must be a real UTC timestamp");
    }
    return true;
  }
  function projectMemoryState(model, evidence, target) {
    requireTarget(target, model);
    if (!Array.isArray(evidence)) fail("Evidence must be an array");
    var relevant = evidence.filter(function (event) {
      validateEvidence(event, model);
      return sameTarget(event.target, target);
    }).sort(function (a, b) {
      return a.occurredAt.localeCompare(b.occurredAt) || a.id.localeCompare(b.id);
    });
    if (!relevant.length) return { assessment: "unknown", latestSelfAssessment: null, lastObservedAt: null };
    var latest = relevant[relevant.length - 1];
    return {
      assessment: "self-reported",
      latestSelfAssessment: latest.result.rating,
      lastObservedAt: latest.occurredAt
    };
  }
  var api = {
    validateStudyModel: validateStudyModel,
    validateEvidence: validateEvidence,
    projectMemoryState: projectMemoryState
  };
  if (typeof module === "object" && module.exports) module.exports = api;
  if (root) root.MI_STUDY_ENGINE = api;
})(typeof window !== "undefined" ? window : null);
