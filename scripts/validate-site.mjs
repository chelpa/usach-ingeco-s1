#!/usr/bin/env node

import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const repoRoot = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const registryPath = path.join(repoRoot, "data", "site-data.js");
const errors = [];

const allowed = {
  courseStatuses: new Set(["active", "unnamed", "planned"]),
  resourceStatuses: new Set(["published", "archived", "draft"]),
  assessmentStatuses: new Set(["documented", "undated"]),
  resourceTypes: new Set([
    "summary",
    "compendium",
    "study-kit",
    "interactive-guide",
    "official-guide",
    "solution-manual",
    "practice",
    "reference"
  ]),
  sourceKinds: new Set([
    "lecture-material",
    "official-guide",
    "textbook",
    "personal-notes",
    "standards",
    "assignment",
    "course-planning"
  ]),
  provenanceRelations: new Set(["based-on", "official", "includes", "reference"]),
  capabilities: new Set([
    "summary",
    "exercises",
    "concept-map",
    "flashcards",
    "study-plan",
    "formula-sheet",
    "search",
    "solutions",
    "navigation",
    "quiz",
    "progress",
    "glossary",
    "feynman",
    "dark-mode",
    "code",
    "checklist",
    "practice"
  ])
};

function error(message) {
  errors.push(message);
}

function requireString(value, label) {
  if (typeof value !== "string" || value.trim() === "") {
    error(label + " must be a non-empty string");
  }
}

function requireArray(value, label) {
  if (!Array.isArray(value)) error(label + " must be an array");
}

function validateUniqueIds(collections) {
  const seen = new Map();
  for (const [kind, collection] of collections) {
    for (const item of collection) {
      if (!item || typeof item !== "object") {
        error(kind + " entries must be objects");
        continue;
      }
      requireString(item.id, kind + " id");
      if (!item.id) continue;
      if (seen.has(item.id)) {
        error("duplicate ID " + JSON.stringify(item.id) + " in " + kind + " and " + seen.get(item.id));
      } else {
        seen.set(item.id, kind);
      }
    }
  }
}

function loadRegistry() {
  if (!fs.existsSync(registryPath)) {
    error("registry file is missing: data/site-data.js");
    return null;
  }

  const source = fs.readFileSync(registryPath, "utf8");
  const match = source.match(/window\.MI_SEMESTRE_DATA\s*=\s*(\{[\s\S]*\})\s*;\s*\}\)\(\);?\s*$/);
  if (!match) {
    error("data/site-data.js does not use the expected static registry shape");
    return null;
  }

  try {
    // The registry is repository-authored JavaScript containing a plain
    // object literal. This avoids requiring a browser or network at validate time.
    return Function("return (" + match[1] + ");")();
  } catch (err) {
    error("data/site-data.js cannot be parsed: " + err.message);
    return null;
  }
}

function validateCourse(course) {
  requireString(course.shortName, "course " + course.id + " shortName");
  requireString(course.name, "course " + course.id + " name");
  if (!allowed.courseStatuses.has(course.status)) {
    error("course " + course.id + " has invalid status " + JSON.stringify(course.status));
  }
}

