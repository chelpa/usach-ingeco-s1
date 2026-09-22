/* Persistence boundary for Study Engine evidence. No mutable progress API. */
(function (root) {
  function createStudyStore(options) {
    if (!options || !options.model || !options.registry || !options.engine || !options.storage) {
      throw new Error("StudyStore needs model, registry, engine, and storage");
    }
    var model = JSON.parse(JSON.stringify(options.model));
    var engine = options.engine;
    var storage = options.storage;
    engine.validateStudyModel(model, options.registry);
    var prefix = "mi-semestre.study.evidence.v1.";

    function clone(value) { return JSON.parse(JSON.stringify(value)); }
    function sameTarget(a, b) { return a.kind === b.kind && a.id === b.id; }

    async function appendEvidence(evidence) {
      engine.validateEvidence(evidence, model);
      var record = clone(evidence);
      var key = prefix + record.id;
      if (storage.getItem(key) !== null) throw new Error("duplicate Evidence id: " + record.id);
      storage.setItem(key, JSON.stringify(record));
      if (storage.getItem(key) !== JSON.stringify(record)) throw new Error("Evidence write could not be verified");
      return clone(record);
    }

    async function listEvidence(filter) {
      filter = filter || {};
      var allowed = ["courseId", "activityId", "target"];
      if (Object.keys(filter).some(function (key) { return allowed.indexOf(key) < 0; })) {
        throw new Error("unknown Evidence filter");
      }
      if (filter.target) {
        var exists = (filter.target.kind === "concept" ? model.concepts :
          filter.target.kind === "skill" ? model.skills : []).some(function (item) {
          return item.id === filter.target.id;
        });
        if (!exists || Object.keys(filter.target).length !== 2) throw new Error("filter TargetRef does not resolve");
      }
      var events = [];
      for (var i = 0; i < storage.length; i++) {
        var key = storage.key(i);
        if (!key || key.slice(0, prefix.length) !== prefix) continue;
        var raw = storage.getItem(key);
        if (raw === null) throw new Error("Evidence disappeared during read");
        var event = JSON.parse(raw);
        if (event.courseId !== model.courseId) continue;
        engine.validateEvidence(event, model);
        if (key !== prefix + event.id) throw new Error("Evidence storage key mismatch");
        if (filter.courseId && event.courseId !== filter.courseId) continue;
        if (filter.activityId && event.activityId !== filter.activityId) continue;
        if (filter.target && !sameTarget(event.target, filter.target)) continue;
        events.push(event);
      }
      events.sort(function (a, b) {
        return a.occurredAt.localeCompare(b.occurredAt) || a.id.localeCompare(b.id);
      });
      return clone(events);
    }

    async function getMemoryState(target) {
      var events = await listEvidence({ target: target });
      return engine.projectMemoryState(model, events, target);
    }

    return Object.freeze({
      appendEvidence: appendEvidence,
      listEvidence: listEvidence,
      getMemoryState: getMemoryState
    });
  }

  if (typeof module === "object" && module.exports) module.exports = { createStudyStore: createStudyStore };
  if (root) {
    root.MI_STUDY_STORE = Object.freeze({ createStudyStore: createStudyStore });
  }
})(typeof window !== "undefined" ? window : null);
