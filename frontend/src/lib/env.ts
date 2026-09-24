/**
 * Environment configuration for Skill Sync AI.
 * Validates and exposes typed environment variables.
 */

export const env = {
  supabaseUrl: process.env.NEXT_PUBLIC_SUPABASE_URL || "",
  supabaseAnonKey:
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ||
    process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY ||
    "",
  appUrl: process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000",
  analyticsServiceUrl: process.env.NEXT_PUBLIC_ANALYTICS_SERVICE_URL || "http://localhost:8000",
  isSupabaseConfigured: Boolean(
    process.env.NEXT_PUBLIC_SUPABASE_URL &&
    (process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY) &&
    !process.env.NEXT_PUBLIC_SUPABASE_URL.includes("your-project-ref") &&
    !process.env.NEXT_PUBLIC_SUPABASE_URL.includes("placeholder") &&
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY !== "placeholder-anon-key"
  ),
  isAiConfigured: Boolean(
    typeof process !== "undefined" &&
    process.env.GROQ_API_KEY &&
    !process.env.GROQ_API_KEY.includes("your_groq") &&
    !process.env.GROQ_API_KEY.includes("placeholder") &&
    process.env.GROQ_API_KEY.trim().length > 10
  ),
  isAnalyticsConfigured: Boolean(
    process.env.NEXT_PUBLIC_ANALYTICS_SERVICE_URL &&
    !process.env.NEXT_PUBLIC_ANALYTICS_SERVICE_URL.includes("placeholder") &&
    process.env.NEXT_PUBLIC_ANALYTICS_SERVICE_URL.trim().length > 0
  ),
};

export function assertSupabaseConfigured() {
  if (!env.isSupabaseConfigured) {
    throw new Error(
      "Supabase credentials are not configured. Please add NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_ANON_KEY to .env.local"
    );
  }
}

