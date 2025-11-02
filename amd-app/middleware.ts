export { default } from "next-auth/middleware";

export const config = {
  matcher: [
    // Protect everything except login and any API routes
    "/((?!login|api/).*)"
  ]
};
