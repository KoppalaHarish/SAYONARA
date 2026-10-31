const { PrismaClient } = require("@prisma/client");

const prisma = new PrismaClient();

async function run() {
  try {
    console.log("Connecting to database...");
    await prisma.$connect();
    console.log("Connected successfully!");

    const eligibleCount = await prisma.eligibleStudent.count();
    console.log("EligibleStudent count:", eligibleCount);

    const userCount = await prisma.user.count();
    console.log("User count:", userCount);

    const eventCount = await prisma.event.count();
    console.log("Event count:", eventCount);

    const regCount = await prisma.eventRegistration.count();
    console.log("EventRegistration count:", regCount);

    const attCount = await prisma.attendance.count();
    console.log("Attendance count:", attCount);

    const settingCount = await prisma.festSetting.count();
    console.log("FestSetting count:", settingCount);

    const users = await prisma.user.findMany({
      select: { collegeId: true, name: true, role: true, email: true },
    });
    console.log("Users:", users);

    const sampleEligible = await prisma.eligibleStudent.findMany({ take: 5 });
    console.log("Sample eligible students:", sampleEligible);
  } catch (err) {
    console.error("Prisma error:", err);
  } finally {
    await prisma.$disconnect();
  }
}

run();
