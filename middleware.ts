import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl
  console.log('Middleware - Request path:', pathname)
  
  // Log más detalles de la solicitud
  console.log('Request headers:', Object.fromEntries(request.headers))
  console.log('Request method:', request.method)
  
  // Si es la ruta raíz y no tiene barra final, agrégala
  if (pathname === '') {
    const url = request.nextUrl.clone()
    url.pathname = '/'
    return NextResponse.redirect(url)
  }

  return NextResponse.next()
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - api (API routes)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - any file with a dot (e.g., .js, .css, etc.)
     */
    '/((?!api|_next/static|_next/image|favicon.ico|.*\\..*).*)',
  ],
} 