import { NextResponse } from "next/server"
import type { NextRequest } from "next/server"
import { createClient } from "@/lib/supabase/server"

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl

  if (pathname.startsWith("/amela-portal") || pathname.startsWith("/teuni-portal")) {
    console.log("[v0] Middleware: Processing standalone portal route:", pathname)
    console.log("[v0] Middleware: Allowing standalone portal implementation to load")

    // Let the standalone portal implementation handle the request
    return NextResponse.next()
  }

  if (pathname.startsWith("/provider/")) {
    console.log("[v0] Middleware: Processing internal provider route:", pathname)

    const supabase = createClient()

    try {
      const userAgent = request.headers.get("user-agent") || ""
      const isPWA =
        userAgent.includes("wv") ||
        userAgent.includes("Mobile") ||
        request.headers.get("x-requested-with") === "com.android.browser.application_id" ||
        request.headers.get("sec-fetch-dest") === "document"

      console.log("[v0] PWA Detection:", { isPWA, userAgent: userAgent.substring(0, 100) })

      // Extract provider ID from URL
      const pathParts = pathname.split("/")
      const providerId = pathParts[2] // /provider/[providerId]/...

      if (providerId && providerId !== "unified") {
        let providerData

        // Check if it's a UUID format
        const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i

        if (uuidRegex.test(providerId)) {
          // Direct UUID lookup
          const { data, error: providerError } = await supabase
            .from("service_providers")
            .select("id, has_portal, is_active, name, alias")
            .eq("id", providerId)
            .single()
          providerData = data

          if (providerError) {
            console.log("[v0] Provider UUID lookup error:", providerError)
          }
        } else {
          // Alias lookup
          const { data, error: providerError } = await supabase
            .from("service_providers")
            .select("id, has_portal, is_active, name, alias")
            .eq("alias", providerId)
            .single()
          providerData = data

          if (providerError) {
            console.log("[v0] Provider alias lookup error:", providerError)
          }
        }

        console.log("[v0] Provider validation:", {
          providerId,
          providerData,
          has_portal: providerData?.has_portal,
          is_active: providerData?.is_active,
          isPWA,
        })

        if (!providerData) {
          console.log("[v0] Provider not found, redirecting to unauthorized")
          return NextResponse.redirect(new URL("/unauthorized?reason=provider_not_found", request.url))
        }

        if (!providerData.has_portal) {
          console.log("[v0] Provider portal not activated, redirecting to unauthorized")
          return NextResponse.redirect(new URL("/unauthorized?reason=portal_not_activated", request.url))
        }

        if (!providerData.is_active) {
          console.log("[v0] Provider access deactivated, redirecting to unauthorized")
          return NextResponse.redirect(new URL("/unauthorized?reason=access_deactivated", request.url))
        }

        if (isPWA) {
          console.log("[v0] PWA access granted for provider:", providerData.name)
        }
      }

      const response = NextResponse.next()
      if (isPWA) {
        response.headers.set("x-pwa-access", "true")
        response.headers.set("Cache-Control", "no-cache, no-store, must-revalidate")
      }

      return response
    } catch (error) {
      console.error("Middleware error:", error)
      return NextResponse.next()
    }
  }

  return NextResponse.next()
}

export const config = {
  matcher: ["/provider/:path*", "/api/provider/:path*", "/amela-portal/:path*", "/teuni-portal/:path*"],
}
