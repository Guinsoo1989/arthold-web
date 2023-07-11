import { defineConfig } from "umi";

export default defineConfig({
  plugins: ["@umijs/plugins/dist/antd", "@umijs/plugins/dist/request"],
  antd: {},
  request: {},
  routes: [
    { path: "/", component: "index"},
    { path: "/friend", component: "FriendPage" },
    // { path: "/docs", component: "docs" },
  ],
  npmClient: "pnpm",
  proxy: {
    '/mj-api': {
      // 'target': 'https://mj-api-art.zeabur.app/',
      'target': 'http://localhost:8080/',
      'changeOrigin': true,
      'pathRewrite': { '^/mj-api' : '' },
    },
  },
});
