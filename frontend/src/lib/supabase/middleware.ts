import { createServerClient } from "@supabase/ssr";
import { NextResponse, type NextRequest } from "next/server";

export async function updateSession(request: NextRequest) {
  let supabaseResponse = NextResponse.next({
    request,
  });

  // CSRF Origin verification for state-changing API requests
  const method = request.method.toUpperCase();
  if (["POST", "PATCH", "DELETE", "PUT"].includes(method) && request.nextUrl.pathname.startsWith("/api/")) {
    const origin = request.headers.get("origin");
    const host = request.headers.get("host");
    if (origin && host) {
      try {
        const originUrl = new URL(origin);
        if (originUrl.host !== host) {
          return NextResponse.json(
            { error: "Cross-origin state-changing requests are prohibited." },
            { status: 403 }
          );
        }
      } catch {
        return NextResponse.json({ error: "Invalid Origin header." }, { status: 400 });
      }
    }
  }

  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const supabaseAnonKey =
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ||
    process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY;

  // If Supabase is not configured yet, allow the request through so user can view setup instructions
  if (!supabaseUrl || !supabaseAnonKey || supabaseUrl.includes("placeholder") || supabaseAnonKey === "placeholder-anon-key") {
    return supabaseResponse;
  }

  const supabase = createServerClient(supabaseUrl, supabaseAnonKey, {
    cookies: {
      getAll() {
        return request.cookies.getAll();
      },
      setAll(cookiesToSet) {
        cookiesToSet.forEach(({ name, value }) => request.cookies.set(name, value));
        supabaseResponse = NextResponse.next({
          request,
        });
        cookiesToSet.forEach(({ name, value, options }) =>
          supabaseResponse.cookies.set(name, value, options)
        );
      },
    },
  });

  // refreshing the auth token
  const {
    data: { user },
  } = await supabase.auth.getUser();

  const isAuthPage =
    request.nextUrl.pathname.startsWith("/login") ||
    request.nextUrl.pathname.startsWith("/signup") ||
    request.nextUrl.pathname.startsWith("/forgot-password");

  const isProtectedPage =
    request.nextUrl.pathname.startsWith("/dashboard") ||
    request.nextUrl.pathname.startsWith("/labour-market") ||
    request.nextUrl.pathname.startsWith("/skill-intelligence") ||
    request.nextUrl.pathname.startsWith("/curriculum-xray") ||
    request.nextUrl.pathname.startsWith("/skill-gaps") ||
    request.nextUrl.pathname.startsWith("/decision-engine") ||
    request.nextUrl.pathname.startsWith("/district-intelligence") ||
    request.nextUrl.pathname.startsWith("/training-capacity") ||
    request.nextUrl.pathname.startsWith("/trainer-readiness") ||
    request.nextUrl.pathname.startsWith("/equipment-planning") ||
    request.nextUrl.pathname.startsWith("/employer-validation") ||
    request.nextUrl.pathname.startsWith("/placement-outcomes") ||
    request.nextUrl.pathname.startsWith("/simulator") ||
    request.nextUrl.pathname.startsWith("/candidate-career-path") ||
    request.nextUrl.pathname.startsWith("/skill-graph") ||
    request.nextUrl.pathname.startsWith("/data-management") ||
    request.nextUrl.pathname.startsWith("/settings");

  // If user is not authenticated and attempts to access protected page, redirect to login
  if (!user && isProtectedPage) {
    const url = request.nextUrl.clone();
    url.pathname = "/login";
    url.searchParams.set("next", request.nextUrl.pathname);
    return NextResponse.redirect(url);
  }

  // If user is authenticated and attempts to access login/signup, redirect to dashboard
  if (user && isAuthPage) {
    const url = request.nextUrl.clone();
    url.pathname = "/dashboard";
    return NextResponse.redirect(url);
  }

  return supabaseResponse;
}
