// Ensure Prisma uses the binary engine by default when not set
if (!process.env.PRISMA_CLIENT_ENGINE_TYPE) {
  process.env.PRISMA_CLIENT_ENGINE_TYPE = 'binary';
}

// Lazy proxy that forwards all property access to the runtime PrismaClient
// created by `getPrisma()` to avoid constructing PrismaClient at module
// evaluation time (which triggers issues during Next.js build).
const { getPrisma } = require('./getPrisma');

const handler: ProxyHandler<any> = {
  get(_target, prop) {
    const real = getPrisma();
    const value = real[prop as keyof typeof real];
    if (typeof value === 'function') return value.bind(real);
    return value;
  },
};

export const prisma = new Proxy({}, handler) as any;

export { getPrisma };

