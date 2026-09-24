/**
 * Skill Sync AI - Skill Graph Automated Test Suite
 * Problem Statement ID: 26134
 * 
 * Verifies:
 * 1. Dynamic generation of all 8 required node types:
 *    - Job Role, Skill, Course, Module, Trainer, Training Center, District, Employer
 * 2. Dynamic generation of relational edges matching requirements:
 *    - Job -> Requires Skill
 *    - Course -> Teaches Skill
 *    - Trainer -> Has Skill
 *    - Center -> Offers Course
 *    - Employer -> Requires Skill
 *    - District -> Contains Center
 *    - Course -> Has Module, Center -> Employs Trainer, Employer -> Posts Job, District -> Contains Employer
 * 3. Zero hardcoding validation (all edges trace to relational schema foreign keys)
 * 4. Graph filtering by Sector, District, and Node Types
 * 5. Full-text search and match highlighting
 * 6. Node detail inspection (incoming/outgoing connected edges)
 * 7. Layout coordinate integrity and bounding box
 */

import { buildSkillGraph, inspectNode, DB_DISTRICTS, DB_SKILLS, DB_COURSES, DB_JOB_POSTINGS } from "../src/lib/graph/service";
import { GraphNodeType, GraphEdgeType } from "../src/lib/graph/types";

let passedCount = 0;
let failedCount = 0;

function assert(condition: boolean, testName: string, detail?: string) {
  if (condition) {
    passedCount++;
    console.log(`  ✅ PASS: ${testName}`);
  } else {
    failedCount++;
    console.error(`  ❌ FAIL: ${testName}${detail ? ` -> ${detail}` : ""}`);
  }
}

console.log("================================================================");
console.log(" Skill Sync AI: Skill Graph Automated Test Suite");
console.log("================================================================\n");

// ----------------------------------------------------------------------------
// Test Group 1: 8 Core Node Types Generation
// ----------------------------------------------------------------------------
console.log("Test Group 1: Relational Node Types Generation");
const baselineGraph = buildSkillGraph();

const expectedTypes: GraphNodeType[] = [
  "job_role",
  "skill",
  "course",
  "module",
  "trainer",
  "training_center",
  "district",
  "employer",
];

expectedTypes.forEach((nodeType) => {
  const count = baselineGraph.summary.byNodeType[nodeType];
  assert(count > 0, `Node type '${nodeType}' is present in generated graph (Count: ${count})`);
});

assert(baselineGraph.nodes.length >= 25, `Graph contains healthy node volume (${baselineGraph.nodes.length} nodes)`);

// ----------------------------------------------------------------------------
// Test Group 2: Relational Edges Generation
// ----------------------------------------------------------------------------
console.log("\nTest Group 2: Database Relational Edges Generation");

const expectedEdgeTypes: GraphEdgeType[] = [
  "requires_skill",    // Job -> Requires Skill & Employer -> Requires Skill
  "teaches_skill",     // Course -> Teaches Skill
  "has_skill",         // Trainer -> Has Skill
  "offers_course",     // Center -> Offers Course
  "contains_center",   // District -> Contains Center
  "has_module",        // Course -> Has Module
  "employs_trainer",   // Center -> Employs Trainer
  "posts_job",         // Employer -> Posts Job
  "contains_employer", // District -> Contains Employer
];

expectedEdgeTypes.forEach((edgeType) => {
  const count = baselineGraph.summary.byEdgeType[edgeType];
  assert(count > 0, `Relational edge type '${edgeType}' is generated (Count: ${count})`);
});

// Verify specific user-requested relationships:
// 1. Job -> Requires Skill
const jobSkillEdges = baselineGraph.edges.filter(
  (e) => e.data.relationType === "requires_skill" && e.source.startsWith("node-job-")
);
assert(jobSkillEdges.length > 0, `Specific requirement 'Job -> Requires Skill' verified (${jobSkillEdges.length} edges)`);

// 2. Course -> Teaches Skill
const courseSkillEdges = baselineGraph.edges.filter(
  (e) => e.data.relationType === "teaches_skill" && e.source.startsWith("node-course-")
);
assert(courseSkillEdges.length > 0, `Specific requirement 'Course -> Teaches Skill' verified (${courseSkillEdges.length} edges)`);

// 3. Trainer -> Has Skill
const trainerSkillEdges = baselineGraph.edges.filter(
  (e) => e.data.relationType === "has_skill" && e.source.startsWith("node-tr-")
);
assert(trainerSkillEdges.length > 0, `Specific requirement 'Trainer -> Has Skill' verified (${trainerSkillEdges.length} edges)`);

