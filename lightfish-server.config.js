import { defineConfig } from '@lightfish/server';

export default defineConfig({
  port: 3000,
  apiDir: './server/router',
  appName: 'app-mdview', // 应用名称，用于数据库schema前缀
  env: 'dev', // dev, online
});
