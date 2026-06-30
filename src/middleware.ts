import { clerkMiddleware, createRouteMatcher } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";

const isPublicRoute = createRouteMatcher(["/", "/sign-in(.*)", "/sign-up(.*)", "/(Men|Women|Accessories)(.*)", "/product/:slug", "/all"]);

export default clerkMiddleware((auth, request) => {
  if (isPublicRoute(request)) return NextResponse.next();
  auth().protect();
});

export const config = {
  matcher: ["/((?!api|_next/static|_next/image|.+\\.[\\w]+$).*)"],
};