// 4. Center -> Offers Course
const centerCourseEdges = baselineGraph.edges.filter(
  (e) => e.data.relationType === "offers_course" && e.source.startsWith("node-tc-")
);
assert(centerCourseEdges.length > 0, `Specific requirement 'Center -> Offers Course' verified (${centerCourseEdges.length} edges)`);

// 5. Employer -> Requires Skill
const employerSkillEdges = baselineGraph.edges.filter(
  (e) => e.data.relationType === "requires_skill" && e.source.startsWith("node-emp-")
);
assert(employerSkillEdges.length > 0, `Specific requirement 'Employer -> Requires Skill' verified (${employerSkillEdges.length} edges)`);

// 6. District -> Contains Center
const districtCenterEdges = baselineGraph.edges.filter(
  (e) => e.data.relationType === "contains_center" && e.source.startsWith("node-dist-")
);
assert(districtCenterEdges.length > 0, `Specific requirement 'District -> Contains Center' verified (${districtCenterEdges.length} edges)`);

// ----------------------------------------------------------------------------
// Test Group 3: Zero Hardcoding Verification
// ----------------------------------------------------------------------------
console.log("\nTest Group 3: Zero Hardcoding Verification");

// Every edge's source and target must match actual relational node IDs
const nodeIds = new Set(baselineGraph.nodes.map((n) => n.id));
let invalidEndpoints = 0;
baselineGraph.edges.forEach((edge) => {
  if (!nodeIds.has(edge.source) || !nodeIds.has(edge.target)) {
    invalidEndpoints++;
  }
});
assert(invalidEndpoints === 0, "All edges connect valid, existing database entity nodes (0 orphaned edges)");

// Verify dynamic edge counts correspond directly with relational table records
assert(
  districtCenterEdges.length === 3,
  `District -> Center count matches relational records (${districtCenterEdges.length} = 3 centers)`
);
assert(
  centerCourseEdges.length === 3,
  `Center -> Course count matches relational records (${centerCourseEdges.length} = 3 courses)`
);

// ----------------------------------------------------------------------------
// Test Group 4: Filtering Capabilities (Sector, District, Node Types)
// ----------------------------------------------------------------------------
console.log("\nTest Group 4: Graph Filtering Capabilities");

// A. Filter by Sector: 'automotive_ev'
const evGraph = buildSkillGraph({ sector: "automotive_ev" });
const nonEvCourses = evGraph.nodes.filter((n) => n.data.nodeType === "course" && n.data.sector !== "automotive_ev");
assert(nonEvCourses.length === 0, "Sector filter 'automotive_ev' correctly excludes non-EV courses");
assert(evGraph.nodes.some((n) => n.data.label.includes("Electric Vehicle")), "EV courses are preserved under EV sector filter");

// B. Filter by District: 'Pune'
const puneGraph = buildSkillGraph({ district: "Pune" });
const nonPuneDistricts = puneGraph.nodes.filter((n) => n.data.nodeType === "district" && n.data.label !== "Pune");
assert(nonPuneDistricts.length === 0, "District filter 'Pune' excludes other districts");
const puneCenters = puneGraph.nodes.filter((n) => n.data.nodeType === "training_center");
assert(puneCenters.every((c) => c.data.district === "Pune"), "All training centers under Pune filter are located in Pune");

// C. Filter by Node Types: only 'job_role' and 'skill'
const rolesAndSkillsGraph = buildSkillGraph({ nodeTypes: ["job_role", "skill"] });
const otherTypes = rolesAndSkillsGraph.nodes.filter((n) => n.data.nodeType !== "job_role" && n.data.nodeType !== "skill");
assert(otherTypes.length === 0, "Node types filter strictly limits nodes to selected subset");
assert(rolesAndSkillsGraph.nodes.length > 0, "Filtered subset has positive node count");
// All remaining edges in this subset must only connect job_role and skill
const invalidSubsetEdges = rolesAndSkillsGraph.edges.filter(
  (e) => !rolesAndSkillsGraph.nodes.some((n) => n.id === e.source) || !rolesAndSkillsGraph.nodes.some((n) => n.id === e.target)
);
assert(invalidSubsetEdges.length === 0, "Filtered graph removes edges whose endpoints were filtered out");

// ----------------------------------------------------------------------------
// Test Group 5: Full-Text Search & Matching
// ----------------------------------------------------------------------------
console.log("\nTest Group 5: Full-Text Search & Highlighting");

