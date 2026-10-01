#!/usr/bin/env node

import fs from "node:fs";
import path from "node:path";
import vm from "node:vm";
import { createRequire } from "node:module";
import { fileURLToPath } from "node:url";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const require = createRequire(import.meta.url);
const engine = require(path.join(root, "assets/study-engine.js"));
const window = {};
vm.runInNewContext(fs.readFileSync(path.join(root, "data/site-data.js"), "utf8"), { window });

try {
  for (const file of ["study-data.js", "study-data-administracion.js"]) {
    const model = require(path.join(root, "data", file));
    engine.validateStudyModel(model, window.MI_SEMESTRE_DATA);
    if (model.courseId === "administracion") {
      if (model.units.length !== 1 || model.concepts.length !== 5 || model.skills.length !== 0 ||
          model.relations.length !== 0 || model.activityDefinitions.length !== 1) {
        throw new Error("Administración Chapter 1 slice has unexpected scope");
      }
      if (model.lessonId !== "administracion-chiavenato-cap1") throw new Error("Administración lessonId does not resolve");
    }
    console.log("StudyModel valid: " + model.courseId + " · " + model.units.length + " unit, " +
      model.concepts.length + " concepts, " + model.skills.length + " skills, " +
      model.relations.length + " requires relations, " + model.activityDefinitions.length + " ActivityDefinition.");
  }
} catch (error) {
  console.error("StudyModel validation failed: " + error.message);
  process.exitCode = 1;
}
