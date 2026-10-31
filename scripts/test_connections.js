const { PrismaClient } = require("@prisma/client");

async function testDirect() {
  console.log("Testing DIRECT connection...");
  const directUrl = "postgresql://neondb_owner:npg_9spMRdalf5SO@ep-square-glitter-b5iknr7a.c-7.us-east-2.aws.neon.tech/neondb?sslmode=require&connect_timeout=30";
  const prismaDirect = new PrismaClient({
    datasources: { db: { url: directUrl } },
  });
  try {
    const count = await prismaDirect.eligibleStudent.count();
    console.log("Direct connection SUCCESS! EligibleStudent count:", count);
  } catch (e) {
    console.error("Direct connection FAILED:", e.message);
  } finally {
    await prismaDirect.$disconnect();
  }
}

async function testPooler() {
  console.log("Testing POOLER connection with pgbouncer=true...");
  const poolerUrl = "postgresql://neondb_owner:npg_9spMRdalf5SO@ep-square-glitter-b5iknr7a-pooler.c-7.us-east-2.aws.neon.tech/neondb?sslmode=require&pgbouncer=true&connect_timeout=30";
  const prismaPooler = new PrismaClient({
    datasources: { db: { url: poolerUrl } },
  });
  try {
    const count = await prismaPooler.eligibleStudent.count();
    console.log("Pooler connection SUCCESS! EligibleStudent count:", count);
  } catch (e) {
    console.error("Pooler connection FAILED:", e.message);
  } finally {
    await prismaPooler.$disconnect();
  }
}

async function main() {
  await testDirect();
  await testPooler();
}

main();