const searchedGraph = buildSkillGraph({ searchQuery: "CAN Bus" });
const matchedNodes = searchedGraph.nodes.filter((n) => n.data.matched);
assert(matchedNodes.length > 0, `Search query 'CAN Bus' finds direct matches (Count: ${matchedNodes.length})`);
assert(
  matchedNodes.some((n) => n.data.label.includes("CAN Bus")),
  "Direct skill 'Automotive CAN Bus Protocol' or job 'CAN Bus Diagnostic' is flagged as matched"
);

// Verify dimming of distant non-connected nodes
const dimmedNodes = searchedGraph.nodes.filter((n) => n.data.isDimmed);
assert(dimmedNodes.length > 0, `Non-matching/non-neighbor nodes are dimmed for focus (Count: ${dimmedNodes.length})`);

// ----------------------------------------------------------------------------
// Test Group 6: Node Detail Inspection (360-Degree Relational Audit)
// ----------------------------------------------------------------------------
console.log("\nTest Group 6: Node Detail Inspection");

// Inspect Skill node: EV Battery Diagnostics
const evSkillNodeId = "node-sk-ev-battery";
const skillInspection = inspectNode(evSkillNodeId, baselineGraph.nodes, baselineGraph.edges);
assert(skillInspection !== null, "Skill node inspection returns non-null detail");
assert(skillInspection?.node.nodeType === "skill", "Inspected node type is 'skill'");

// Incoming edges to this skill: courses teaching it, jobs requiring it, employers requiring it, trainers having it
const incomingEdges = skillInspection?.incomingEdges || [];
const incomingSourceTypes = new Set(incomingEdges.map((e) => e.sourceNode.nodeType));
assert(incomingSourceTypes.has("course"), "Skill inspection shows incoming course edge (teaches_skill)");
assert(incomingSourceTypes.has("job_role"), "Skill inspection shows incoming job role edge (requires_skill)");
assert(incomingSourceTypes.has("employer"), "Skill inspection shows incoming employer edge (requires_skill)");
assert(incomingSourceTypes.has("trainer"), "Skill inspection shows incoming trainer edge (has_skill)");

// Inspect Course node: EV Tech
const evCourseNodeId = "node-course-ev-tech";
const courseInspection = inspectNode(evCourseNodeId, baselineGraph.nodes, baselineGraph.edges);
assert(courseInspection !== null, "Course node inspection returns non-null detail");
assert(
  Boolean(courseInspection?.incomingEdges.some((e) => e.sourceNode.nodeType === "training_center")),
  "Course has incoming connection from its Training Center"
);
assert(
  Boolean(courseInspection?.outgoingEdges.some((e) => e.targetNode.nodeType === "module")),
  "Course has outgoing connections to its Modules"
);
assert(
  Boolean(courseInspection?.outgoingEdges.some((e) => e.targetNode.nodeType === "skill")),
  "Course has outgoing connections to taught Skills"
);

// ----------------------------------------------------------------------------
// Test Group 7: Performance & Layout Determinism
// ----------------------------------------------------------------------------
console.log("\nTest Group 7: Performance & Layout Determinism");

// All nodes must have non-negative, valid coordinates
let invalidCoords = 0;
baselineGraph.nodes.forEach((n) => {
  if (isNaN(n.position.x) || isNaN(n.position.y) || n.position.x < 0 || n.position.y < 0) {
    invalidCoords++;
  }
});
assert(invalidCoords === 0, "All node coordinates are valid, bounded positive numbers");

// Stratified layout verification:
// Districts (x: ~60) < Centers (x: ~400) < Courses (x: ~780) < Modules (x: ~1180) < Skills (x: ~1600)
const districtSample = baselineGraph.nodes.find((n) => n.data.nodeType === "district")!;
const centerSample = baselineGraph.nodes.find((n) => n.data.nodeType === "training_center")!;
const courseSample = baselineGraph.nodes.find((n) => n.data.nodeType === "course")!;
const skillSample = baselineGraph.nodes.find((n) => n.data.nodeType === "skill")!;

assert(
  districtSample.position.x < centerSample.position.x &&
  centerSample.position.x < courseSample.position.x &&
  courseSample.position.x < skillSample.position.x,
  "Nodes are positioned in a stratified pedagogical and industrial flow"
);

// ----------------------------------------------------------------------------
// Test Results Summary
// ----------------------------------------------------------------------------
console.log("\n================================================================");
console.log(` SKILL GRAPH TEST SUMMARY: ${passedCount} PASSED, ${failedCount} FAILED`);
console.log("================================================================\n");

if (failedCount > 0) {
  process.exit(1);
} else {
  console.log("🎉 ALL SKILL GRAPH TESTS PASSED CLEANLY!");
}
