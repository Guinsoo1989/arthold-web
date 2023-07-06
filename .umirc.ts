import { defineConfig } from "umi";

export default defineConfig({
  plugins: ["@umijs/plugins/dist/antd", "@umijs/plugins/dist/request"],
  antd: {},
  request: {},
  routes: [
    { path: "/", component: "index", name: "home" },
    // { path: "/docs", component: "docs" },
  ],
  npmClient: "pnpm",
  proxy: {
    '/mj-api': {
      'target': 'https://mj-api-art.zeabur.app/',
      'changeOrigin': true,
      'pathRewrite': { '^/mj-api' : '' },
    },
  },
});
