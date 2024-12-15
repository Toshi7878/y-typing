import { auth } from "@/server/auth";

export default auth((req) => {
  const isLoggedIn = !!req.auth;
  const { nextUrl } = req;
  const hasUserName: boolean = isLoggedIn && req.auth?.user?.name ? true : false;

  if (nextUrl.pathname === "/user/register" && (!isLoggedIn || hasUserName)) {
    return Response.redirect(new URL("/", nextUrl), 307);
  }
});

export const config = {
  matcher: ["/user/register"],
};
