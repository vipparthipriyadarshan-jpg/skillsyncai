import { CanonicalSkillResult } from "./types";

export interface CanonicalEntity {
  name: string;
  slug: string;
  category: "technical" | "tool" | "soft_skill" | "domain_knowledge" | "compliance_standard";
  isEmerging: boolean;
  aliases: string[];
}

export const CANONICAL_SKILLS: CanonicalEntity[] = [
  {
    name: "Machine Learning",
    slug: "machine-learning",
    category: "technical",
    isEmerging: true,
    aliases: ["ml", "machine learning", "machine-learning", "machinelearning"],
  },
  {
    name: "Artificial Intelligence",
    slug: "artificial-intelligence",
    category: "technical",
    isEmerging: true,
    aliases: ["ai", "artificial intelligence", "artificial-intelligence", "genai", "generative ai"],
  },
  {
    name: "EV Battery Diagnostics",
    slug: "ev-battery-diagnostics",
    category: "technical",
    isEmerging: true,
    aliases: [
      "ev battery diagnostics",
      "ev battery",
      "electric vehicle battery",
      "lithium-ion battery diagnostics",
      "traction battery diagnostics",
      "cell balancing",
    ],
  },
  {
    name: "Battery Management Systems (BMS)",
    slug: "bms-configuration",
    category: "technical",
    isEmerging: true,
    aliases: [
      "bms",
      "battery management system",
      "battery management systems",
      "bms configuration",
      "bms telemetry",
    ],
  },
  {
    name: "Automotive CAN Bus Protocol",
    slug: "can-bus-protocol",
    category: "technical",
    isEmerging: false,
    aliases: [
      "can bus",
      "can-bus",
      "controller area network",
      "canoe",
      "can protocol",
      "automotive can bus",
    ],
  },
  {
    name: "5-Axis CNC Milling",
    slug: "5-axis-cnc-milling",
    category: "technical",
    isEmerging: true,
    aliases: [
      "5-axis cnc",
      "5 axis cnc",
      "5-axis cnc milling",
      "5 axis cnc milling",
      "multi-axis cnc",
      "simultaneous 5-axis",
    ],
  },
  {
    name: "G-Code & M-Code Programming",
    slug: "g-code-programming",
    category: "tool",
    isEmerging: false,
    aliases: [
      "g-code",
      "g code",
      "m-code",
      "m code",
      "g/m code",
      "iso g-code",
      "cnc programming",
    ],
  },
  {
    name: "Solar PV Array Installation",
    slug: "solar-pv-installation",
    category: "technical",
    isEmerging: false,
    aliases: [
      "solar pv",
      "solar pv installation",
      "solar photovoltaic",
      "solar array installation",
      "rooftop solar installation",
    ],
  },
  {
    name: "Grid-Tie Solar Inverter Sizing",
    slug: "grid-tie-inverter-sizing",
    category: "technical",
    isEmerging: true,
    aliases: [
      "grid-tie inverter",
      "solar inverter sizing",
      "mppt sizing",
      "inverter synchronization",
    ],
  },
  {
    name: "Docker & Containerization",
    slug: "docker-containerization",
    category: "tool",
    isEmerging: false,
    aliases: [
      "docker",
      "docker containers",
      "containerization",
      "containers",
      "docker engine",
    ],
  },
  {
    name: "Kubernetes Orchestration",
    slug: "kubernetes-orchestration",
    category: "technical",
    isEmerging: true,
    aliases: [
      "k8s",
      "kubernetes",
      "kube",
      "kubernetes orchestration",
      "k8s cluster",
    ],
  },
  {
    name: "PostgreSQL",
    slug: "postgresql",
    category: "tool",
    isEmerging: false,
    aliases: [
      "postgres",
      "postgresql",
      "postgre sql",
      "psql",
      "postgres db",
    ],
  },
  {
    name: "Python",
    slug: "python",
    category: "tool",
    isEmerging: false,
    aliases: ["python", "python3", "python programming", "python scripting"],
  },
  {
    name: "JavaScript",
    slug: "javascript",
    category: "tool",
    isEmerging: false,
    aliases: ["js", "javascript", "java-script", "ecmascript"],
  },
  {
    name: "TypeScript",
    slug: "typescript",
    category: "tool",
    isEmerging: false,
    aliases: ["ts", "typescript", "type-script"],
  },
  {
    name: "React.js",
    slug: "reactjs",
    category: "tool",
    isEmerging: false,
    aliases: ["react", "react.js", "reactjs"],
  },
  {
    name: "Industrial Safety & Lockout/Tagout",
    slug: "loto-safety",
    category: "compliance_standard",
    isEmerging: false,
    aliases: [
      "loto",
      "lockout tagout",
      "lockout/tagout",
      "zero energy state",
      "high voltage safety",
    ],
  },
];

/**
 * Normalizes an arbitrary skill name to its canonical entity.
 * Handles deduplication for variants such as ML, Machine Learning, Machine-Learning.
 */
export function resolveCanonicalSkill(rawName: string): CanonicalSkillResult {
  const clean = rawName.trim();
  const normalizedKey = clean
    .toLowerCase()
    .replace(/[^\w\s-]/g, "")
    .replace(/[-_]+/g, " ")
    .replace(/\s+/g, " ")
    .trim();

  // 1. Direct match on canonical name
  for (const entity of CANONICAL_SKILLS) {
    if (entity.name.toLowerCase() === clean.toLowerCase()) {
      return {
        rawName: clean,
        canonicalName: entity.name,
        slug: entity.slug,
        category: entity.category,
        isEmerging: entity.isEmerging,
        confidence: 1.0,
        matchedVia: "exact_canonical",
        isCanonical: true,
      };
    }
  }

  // 2. Alias dictionary lookup (exact match after normalization)
  for (const entity of CANONICAL_SKILLS) {
    for (const alias of entity.aliases) {
      const normalizedAlias = alias
        .toLowerCase()
        .replace(/[^\w\s-]/g, "")
        .replace(/[-_]+/g, " ")
        .replace(/\s+/g, " ")
        .trim();

      if (normalizedKey === normalizedAlias) {
        return {
          rawName: clean,
          canonicalName: entity.name,
          slug: entity.slug,
          category: entity.category,
          isEmerging: entity.isEmerging,
          confidence: 0.98,
          matchedVia: "alias_dictionary",
          isCanonical: true,
        };
      }
    }
  }

  // 3. Substring match against aliases (e.g. "hands-on experience with ML models")
  for (const entity of CANONICAL_SKILLS) {
    for (const alias of entity.aliases) {
      if (alias.length >= 3 && normalizedKey.includes(alias)) {
        return {
          rawName: clean,
          canonicalName: entity.name,
          slug: entity.slug,
          category: entity.category,
          isEmerging: entity.isEmerging,
          confidence: 0.88,
          matchedVia: "alias_dictionary",
          isCanonical: true,
        };
      }
    }
  }

  // 4. Fallback: Clean title-cased slug generation
  const slug = clean
    .toLowerCase()
    .replace(/[^\w\s-]/g, "")
    .replace(/\s+/g, "-");

  // Title case words
  const titleCased = clean
    .split(" ")
    .map((w) => w.charAt(0).toUpperCase() + w.slice(1).toLowerCase())
    .join(" ");

  return {
    rawName: clean,
    canonicalName: titleCased,
    slug,
    category: "technical",
    isEmerging: false,
    confidence: 0.70,
    matchedVia: "heuristic_normalized",
    isCanonical: false,
  };
}
