import { DatasetSchema, DatasetType } from "./types";

export const DATASET_SCHEMAS: Record<DatasetType, DatasetSchema> = {
  job_postings: {
    id: "job_postings",
    title: "Job Postings (Demand Signals)",
    description: "Industry vacancies, titles, required competencies, salary bands, and job descriptions.",
    targetTable: "public.job_postings",
    requiredColumns: ["title", "company_name", "district", "sector", "vacancies", "raw_description"],
    uniqueKeys: ["company_name", "title", "district", "posting_date"],
    columns: [
      {
        name: "title",
        label: "Job Title",
        required: true,
        type: "string",
        description: "Official designation of the role",
        example: "EV Battery Assembly Technician",
      },
      {
        name: "company_name",
        label: "Company / Employer",
        required: true,
        type: "string",
        description: "Name of the hiring enterprise",
        example: "Tata Motors Electric Vehicles",
      },
      {
        name: "district",
        label: "District Location",
        required: true,
        type: "string",
        description: "Target district name in India",
        example: "Pune",
      },
      {
        name: "sector",
        label: "Industry Sector",
        required: true,
        type: "string",
        description: "Valid industrial trade sector",
        example: "automotive_ev",
        validator: (val) => {
          const valid = [
            "information_technology",
            "automotive_ev",
            "renewable_energy",
            "manufacturing_cnc",
            "healthcare_allied",
            "electronics_semiconductor",
            "construction_infrastructure",
            "logistics_supplychain",
          ];
          if (!valid.includes(String(val).toLowerCase())) {
            return `Sector must be one of: ${valid.join(", ")}`;
          }
          return null;
        },
      },
      {
        name: "vacancies",
        label: "Vacancies Count",
        required: true,
        type: "integer",
        description: "Number of open positions (must be > 0)",
        example: "15",
        validator: (val) => {
          const num = Number(val);
          if (isNaN(num) || num <= 0) return "Vacancies count must be a positive integer.";
          return null;
        },
      },
      {
        name: "experience_min",
        label: "Min Experience (Years)",
        required: false,
        type: "number",
        description: "Minimum required years of experience",
        example: "1.0",
      },
      {
        name: "experience_max",
        label: "Max Experience (Years)",
        required: false,
        type: "number",
        description: "Maximum years of experience",
        example: "3.0",
      },
      {
        name: "salary_min",
        label: "Min Salary (INR / Annum)",
        required: false,
        type: "number",
        description: "Annual starting salary floor",
        example: "300000",
      },
      {
        name: "salary_max",
        label: "Max Salary (INR / Annum)",
        required: false,
        type: "number",
        description: "Annual salary ceiling",
        example: "450000",
      },
      {
        name: "raw_description",
        label: "Job Description",
        required: true,
        type: "string",
        description: "Unstructured requirements text used for skill extraction",
        example: "Hands-on experience in lithium battery testing, CAN bus diagnostics...",
      },
      {
        name: "posting_date",
        label: "Posting Date",
        required: false,
        type: "date",
        description: "Date when job was posted (YYYY-MM-DD)",
        example: "2026-08-15",
      },
    ],
  },

  courses: {
    id: "courses",
    title: "Vocational Courses & Trade Registry",
    description: "Registered trade courses, durations, annual intake, and institutional center links.",
    targetTable: "public.courses",
    requiredColumns: ["training_center_code", "course_name", "course_code", "trade_sector", "duration_hours", "duration_months", "annual_capacity"],
    uniqueKeys: ["training_center_code", "course_code"],
    columns: [
      {
        name: "training_center_code",
        label: "Training Center Code",
        required: true,
        type: "string",
        description: "Unique institution code (e.g. ITI-MH-PUN-01)",
        example: "ITI-MH-PUN-01",
      },
      {
        name: "course_name",
        label: "Course Title",
        required: true,
        type: "string",
        description: "Trade or course program name",
        example: "Electric Vehicle Service Technician",
      },
      {
        name: "course_code",
        label: "Course Code",
        required: true,
        type: "string",
        description: "Standard course curriculum code",
        example: "EV-TECH-201",
      },
      {
        name: "trade_sector",
        label: "Trade Sector",
        required: true,
        type: "string",
        description: "Sector classification",
        example: "automotive_ev",
      },
      {
        name: "duration_hours",
        label: "Total Duration (Hours)",
        required: true,
        type: "integer",
        description: "Curriculum total training hours",
        example: "1200",
        validator: (val) => (Number(val) > 0 ? null : "Duration hours must be > 0"),
      },
      {
        name: "duration_months",
        label: "Duration (Months)",
        required: true,
        type: "number",
        description: "Program length in months",
        example: "12",
        validator: (val) => (Number(val) > 0 ? null : "Duration months must be > 0"),
      },
      {
        name: "annual_capacity",
        label: "Annual Intake Capacity",
        required: true,
        type: "integer",
        description: "Sanctioned annual student intake",
        example: "60",
        validator: (val) => (Number(val) >= 0 ? null : "Capacity must be >= 0"),
      },
    ],
  },

  curriculum: {
    id: "curriculum",
    title: "Curriculum Modules & Taught Competencies",
    description: "Detailed syllabus breakdown including module titles, theory/practical hours, and taught skills.",
    targetTable: "public.course_modules",
    requiredColumns: ["course_code", "module_number", "module_title", "theory_hours", "practical_hours", "skills_covered"],
    uniqueKeys: ["course_code", "module_number"],
    columns: [
      {
        name: "course_code",
        label: "Course Code",
        required: true,
        type: "string",
        description: "Matching course code in registry",
        example: "EV-TECH-201",
      },
      {
        name: "module_number",
        label: "Module Number",
        required: true,
        type: "integer",
        description: "Sequence order of module",
        example: "1",
        validator: (val) => (Number(val) > 0 ? null : "Module number must be > 0"),
      },
      {
        name: "module_title",
        label: "Module Title",
        required: true,
        type: "string",
        description: "Topic heading of module",
        example: "High Voltage Battery Pack Balancing & Assembly",
      },
      {
        name: "theory_hours",
        label: "Theory Hours",
        required: true,
        type: "integer",
        description: "Classroom lecture hours",
        example: "40",
      },
      {
        name: "practical_hours",
        label: "Practical Lab Hours",
        required: true,
        type: "integer",
        description: "Hands-on workshop hours",
        example: "80",
      },
      {
        name: "skills_covered",
        label: "Skills Covered",
        required: true,
        type: "string",
        description: "Comma or pipe-separated skills taught in this module",
        example: "EV Battery Diagnostics, BMS Configuration, High Voltage Safety",
      },
    ],
  },

  trainers: {
    id: "trainers",
    title: "Trainer Readiness & Instructor Registry",
    description: "Vocational faculty records, qualifications, experience, and certified competency domains.",
    targetTable: "public.trainers",
    requiredColumns: ["training_center_code", "name", "qualification", "years_experience", "skills"],
    uniqueKeys: ["training_center_code", "name"],
    columns: [
      {
        name: "training_center_code",
        label: "Training Center Code",
        required: true,
        type: "string",
        description: "Institution code where trainer teaches",
        example: "ITI-MH-PUN-01",
      },
      {
        name: "name",
        label: "Trainer Full Name",
        required: true,
        type: "string",
        description: "Instructor full name",
        example: "Sunil Deshmukh",
      },
      {
        name: "email",
        label: "Trainer Email",
        required: false,
        type: "string",
        description: "Official email address",
        example: "s.deshmukh@iti-pune.gov.in",
      },
      {
        name: "qualification",
        label: "Highest Qualification",
        required: true,
        type: "string",
        description: "Degree / Diploma / Trade Certificate",
        example: "Diploma in Automobile Engineering",
      },
      {
        name: "years_experience",
        label: "Years of Experience",
        required: true,
        type: "number",
        description: "Teaching or industrial experience",
        example: "8.5",
        validator: (val) => (Number(val) >= 0 ? null : "Years experience must be >= 0"),
      },
      {
        name: "skills",
        label: "Certified Skills",
        required: true,
        type: "string",
        description: "Comma-separated list of competencies the trainer is qualified to teach",
        example: "Automotive Electrical, High Voltage Safety, Industrial Safety",
      },
    ],
  },

  equipment: {
    id: "equipment",
    title: "Equipment & Lab Infrastructure",
    description: "Workshop machinery inventories, operational condition counts, and equipment specifications.",
    targetTable: "public.equipment",
    requiredColumns: ["training_center_code", "equipment_name", "trade_sector", "quantity_total", "quantity_operational", "condition_rating"],
    uniqueKeys: ["training_center_code", "equipment_name"],
    columns: [
      {
        name: "training_center_code",
        label: "Training Center Code",
        required: true,
        type: "string",
        description: "Center code owning the equipment",
        example: "ITI-MH-PUN-01",
      },
      {
        name: "equipment_name",
        label: "Machinery / Equipment Name",
        required: true,
        type: "string",
        description: "Model and equipment name",
        example: "EV Traction Battery Cycler 400V 60A",
      },
      {
        name: "trade_sector",
        label: "Trade Sector",
        required: true,
        type: "string",
        description: "Sector classification",
        example: "automotive_ev",
      },
      {
        name: "quantity_total",
        label: "Total Units",
        required: true,
        type: "integer",
        description: "Total physical units owned",
        example: "3",
        validator: (val) => (Number(val) > 0 ? null : "Total quantity must be > 0"),
      },
      {
        name: "quantity_operational",
        label: "Operational Units",
        required: true,
        type: "integer",
        description: "Units currently in working condition",
        example: "2",
        validator: (val, row) => {
          const total = Number(row.quantity_total);
          const op = Number(val);
          if (op < 0) return "Operational units cannot be negative.";
          if (!isNaN(total) && op > total) return "Operational units cannot exceed total quantity.";
          return null;
        },
      },
      {
        name: "condition_rating",
        label: "Condition Rating",
        required: true,
        type: "string",
        description: "Condition: new_commissioned, operational_good, needs_maintenance, non_operational, obsolete",
        example: "operational_good",
      },
    ],
  },

  placements: {
    id: "placements",
    title: "Placement Outcomes & Graduate Records",
    description: "Historical batch graduate outcomes, placement rates, monthly salaries, and recruiter partners.",
    targetTable: "public.placements",
    requiredColumns: ["course_code", "batch_year", "total_graduates", "placed_graduates", "avg_salary_monthly"],
    uniqueKeys: ["course_code", "batch_year"],
    columns: [
      {
        name: "course_code",
        label: "Course Code",
        required: true,
        type: "string",
        description: "Graduation trade course code",
        example: "EV-TECH-201",
      },
      {
        name: "batch_year",
        label: "Batch Year",
        required: true,
        type: "integer",
        description: "Graduation cohort year (2015-2035)",
        example: "2025",
        validator: (val) => {
          const yr = Number(val);
          if (isNaN(yr) || yr < 2015 || yr > 2035) return "Batch year must be between 2015 and 2035.";
          return null;
        },
      },
      {
        name: "total_graduates",
        label: "Total Graduates",
        required: true,
        type: "integer",
        description: "Total students completing the batch",
        example: "56",
        validator: (val) => (Number(val) >= 0 ? null : "Total graduates must be >= 0"),
      },
      {
        name: "placed_graduates",
        label: "Placed Graduates",
        required: true,
        type: "integer",
        description: "Graduates verified as placed in industry jobs",
        example: "46",
        validator: (val, row) => {
          const total = Number(row.total_graduates);
          const placed = Number(val);
          if (placed < 0) return "Placed graduates cannot be negative.";
          if (!isNaN(total) && placed > total) return "Placed graduates cannot exceed total graduates.";
          return null;
        },
      },
      {
        name: "avg_salary_monthly",
        label: "Average Monthly Salary (INR)",
        required: true,
        type: "number",
        description: "Mean monthly starting wage",
        example: "27500",
        validator: (val) => (Number(val) >= 0 ? null : "Salary must be >= 0"),
      },
      {
        name: "top_placement_partner",
        label: "Top Recruiter Partner",
        required: false,
        type: "string",
        description: "Lead employer hiring from batch",
        example: "Tata Motors EV & Ather Energy",
      },
    ],
  },

  employer_surveys: {
    id: "employer_surveys",
    title: "Employer Surveys & Curriculum Validation",
    description: "Industry feedback ratings (1-5), missing shopfloor capabilities, and hiring commitments.",
    targetTable: "public.employer_feedback",
    requiredColumns: ["company_name", "district", "course_code", "relevance_score", "curriculum_modernity_score", "hiring_intent_graduates", "feedback_notes"],
    uniqueKeys: ["company_name", "course_code"],
    columns: [
      {
        name: "company_name",
        label: "Employer Company Name",
        required: true,
        type: "string",
        description: "Valid company name submitting review",
        example: "Tata Motors Passenger EV",
      },
      {
        name: "district",
        label: "District",
        required: true,
        type: "string",
        description: "District where enterprise operates",
        example: "Pune",
      },
      {
        name: "course_code",
        label: "Course Code Reviewed",
        required: true,
        type: "string",
        description: "Trade syllabus code evaluated",
        example: "EV-TECH-201",
      },
      {
        name: "relevance_score",
        label: "Relevance Score (1-5)",
        required: true,
        type: "integer",
        description: "Rating of curriculum relevance to current shopfloor (1=obsolete, 5=ideal)",
        example: "4",
        validator: (val) => {
          const score = Number(val);
          if (isNaN(score) || score < 1 || score > 5) return "Relevance score must be an integer between 1 and 5.";
          return null;
        },
      },
      {
        name: "curriculum_modernity_score",
        label: "Modernity Score (1-5)",
        required: true,
        type: "integer",
        description: "Rating of whether technologies taught reflect modern tools",
        example: "3",
        validator: (val) => {
          const score = Number(val);
          if (isNaN(score) || score < 1 || score > 5) return "Modernity score must be an integer between 1 and 5.";
          return null;
        },
      },
      {
        name: "hiring_intent_graduates",
        label: "Hiring Intent (Count)",
        required: true,
        type: "integer",
        description: "Number of aligned graduates company anticipates hiring annually",
        example: "25",
        validator: (val) => (Number(val) >= 0 ? null : "Hiring intent must be >= 0"),
      },
      {
        name: "feedback_notes",
        label: "Qualitative Feedback Notes",
        required: true,
        type: "string",
        description: "Specific missing skills, obsolete topics, or tool recommendations",
        example: "Add 30 hours of CAN Bus diagnostics and high-voltage BMS isolation testing.",
      },
    ],
  },
};
