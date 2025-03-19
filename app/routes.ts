import { type RouteConfig, index, route } from "@react-router/dev/routes";

export default [
  index("routes/home.tsx"), // Maps to "/"
  route("login", "routes/login.tsx"), // Maps to "/login"
  route("define-password", "routes/define_password.tsx"), // Maps to "/login"
  route("helloworld", "routes/helloworld.tsx"), // Maps to "/helloworld"
  route("welcome", "welcome/welcome.tsx"), // Maps to "/welcome"
] satisfies RouteConfig;
