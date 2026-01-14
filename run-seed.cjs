(async () => {
  try {
    await import('./dist/prisma/seed.js');
  } catch (e) {
    console.error('Seed runner failed:', e);
    process.exit(1);
  }
})();
