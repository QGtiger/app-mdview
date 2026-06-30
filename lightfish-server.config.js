import { defineConfig } from "@lightfish/server";

export default defineConfig({
  port: 3000,
  apiDir: "./server/router",
  appName: "app-mdview",
  env: "dev",
});
