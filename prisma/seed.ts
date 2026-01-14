import { PrismaClient, Timeframe, ShortVideoStatus } from '@prisma/client';
const prisma = new PrismaClient();

async function main() {
  // Verify DB connectivity before seeding
  try {
    await prisma.$connect();
  } catch (connectErr) {
    console.error('Database unreachable, skipping TypeScript seed. Error:', (connectErr as Error).message);
    await prisma.$disconnect();
    return;
  }
  // Create or reuse admin user
  const admin = await prisma.user.upsert({
    where: { email: 'admin@opsvantagedigital.online' },
    update: { name: 'Admin' },
    create: {
      email: 'admin@opsvantagedigital.online',
      name: 'Admin',
      role: 'admin',
    },
  });

  // Create or reuse OpsVantage workspace
  const workspace = await prisma.workspace.upsert({
    where: { slug: 'opsvantage' },
    update: { ownerId: admin.id },
    create: {
      name: 'OpsVantage',
      slug: 'opsvantage',
      ownerId: admin.id,
    },
  });

  // Membership: upsert via composite unique
  await prisma.userWorkspaceMembership.upsert({
    where: { userId_workspaceId: { userId: admin.id, workspaceId: workspace.id } },
    update: { role: 'owner' },
    create: { userId: admin.id, workspaceId: workspace.id, role: 'owner' },
  });

  // Niches
  const niches = [
    { name: 'Psychology of Everyday Behavior', description: 'Behavioral psychology insights.' },
    { name: 'Productivity Systems', description: 'Systems for productivity and focus.' },
    { name: 'AI for Humans', description: 'AI tools and tips for everyday people.' },
  ];

  for (const n of niches) {
    await prisma.niche.upsert({
      where: { workspaceId_name: { workspaceId: workspace.id, name: n.name } },
      update: { description: n.description },
      create: { workspaceId: workspace.id, name: n.name, description: n.description },
    });
  }

  // 30-day content plan for "Psychology of Everyday Behavior"
  const niche = await prisma.niche.findUnique({ where: { workspaceId_name: { workspaceId: workspace.id, name: 'Psychology of Everyday Behavior' } } });
  if (niche) {
    // Create content plan and shorts
    const startDate = new Date();
    const endDate = new Date(Date.now() + 30 * 24 * 60 * 60 * 1000);
    const plan = await prisma.contentPlan.create({
      data: {
        workspaceId: workspace.id,
        nicheId: niche.id,
        timeframe: Timeframe.monthly,
        startDate,
        endDate,
        shortVideos: {
          create: Array.from({ length: 30 }, (_, i) => ({
            workspaceId: workspace.id,
            nicheId: niche.id,
            dayIndex: i + 1,
            hook: `Psychology Hook #${i + 1}`,
            title: '',
            script: '',
            hashtags: '',
            status: ShortVideoStatus.idea,
          })),
        },
      },
      include: { shortVideos: true },
    });

    console.log('Seeded 30-day content plan:', plan.id, 'with', plan.shortVideos.length, 'shorts');
  } else {
    console.warn('Niche not found for seeding content plan');
  }
}

main()
  .then(() => { console.log('Seeding complete'); })
  .catch((e) => { console.error('Seeding failed:', e); process.exit(1); })
  .finally(() => prisma.$disconnect());
