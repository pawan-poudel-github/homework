export { default } from "next-auth/middleware";

export const config = {
  matcher: ["/", "/invitation/:path*", "/room/:path*"],
};
