import { auth } from "@/lib/auth/server";

export default auth.middleware({
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
});

export const config = {
  matcher: [
    "/((?!_next/static|_next/image|favicon.ico).*)",
  ],
};
