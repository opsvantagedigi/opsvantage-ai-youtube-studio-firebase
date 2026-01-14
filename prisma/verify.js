const { PrismaClient } = require('@prisma/client');
(async () => {
  const prisma = new PrismaClient();
  try {
    const userCount = await prisma.user.count();
    const workspaceCount = await prisma.workspace.count();
    const nicheCount = await prisma.niche.count();
    const planCount = await prisma.contentPlan.count();
    const shortCount = await prisma.shortVideo.count();
    console.log('counts:', { userCount, workspaceCount, nicheCount, planCount, shortCount });
  } catch (e) {
    console.error('verify error', e.message || e);
    process.exitCode = 1;
  } finally {
    await prisma.$disconnect();
  }
})();
