import { NextResponse } from 'next/server'
import { NextRequest } from 'next/server'
export { default } from "next-auth/middleware"
import { getToken } from 'next-auth/jwt'
 
// This function can be marked `async` if using `await` inside
export async function middleware(request: NextRequest) {

    const token = await getToken({req:request})
    const curr_url = request.nextUrl;

    if(token && token.role=="Client" && (
        curr_url.pathname.startsWith(`/sign-in`)||
        curr_url.pathname.startsWith(`/verify-email`)||
        curr_url.pathname.startsWith(`/sign-up`)

    )){
  return NextResponse.redirect(new URL('/', request.url))
    }
    else if(token && token.role=="Admin"){
        return NextResponse.redirect(new URL('/dashboard',request.url))
    }
    // user does not have token but registered 
    // user does not have token and not registered
  return NextResponse.next()
}
 
// See "Matching Paths" below to learn more
export const config = {
  matcher:['/',
    '/sign-in',
    '/verify-email',
    '/sign-up',
    '/dashboard/:path*',
    '/verify/:path*'
  ],
}