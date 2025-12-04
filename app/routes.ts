import { type RouteConfig, index } from "@react-router/dev/routes";

export default [
  index("routes/home.tsx"),
  {
    path: ":userID/dashboard",
    file: "routes/dashboard/page.tsx",
  },
    {
    path: "redirect",
    file: "routes/redirect.tsx"
    }
] satisfies RouteConfig;