function validateResource(resource, courses, sources, assessments) {
  requireString(resource.courseId, "resource " + resource.id + " courseId");
  requireString(resource.title, "resource " + resource.id + " title");
  requireString(resource.description, "resource " + resource.id + " description");
  requireString(resource.href, "resource " + resource.id + " href");

  if (!courses.has(resource.courseId)) {
    error("resource " + resource.id + " references missing course " + resource.courseId);
  }
  if (!allowed.resourceTypes.has(resource.type)) {
    error("resource " + resource.id + " has invalid type " + JSON.stringify(resource.type));
  }
  if (!allowed.resourceStatuses.has(resource.status)) {
    error("resource " + resource.id + " has invalid status " + JSON.stringify(resource.status));
  }

  const hrefPath = resource.href.split(/[?#]/, 1)[0];
  const target = path.resolve(repoRoot, hrefPath);
  if (!target.startsWith(repoRoot + path.sep) || !fs.existsSync(target) || !fs.statSync(target).isFile()) {
    error("resource " + resource.id + " href does not exist: " + resource.href);
  }

  requireArray(resource.provenance, "resource " + resource.id + " provenance");
  for (const provenance of resource.provenance || []) {
    requireString(provenance.sourceId, "resource " + resource.id + " provenance sourceId");
    if (!sources.has(provenance.sourceId)) {
      error("resource " + resource.id + " references missing source " + provenance.sourceId);
    }
    if (!allowed.provenanceRelations.has(provenance.relation)) {
      error("resource " + resource.id + " has invalid provenance relation " + JSON.stringify(provenance.relation));
    }
  }

  requireArray(resource.assessmentIds, "resource " + resource.id + " assessmentIds");
  for (const assessmentId of resource.assessmentIds || []) {
    if (!assessments.has(assessmentId)) {
      error("resource " + resource.id + " references missing assessment " + assessmentId);
    }
  }

  requireArray(resource.capabilities, "resource " + resource.id + " capabilities");
  for (const capability of resource.capabilities || []) {
    if (!allowed.capabilities.has(capability)) {
      error("resource " + resource.id + " has invalid capability " + JSON.stringify(capability));
    }
  }
}

function validateSource(source, courses) {
  requireString(source.courseId, "source " + source.id + " courseId");
  requireString(source.title, "source " + source.id + " title");
  requireArray(source.authors, "source " + source.id + " authors");
  if (!courses.has(source.courseId)) {
    error("source " + source.id + " references missing course " + source.courseId);
  }
  if (!allowed.sourceKinds.has(source.kind)) {
    error("source " + source.id + " has invalid kind " + JSON.stringify(source.kind));
  }
}

function validateAssessment(assessment, courses, resources) {
  requireString(assessment.courseId, "assessment " + assessment.id + " courseId");
  requireString(assessment.title, "assessment " + assessment.id + " title");
  requireString(assessment.kind, "assessment " + assessment.id + " kind");
  requireArray(assessment.resourceIds, "assessment " + assessment.id + " resourceIds");
  if (!courses.has(assessment.courseId)) {
    error("assessment " + assessment.id + " references missing course " + assessment.courseId);
  }
  if (!allowed.assessmentStatuses.has(assessment.status)) {
    error("assessment " + assessment.id + " has invalid status " + JSON.stringify(assessment.status));
  }
  if (assessment.status === "documented" && !assessment.date) {
    error("assessment " + assessment.id + " is documented but has no date");
  }
  for (const resourceId of assessment.resourceIds || []) {
    const resource = resources.get(resourceId);
    if (!resource) {
      error("assessment " + assessment.id + " references missing resource " + resourceId);
    } else if (resource.courseId !== assessment.courseId) {
      error("assessment " + assessment.id + " references resource from another course: " + resourceId);
    }
  }
}

const data = loadRegistry();
if (data) {
  for (const key of ["courses", "resources", "assessments", "sources"]) {
    requireArray(data[key], "registry " + key);
  }

  const courses = new Map((data.courses || []).map((course) => [course.id, course]));
  const resources = new Map((data.resources || []).map((resource) => [resource.id, resource]));
  const assessments = new Map((data.assessments || []).map((assessment) => [assessment.id, assessment]));
  const sources = new Map((data.sources || []).map((source) => [source.id, source]));

  validateUniqueIds([
    ["course", data.courses || []],
    ["resource", data.resources || []],
    ["assessment", data.assessments || []],
    ["source", data.sources || []]
  ]);

  for (const course of data.courses || []) validateCourse(course);
  for (const source of data.sources || []) validateSource(source, courses);
  for (const assessment of data.assessments || []) validateAssessment(assessment, courses, resources);
  for (const resource of data.resources || []) validateResource(resource, courses, sources, assessments);

  for (const assessment of data.assessments || []) {
    for (const resourceId of assessment.resourceIds || []) {
      const resource = resources.get(resourceId);
      if (resource && !(resource.assessmentIds || []).includes(assessment.id)) {
        error("assessment " + assessment.id + " is not reciprocated by resource " + resourceId);
      }
    }
  }
}

if (errors.length) {
  console.error("Mi Semestre registry validation failed:");
  for (const message of errors) console.error("- " + message);
  process.exitCode = 1;
} else {
  console.log("Mi Semestre registry valid: " + data.courses.length + " courses, " +
    data.resources.length + " resources, " + data.assessments.length + " assessments, " +
    data.sources.length + " sources.");
}
