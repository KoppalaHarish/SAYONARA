const { PrismaClient } = require("@prisma/client");

const directUrl =
  "postgresql://neondb_owner:npg_9spMRdalf5SO@ep-square-glitter-b5iknr7a.c-7.us-east-2.aws.neon.tech/neondb?sslmode=require&connect_timeout=30&pool_timeout=30";

const prisma = new PrismaClient({
  datasources: { db: { url: directUrl } },
});

async function inspectSchema() {
  try {
    const tables = await prisma.$queryRaw`
      SELECT table_name 
      FROM information_schema.tables 
      WHERE table_schema = 'public';
    `;
    console.log("Tables in public schema:", tables);

    const columns = await prisma.$queryRaw`
      SELECT table_name, column_name, data_type 
      FROM information_schema.columns 
      WHERE table_schema = 'public' 
      ORDER BY table_name, ordinal_position;
    `;
    console.log("Columns:", columns);
  } catch (err) {
    console.error("Error inspecting schema:", err);
  } finally {
    await prisma.$disconnect();
  }
}

inspectSchema();
