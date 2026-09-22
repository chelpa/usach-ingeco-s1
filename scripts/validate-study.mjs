#!/usr/bin/env node

import fs from "node:fs";
import path from "node:path";
import vm from "node:vm";
import { createRequire } from "node:module";
import { fileURLToPath } from "node:url";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const require = createRequire(import.meta.url);
const model = require(path.join(root, "data/study-data.js"));
const engine = require(path.join(root, "assets/study-engine.js"));
const window = {};
vm.runInNewContext(fs.readFileSync(path.join(root, "data/site-data.js"), "utf8"), { window });

try {
  engine.validateStudyModel(model, window.MI_SEMESTRE_DATA);
  console.log("StudyModel valid: 1 registered course, 1 unit, 4 concepts, 0 skills, 1 requires relation, 1 ActivityDefinition.");
} catch (error) {
  console.error("StudyModel validation failed: " + error.message);
  process.exitCode = 1;
}
