// No-op placeholder so Prisma CLI will prefer prisma.config.js
// (kept to avoid removing user file accidentally).
export default {
	datasource: {
		provider: "postgresql",
		url: process.env.DATABASE_URL,
	},
};
