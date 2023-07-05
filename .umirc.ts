import { defineConfig } from "umi";

export default defineConfig({
  plugins: ['@umijs/plugins/dist/antd', '@umijs/plugins/dist/react-query'],
  antd: {},
  reactQuery: {},
  routes: [
    { path: "/", component: "index" },
    { path: "/docs", component: "docs" },
    { path: "/products", component: "products" },
  ],
  npmClient: 'pnpm',
});
