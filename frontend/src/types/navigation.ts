import {
  LayoutDashboard,
  TrendingUp,
  Brain,
  ScanSearch,
  Scale,
  MapPin,
  GraduationCap,
  Users,
  Wrench,
  CheckCircle2,
  Briefcase,
  Sliders,
  Cpu,
  Compass,
  Database,
  Settings,
  Network,
  LucideIcon,
} from "lucide-react";
import { UserRole } from "@/lib/roles";

export type NavCategory =
  | "intelligence"
  | "alignment"
  | "readiness"
  | "validation"
  | "planning"
  | "candidate"
  | "system";

export interface NavItem {
  title: string;
  href: string;
  icon: LucideIcon;
  description: string;
  badge?: string;
  roles?: UserRole[]; // If not specified, accessible to all
  category: NavCategory;
}

export const DASHBOARD_NAV_ITEMS: NavItem[] = [
  // GROUP 1: INTELLIGENCE
  {
    title: "Dashboard",
    href: "/dashboard",
    icon: LayoutDashboard,
    description: "Workforce intelligence overview and evidence-based metrics",
    category: "intelligence",
  },
  {
    title: "Labour Market",
    href: "/labour-market",
    icon: TrendingUp,
    description: "Industry hiring signals, job volumes, and sector shifts",
    category: "intelligence",
  },
  {
    title: "Skill Intelligence",
    href: "/skill-intelligence",
    icon: Brain,
    description: "Normalized taxonomy, skill extraction, and skill radar",
    category: "intelligence",
  },
  {
    title: "Skill Graph",
    href: "/skill-graph",
    icon: Network,
    description: "Interactive graph linking jobs, skills, courses, and trainers",
    badge: "Interactive",
    category: "intelligence",
  },

  // GROUP 2: ALIGNMENT
  {
    title: "Curriculum X-Ray",
    href: "/curriculum-xray",
    icon: ScanSearch,
    description: "Deep audit of vocational course syllabi vs industry requirements",
    category: "alignment",
  },
  {
    title: "Skill Gaps",
    href: "/skill-gaps",
    icon: Scale,
    description: "Deficit quantification and missing capabilities across trades",
    category: "alignment",
  },

  // GROUP 3: TRAINING READINESS
  {
    title: "Training Capacity",
    href: "/training-capacity",
    icon: GraduationCap,
    description: "Institutional intake capacities, batch sizing, and seat utilization",
    category: "readiness",
  },
  {
    title: "Trainer Readiness",
    href: "/trainer-readiness",
    icon: Users,
    description: "Trainer qualification audits and upskilling hour requirements",
    category: "readiness",
  },
  {
    title: "Equipment Planning",
    href: "/equipment-planning",
    icon: Wrench,
    description: "Lab machinery, operational ratios, and equipment deficit alerts",
    category: "readiness",
  },

  // GROUP 4: VALIDATION & OUTCOMES
  {
    title: "Employer Validation",
    href: "/employer-validation",
    icon: CheckCircle2,
    description: "Direct industry review loop, curriculum endorsement, and feedback",
    category: "validation",
  },
  {
    title: "Placement Outcomes",
    href: "/placement-outcomes",
    icon: Briefcase,
    description: "Historical graduate tracking, salary benchmarks, and hiring returns",
    category: "validation",
  },

  // GROUP 5: WORKFORCE PLANNING
  {
    title: "Decision Engine",
    href: "/decision-engine",
    icon: Cpu,
    description: "Explainable multi-signal action recommendations with governance sign-off",
    badge: "10 Actions",
    category: "planning",
  },
  {
    title: "District Intelligence",
    href: "/district-intelligence",
    icon: MapPin,
    description: "District-level training capacities, geo-hotspots, and regional deltas",
    category: "planning",
  },
  {
    title: "What-If Simulator",
    href: "/simulator",
    icon: Sliders,
    description: "Policy & budget scenario simulation with placement impact projections",
    badge: "Simulator",
    category: "planning",
  },

  // GROUP 6: CANDIDATE
  {
    title: "Career Path",
    href: "/candidate-career-path",
    icon: Compass,
    description: "Personalized skill roadmap, bridge courses, and employer requirements",
    category: "candidate",
  },

  // SYSTEM & GOVERNANCE
  {
    title: "Data Ingestion",
    href: "/data-management",
    icon: Database,
    description: "Dataset validation, file imports, and audit log tracking",
    roles: ["admin", "government"],
    category: "system",
  },
  {
    title: "Settings",
    href: "/settings",
    icon: Settings,
    description: "Platform parameters, environment health, and profile credentials",
    category: "system",
  },
];
