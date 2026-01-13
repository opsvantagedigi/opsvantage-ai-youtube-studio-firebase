// Prisma config (CommonJS) using defineConfig from '@prisma/config'
try {
  const { defineConfig } = require('@prisma/config');
  module.exports = defineConfig({
    client: { engineType: 'binary' },
    datasource: {
      provider: "postgresql",
      url: process.env.DATABASE_URL,
    },
  });
} catch (e) {
  // Fallback: export a plain object if @prisma/config is unavailable in this environment
  module.exports = {
    client: { engineType: 'binary' },
    datasource: { url: process.env.DATABASE_URL },
  };
}
