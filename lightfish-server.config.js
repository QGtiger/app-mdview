import { defineConfig } from '@lightfish/server';

export default defineConfig({
  port: 3000,
  apiDir: './server/router',
  appName: 'app-mdview',
  env: 'dev',
  databaseUrl: 'postgresql://mdview:mdview@localhost:5432/mdview',
});
