import { getAuth } from "@/lib/auth/server";

export default function middleware(request: any) {
  return getAuth().middleware({
    loginUrl: "/sign-in",
    publicRoutes: [
      "/",
      "/Men",
      "/Women",
      "/Accessories",
      "/all",
      "/product",
      "/search",
      "/sign-in",
      "/sign-up",
      "/wishlist",
      "/api",
    ],
  })(request);
}

export const config = {
  matcher: [
    "/((?!_next/static|_next/image|favicon.ico).*)",
  ],
};
