const fs = require("fs");
const path = require("path");
const { PrismaClient } = require("@prisma/client");

const prisma = new PrismaClient();
const dbJsonPath = path.join(__dirname, "..", "data", "sayonara-db.json");

async function syncAll() {
  console.log("Starting bidirectional sync...");
  const rawJson = JSON.parse(fs.readFileSync(dbJsonPath, "utf-8"));

  // 1. Sync FestSettings to Neon
  if (rawJson.settings) {
    await prisma.festSetting.upsert({
      where: { id: "default" },
      update: {
        festName: rawJson.settings.festName || "SAYONARA",
        subtitle: rawJson.settings.subtitle || "CSE FAREWELL FEST",
        tagline: rawJson.settings.tagline || "A farewell experience built by CSE, for CSE. Celebrating 6 years: 2 years PUC & 4 years B.Tech.",
        department: rawJson.settings.department || "Computer Science & Engineering",
        eventDate: rawJson.settings.eventDate || "20 MARCH 2027",
        venue: rawJson.settings.venue || "CSE BLOCK",
        registrationOpen: rawJson.settings.registrationOpen ?? true,
        eligibleYears: rawJson.settings.eligibleYears || ["3rd Year", "4th Year"],
        contactEmail: rawJson.settings.contactEmail || "rhariesh1@gmail.com",
        contactPhone: rawJson.settings.contactPhone || "+91 7842439105",
        heroNotice: rawJson.settings.heroNotice || "Official Registrations Open • 6-Year Integrated B.Tech • CSE BLOCK",
        bannerMessage: rawJson.settings.bannerMessage || "CELEBRATING 2021-2027 BATCH (6 YEARS: 2 YRS PUC + 4 YRS B.TECH) • CSE BLOCK • 20 MARCH 2027",
      },
      create: {
        id: "default",
        festName: rawJson.settings.festName || "SAYONARA",
        subtitle: rawJson.settings.subtitle || "CSE FAREWELL FEST",
        tagline: rawJson.settings.tagline || "A farewell experience built by CSE, for CSE. Celebrating 6 years: 2 years PUC & 4 years B.Tech.",
        department: rawJson.settings.department || "Computer Science & Engineering",
        eventDate: rawJson.settings.eventDate || "20 MARCH 2027",
        venue: rawJson.settings.venue || "CSE BLOCK",
        registrationOpen: rawJson.settings.registrationOpen ?? true,
        eligibleYears: rawJson.settings.eligibleYears || ["3rd Year", "4th Year"],
        contactEmail: rawJson.settings.contactEmail || "rhariesh1@gmail.com",
        contactPhone: rawJson.settings.contactPhone || "+91 7842439105",
        heroNotice: rawJson.settings.heroNotice || "Official Registrations Open • 6-Year Integrated B.Tech • CSE BLOCK",
        bannerMessage: rawJson.settings.bannerMessage || "CELEBRATING 2021-2027 BATCH (6 YEARS: 2 YRS PUC + 4 YRS B.TECH) • CSE BLOCK • 20 MARCH 2027",
      },
    });
    console.log("Synced FestSettings.");
  }

  // 2. Sync Events to Neon
  if (Array.isArray(rawJson.events)) {
    for (const ev of rawJson.events) {
      await prisma.event.upsert({
        where: { id: ev.id },
        update: {
          name: ev.name,
          tagline: ev.tagline,
          description: ev.description,
          category: ev.category,
          rules: ev.rules || [],
          eligibility: ev.eligibility,
          maxParticipants: ev.maxParticipants,
          date: ev.date,
          time: ev.time,
          venue: ev.venue,
          registrationStatus: ev.registrationStatus,
          iconName: ev.iconName || "Sparkles",
        },
        create: {
          id: ev.id,
          name: ev.name,
          tagline: ev.tagline,
          description: ev.description,
          category: ev.category,
          rules: ev.rules || [],
          eligibility: ev.eligibility,
          maxParticipants: ev.maxParticipants,
          date: ev.date,
          time: ev.time,
          venue: ev.venue,
          registrationStatus: ev.registrationStatus,
          iconName: ev.iconName || "Sparkles",
        },
      });
    }
    console.log(`Synced ${rawJson.events.length} Events.`);
  }

  // 3. Sync Users from JSON DB to Neon
  let usersSynced = 0;
  for (const u of rawJson.users) {
    await prisma.user.upsert({
      where: { collegeId: u.collegeId },
      update: {
        name: u.name,
        year: u.year,
        department: u.department,
        email: u.email,
        phone: u.phone,
        passwordHash: u.passwordHash,
        role: u.role,
        qrToken: u.qrToken,
      },
      create: {
        id: u.id,
        name: u.name,
        collegeId: u.collegeId,
        year: u.year,
        department: u.department,
        email: u.email,
        phone: u.phone,
        passwordHash: u.passwordHash,
        role: u.role,
        qrToken: u.qrToken,
      },
    });

    // If eligible, update isRegistered
    await prisma.eligibleStudent.updateMany({
      where: { collegeId: u.collegeId },
      data: { isRegistered: true },
    });
    usersSynced++;
  }
  console.log(`Synced ${usersSynced} Users to Neon.`);

  // 4. Also fetch any Neon users not in JSON DB and merge them into JSON DB
  const neonUsers = await prisma.user.findMany();
  let mergedToJson = 0;
  for (const nu of neonUsers) {
    const existing = rawJson.users.find(
      (ju) => ju.collegeId.toUpperCase() === nu.collegeId.toUpperCase()
    );
    if (!existing) {
      rawJson.users.push({
        id: nu.id,
        name: nu.name,
        collegeId: nu.collegeId,
        year: nu.year,
        department: nu.department,
        email: nu.email,
        phone: nu.phone,
        passwordHash: nu.passwordHash,
        role: nu.role,
        qrToken: nu.qrToken,
        createdAt: nu.createdAt.toISOString(),
      });
      mergedToJson++;
    }
  }

  // Write back to JSON DB
  fs.writeFileSync(dbJsonPath, JSON.stringify(rawJson, null, 2), "utf-8");
  console.log(`Merged ${mergedToJson} missing users from Neon into sayonara-db.json.`);

  const finalUserCount = await prisma.user.count();
  const finalEligibleCount = await prisma.eligibleStudent.count();
  console.log(`Final state in Neon:`);
  console.log(`- Users: ${finalUserCount}`);
  console.log(`- Eligible Students: ${finalEligibleCount}`);
  console.log("Sync complete!");
}

syncAll()
  .catch((err) => {
    console.error("Sync failed:", err);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
