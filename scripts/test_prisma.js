const { PrismaClient } = require("@prisma/client");

const prisma = new PrismaClient();

async function main() {
  await prisma.$connect();
  console.log("Prisma connected to Neon PostgreSQL successfully!");
  const userCount = await prisma.user.count();
  console.log("Current users in Neon DB:", userCount);
  await prisma.$disconnect();
}

main().catch((err) => {
  console.error("Connection failed:", err);
  process.exit(1);
});
