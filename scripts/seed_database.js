const { PrismaClient } = require("@prisma/client");
const bcrypt = require("bcryptjs");
const fs = require("fs");
const path = require("path");

const prisma = new PrismaClient();

const STUDENTS = [
  { sNo: 1, collegeId: "O221137", name: "TUMMI JYOTHSNA" },
  { sNo: 2, collegeId: "O220702", name: "VARIKUTI LOKESWAREDDY" },
  { sNo: 3, collegeId: "O221048", name: "MARLA SOWMYA" },
  { sNo: 4, collegeId: "O220552", name: "PERINA SNEHASRI" },
  { sNo: 5, collegeId: "S220697", name: "THURUPATI DEEPA" },
  { sNo: 6, collegeId: "O221160", name: "SIDDABOINA BRAMHAJI" },
  { sNo: 7, collegeId: "O220281", name: "VADLAMUDI SIVA NARAYANA" },
  { sNo: 8, collegeId: "S220198", name: "RAVIPATI HIMA VARSHINI" },
  { sNo: 9, collegeId: "O220090", name: "PARIMI ROHAK" },
  { sNo: 10, collegeId: "S220178", name: "SAREDDY GOWTHAMI" },
  { sNo: 11, collegeId: "O220473", name: "PONNADA ALEKHYA SUBRAHMANYA VALLI" },
  { sNo: 12, collegeId: "O221170", name: "NELAMALLI TEJASREE" },
  { sNo: 13, collegeId: "O220928", name: "MADHIRA MADHU PRIYA" },
  { sNo: 14, collegeId: "O220792", name: "CHILAKALAPUDI GOURIPUJITHA" },
  { sNo: 15, collegeId: "O220436", name: "MALLEM SREENIVASULU" },
  { sNo: 16, collegeId: "O220348", name: "JANAGAM SRILAXMI" },
  { sNo: 17, collegeId: "O220486", name: "GANISETTI YAMINI NAGA DURGA" },
  { sNo: 18, collegeId: "O220134", name: "TAMMA BRAMARAMBA" },
  { sNo: 19, collegeId: "O220151", name: "MERIKAPUDI VENKATA BRAMHENDRA KUMAR" },
  { sNo: 20, collegeId: "O220627", name: "PATHAN SHARUK KHAN" },
  { sNo: 21, collegeId: "O221012", name: "K SRINIVAS" },
  { sNo: 22, collegeId: "O221102", name: "MESA SWATHI" },
  { sNo: 23, collegeId: "S221178", name: "CHEJARLA ARCHANA" },
  { sNo: 24, collegeId: "O221010", name: "ANDRAJU YONA" },
  { sNo: 25, collegeId: "O220820", name: "PARABATHINA REENA JESSY KIRAN" },
  { sNo: 26, collegeId: "O220643", name: "KATURI SOWMYA" },
  { sNo: 27, collegeId: "O220480", name: "SAMEERA SHAIK" },
  { sNo: 28, collegeId: "O220922", name: "JATOTH NANDINI" },
  { sNo: 29, collegeId: "O220779", name: "KATTA KALYANI" },
  { sNo: 30, collegeId: "O220430", name: "MALLADI NAGALAKSHMI" },
  { sNo: 31, collegeId: "O220101", name: "PUTTA SIVALEELA" },
  { sNo: 32, collegeId: "O220917", name: "MALLISETTY RUSHMITHA" },
  { sNo: 33, collegeId: "S220059", name: "GAVVALA MAHESH KUMAR" },
  { sNo: 34, collegeId: "O221021", name: "VANDRASI SRAVANI" },
  { sNo: 35, collegeId: "O220741", name: "THOTA TIRUPATAMMA" },
  { sNo: 36, collegeId: "O220118", name: "NALLURI BHAVYA SRI" },
  { sNo: 37, collegeId: "O220042", name: "KAMINENI BINDU MEGHANA" },
  { sNo: 38, collegeId: "O220653", name: "PULAGORLA LAKSHMI" },
  { sNo: 39, collegeId: "O220599", name: "KANDIPATI NEHARIKA" },
  { sNo: 40, collegeId: "O220445", name: "NEESU CHAITANYASREE" },
  { sNo: 41, collegeId: "O220276", name: "JATAVATHU UMAMAHESWARI BAI" },
  { sNo: 42, collegeId: "S220671", name: "KOLAPARTHI CHARSHITHA" },
  { sNo: 43, collegeId: "O220345", name: "SHAIK DILSHA" },
  { sNo: 44, collegeId: "O220082", name: "MADDU SHOWRI SUDEEP" },
  { sNo: 45, collegeId: "O220770", name: "VINTI SAILAJA" },
  { sNo: 46, collegeId: "S220586", name: "ARURU AMUKTHA MALYADA" },
  { sNo: 47, collegeId: "O220107", name: "ASADI PRATIBHA KUMARI" },
  { sNo: 48, collegeId: "O220757", name: "TANIKONDA NAVYA SREE" },
  { sNo: 49, collegeId: "O220931", name: "MOTAPOTHULA VENKATA NAGA NAVYA" },
  { sNo: 50, collegeId: "O221107", name: "CHILUMURI SUMANYA" },
  { sNo: 51, collegeId: "O220339", name: "BUSSA MOHAN TEJA" },
  { sNo: 52, collegeId: "O221106", name: "AVULASETTY SRAVANTHI" },
  { sNo: 53, collegeId: "S220031", name: "VELUGOTI LATHIKA REDDY" },
  { sNo: 54, collegeId: "O220458", name: "DURISALA RESHMA" },
  { sNo: 55, collegeId: "O221142", name: "MANIMALA GANGA" },
  { sNo: 56, collegeId: "O220615", name: "GOPAVARAPU NIHARIKA" },
  { sNo: 57, collegeId: "O220505", name: "PERISETLA PAVANI" },
  { sNo: 58, collegeId: "O220412", name: "VINJAMURI MOULIKA NAGA LAKSHMI" },
  { sNo: 59, collegeId: "O220193", name: "NAGURU KEERTHI" },
  { sNo: 60, collegeId: "O220610", name: "SHAIK SALMA" },
  { sNo: 61, collegeId: "O220286", name: "ANDRA SAI CHARAN" },
  { sNo: 62, collegeId: "O221037", name: "DHULIPALLA SAI RAMOJI KARTHIKEYA" },
  { sNo: 63, collegeId: "S221124", name: "SAIKAM YAMINI" },
  { sNo: 64, collegeId: "O220818", name: "KOMMATHOTI MARIYAMMA" },
  { sNo: 65, collegeId: "O220830", name: "NENAVATH MOUNIKA BAI" },
  { sNo: 66, collegeId: "O220451", name: "KADULURU CHERISHMA" },
  { sNo: 67, collegeId: "O220559", name: "LOLLA PUJITHA" },
  { sNo: 68, collegeId: "O221148", name: "MAMIDI SIVANI" },
  { sNo: 69, collegeId: "O221077", name: "MULAGUNDLA VARSHINI" },
  { sNo: 70, collegeId: "O220933", name: "KOPPALA HARIESH" },
  { sNo: 71, collegeId: "O220184", name: "BATTINA AKHILANDESWARI" },
  { sNo: 72, collegeId: "O220519", name: "THORLAKONDA VENKATA VASAVI" },
  { sNo: 73, collegeId: "O220037", name: "TALASILA RUPA SREE" },
  { sNo: 74, collegeId: "O211031", name: "GUJJALA SHIVA" },
  { sNo: 75, collegeId: "O221036", name: "CHIDELLA SIVA NAGARAJU" },
  { sNo: 76, collegeId: "O221029", name: "JANNETI LALITHA" },
  { sNo: 77, collegeId: "S220109", name: "BADDAM AKANKSHA" },
  { sNo: 78, collegeId: "O220426", name: "LENKA SATHVIKA" },
  { sNo: 79, collegeId: "O220269", name: "BHOGIREDDI TEJA SRI" },
  { sNo: 80, collegeId: "O220397", name: "BADAMPUDI LAKSHMI DURGA" },
  { sNo: 81, collegeId: "O220547", name: "SHAIK SAMEERA" },
  { sNo: 82, collegeId: "O220102", name: "CHAVALA DIVYA SRI" },
  { sNo: 83, collegeId: "O221168", name: "KONCHADA CHARAN KUMAR" },
  { sNo: 84, collegeId: "S220621", name: "CHINTHAGUNTLA ROJA" },
  { sNo: 85, collegeId: "O221099", name: "BADINEEDI SAI POOJITHA" },
  { sNo: 86, collegeId: "O221011", name: "UYYALA MEGHANA" },
  { sNo: 87, collegeId: "O220543", name: "ALURI PRIYADARSHINI" },
  { sNo: 88, collegeId: "O220637", name: "NEELI KEERTHANA" },
  { sNo: 89, collegeId: "O220307", name: "VOTLA DOLADEVI" },
  { sNo: 90, collegeId: "O210962", name: "DUGGIRALA DEEKSHITHA" },
  { sNo: 91, collegeId: "O220027", name: "PARVATHAM RUSHITHA" },
  { sNo: 92, collegeId: "O220936", name: "BANAVATHU PREM KUMAR" },
  { sNo: 93, collegeId: "O220285", name: "SIBBALA JYOTHI" },
  { sNo: 94, collegeId: "O220114", name: "PALEPU SIVA KOTESWARA RAO" },
  { sNo: 95, collegeId: "O211064", name: "MALA SREERAM" },
  { sNo: 96, collegeId: "O220177", name: "NAGARIKANTI VENKATA SRAVANI" },
  { sNo: 97, collegeId: "O220699", name: "GALI GNAHITHA REDDY" },
  { sNo: 98, collegeId: "O220399", name: "AYYALURI KIRAN MAI" },
  { sNo: 99, collegeId: "O220687", name: "CHALAMALA SASIDHAR" },
  { sNo: 100, collegeId: "O221114", name: "SAGI JYOTHI PRIYA" },
  { sNo: 101, collegeId: "O220879", name: "SHAIK SABIHA" },
  { sNo: 102, collegeId: "O220564", name: "YEMINEDI SUMANJALI" },
  { sNo: 103, collegeId: "O220336", name: "ELAPARTHI SANJANA" },
  { sNo: 104, collegeId: "O221143", name: "GANTA SRAVANI" },
  { sNo: 105, collegeId: "O220648", name: "YALAMANCHILI MOUNIKA" },
  { sNo: 106, collegeId: "O220796", name: "BANDA GOVARDHAN" },
  { sNo: 107, collegeId: "O220305", name: "PATHIPATI NAGALAKSHMI" },
  { sNo: 108, collegeId: "S220664", name: "DUDEKULA AZAD ALI" },
  { sNo: 109, collegeId: "O220401", name: "JANNI TEJA" },
  { sNo: 110, collegeId: "O220431", name: "KALLURI DURGA BHAVANI" },
  { sNo: 111, collegeId: "O220077", name: "KOMMI SREEMITHA" },
  { sNo: 112, collegeId: "O221125", name: "BOMMANA NIHARIKA" },
  { sNo: 113, collegeId: "O220651", name: "NANDI YASWANTH" },
  { sNo: 114, collegeId: "S220467", name: "PALAVARI NAVYASREE" },
  { sNo: 115, collegeId: "O220688", name: "JALLI MAHENDRA" },
  { sNo: 116, collegeId: "O220565", name: "CHITTA NAGA SARAYU" },
  { sNo: 117, collegeId: "O221126", name: "AKIRI MADHU" },
  { sNo: 118, collegeId: "O220729", name: "K DURGA SRI" },
  { sNo: 119, collegeId: "O220255", name: "JEEREDDY ABINAYA SREE" },
  { sNo: 120, collegeId: "O220136", name: "SANDADI SURYA TEJA" },
  { sNo: 121, collegeId: "O220708", name: "SHAIK AFRINA" },
  { sNo: 122, collegeId: "O220557", name: "KAMA ASHWITHA" },
  { sNo: 123, collegeId: "S220231", name: "TALLA NAGA VENKATA PUJITHA" },
  { sNo: 124, collegeId: "O220359", name: "BOMMISETTY BALA YASASWI" },
  { sNo: 125, collegeId: "O220866", name: "MANDLA AKHILA" },
  { sNo: 126, collegeId: "S220524", name: "SHAIK THOUHID" },
  { sNo: 127, collegeId: "O220941", name: "KANAKAPUDI SINDHU" },
  { sNo: 128, collegeId: "O221111", name: "ANDELA PRANATHI SRI KAVYA" },
  { sNo: 129, collegeId: "O220167", name: "SHAIK SUHEL AKTAR" },
  { sNo: 130, collegeId: "O221026", name: "RAMELLA CHANDRA SEKHAR" },
  { sNo: 131, collegeId: "O220664", name: "SHAIK SHAGUFTHA" },
  { sNo: 132, collegeId: "O220546", name: "SYED IMAN" },
  { sNo: 133, collegeId: "O210840", name: "SUHANA SK" },
  { sNo: 134, collegeId: "O220382", name: "PASAM VENKATA DEVENDRA NATH" },
  { sNo: 135, collegeId: "O220363", name: "VENNA VIJAYA LAKSHMI" },
  { sNo: 136, collegeId: "S220318", name: "JINKALA VIDYA" },
  { sNo: 137, collegeId: "S220339", name: "THOKALA VAMSI" },
  { sNo: 138, collegeId: "O220186", name: "RACHURI MADHURAVANI" },
  { sNo: 139, collegeId: "O220200", name: "SYED TAHASIN" },
  { sNo: 140, collegeId: "O220435", name: "MALAVATHU KARTHIK" },
  { sNo: 141, collegeId: "O220622", name: "VURE ANUHYA" },
  { sNo: 142, collegeId: "O220836", name: "KASUKURTHI DEEPTHI" },
  { sNo: 143, collegeId: "O220754", name: "PALTHYAVATH SATHYA" },
  { sNo: 144, collegeId: "O211077", name: "BORIGORLA VYSHNAVI" },
  { sNo: 145, collegeId: "O220558", name: "YELCHURI BHAVYASRI" },
  { sNo: 146, collegeId: "O220870", name: "VUTLA VAISHANAVI" },
  { sNo: 147, collegeId: "O220794", name: "SAVARAM JAGADHEESH" },
  { sNo: 148, collegeId: "O220240", name: "GUNTUPALLI NAVYA LAKSHMI" },
  { sNo: 149, collegeId: "O220821", name: "AKURATHI MARIYA SRI" },
  { sNo: 150, collegeId: "O220756", name: "RUNJALA CHARAN RAJ" },
  { sNo: 151, collegeId: "O220456", name: "AMBATI SIVA KUMAR" },
  { sNo: 152, collegeId: "O220601", name: "DHARAVATHU SANDHYA RANI" },
  { sNo: 153, collegeId: "O220859", name: "GANDEM PHANI KUMAR" },
  { sNo: 154, collegeId: "O220455", name: "YARLAGADDA MADHU LATHA" },
  { sNo: 155, collegeId: "O220180", name: "NIDAMANURI RAM CHARAN" },
  { sNo: 156, collegeId: "O220058", name: "ANNAPA REDDY JYOTHI" },
  { sNo: 157, collegeId: "O221078", name: "BURE JAGAN" },
  { sNo: 158, collegeId: "O220202", name: "GOSULA JAHNAVI" },
  { sNo: 159, collegeId: "O220035", name: "ERRI APARNA" },
  { sNo: 160, collegeId: "O220625", name: "ANNAMDEVARA DURGA NAGA GOWRI HARSHITHA" },
  { sNo: 161, collegeId: "O220503", name: "GUDE HEMALATHA" },
  { sNo: 162, collegeId: "O220032", name: "YELLIGARAPU MADHAVI" },
  { sNo: 163, collegeId: "O220869", name: "ADIREDDY SWATHI" },
  { sNo: 164, collegeId: "O220617", name: "GULLIPALLI MAHESWARI" },
];

async function seed() {
  console.log("Starting Neon PostgreSQL database seeding...");

  // 1. Seed Eligible Students (all 164 students)
  console.log(`Seeding ${STUDENTS.length} eligible students to Neon...`);
  let inserted = 0;
  for (const s of STUDENTS) {
    await prisma.eligibleStudent.upsert({
      where: { collegeId: s.collegeId },
      update: { name: s.name, year: "3rd Year", batch: "O22" },
      create: {
        collegeId: s.collegeId,
        name: s.name,
        year: "3rd Year",
        department: "CSE",
        batch: "O22",
      },
    });
    inserted++;
  }
  console.log(`Successfully seeded ${inserted} students into EligibleStudent table.`);

  // 2. Seed Admin User
  const salt = bcrypt.genSaltSync(10);
  const adminPasswordHash = bcrypt.hashSync("Admin@Sayonara2026", salt);
  await prisma.user.upsert({
    where: { collegeId: "CSE-ADMIN" },
    update: { passwordHash: adminPasswordHash },
    create: {
      id: "usr_admin_001",
      name: "CSE Head Coordinator",
      collegeId: "CSE-ADMIN",
      year: "4th Year",
      department: "CSE",
      email: "admin@sayonara.cse",
      phone: "+91 98765 43210",
      passwordHash: adminPasswordHash,
      role: "admin",
      qrToken: "SAY-ADM-998811",
    },
  });
  console.log("Seeded Admin user (CSE-ADMIN).");

  // 3. Seed Default Fest Events
  const events = [
    {
      id: "evt_001",
      name: "Terminal Velocity: Farewell Code-Off",
      tagline: "Speed algorithm clash & bug hunt",
      description: "A fast-paced 3-hour algorithmic duel featuring data structures, reverse-engineering, and optimization challenges crafted by graduating seniors.",
      category: "Technical",
      rules: [
        "Individual participation only (open to 3rd & 4th year CSE)",
        "Languages allowed: C++, Java, Python3, Go, Rust",
        "3 algorithmic challenges + 1 obfuscated bug-fix challenge",
        "Automated judging via test suite with memory & time limits",
      ],
      eligibility: "3rd & 4th Year CSE Students",
      maxParticipants: 80,
      date: "MARCH / APRIL 2026",
      time: "10:30 AM - 01:30 PM",
      venue: "Turing Lab (3rd Floor)",
      registrationStatus: "OPEN",
      iconName: "Code2",
    },
    {
      id: "evt_002",
      name: "Frag Fest: LAN Esports Championship",
      tagline: "Valorant & BGMI inter-batch supremacy",
      description: "5v5 custom lobby tactical showdown between 3rd year challengers and graduating 4th year seniors.",
      category: "Gaming",
      rules: [
        "Team of 5 + 1 substitute",
        "Double elimination bracket",
        "Bring your own peripherals (laptops/mice permitted)",
      ],
      eligibility: "3rd & 4th Year CSE Students",
      maxParticipants: 64,
      date: "MARCH / APRIL 2026",
      time: "11:00 AM - 04:00 PM",
      venue: "High Performance Computing Lab",
      registrationStatus: "FILLING_FAST",
      iconName: "Gamepad2",
    },
    {
      id: "evt_003",
      name: "Retro-Byte: Senior Roast & Confessions",
      tagline: "Unfiltered laughter, bloopers, & nostalgia",
      description: "An open-mic stage where faculty quirks, Turing lab all-nighters, placement heartbreak, and batch inside jokes take center stage.",
      category: "Fun",
      rules: [
        "Performers must adhere to respectful humor boundaries",
        "Solo or group skits permitted (max 7 minutes)",
        "Video submissions must be pre-screened with coordinators",
      ],
      eligibility: "All CSE Students & Faculty",
      maxParticipants: 150,
      date: "MARCH / APRIL 2026",
      time: "02:30 PM - 04:30 PM",
      venue: "Main College Auditorium",
      registrationStatus: "OPEN",
      iconName: "Sparkles",
    },
    {
      id: "evt_004",
      name: "Synapse Beats: Acoustic & Cultural Gala",
      tagline: "Musical harmonies honoring graduating seniors",
      description: "Live musical bands, energetic choreography, and instrumental solos performed by junior batches as a tribute to their graduating seniors.",
      category: "Cultural",
      rules: [
        "Auditions required prior to main stage appearance",
        "Performance track limit: 6 minutes",
      ],
      eligibility: "Open to all registered attendees",
      maxParticipants: 200,
      date: "MARCH / APRIL 2026",
      time: "05:00 PM - 07:30 PM",
      venue: "Open Air Amphitheatre",
      registrationStatus: "OPEN",
      iconName: "Music",
    },
    {
      id: "evt_005",
      name: "The Hall of Fame: Memento Conferral",
      tagline: "Honoring the 2021-2027 Graduating Batch (6-Year Integrated)",
      description: "The official farewell ceremony featuring personalized mementos celebrating the 6-year journey (2 years PUC + 4 years B.Tech), batch awards, faculty speech, formal banquet, and DJ celebration.",
      category: "Ceremony",
      rules: [
        "Formal attire recommended",
        "Official Sayonara Gate Pass strictly required for memento conferral",
      ],
      eligibility: "4th Year Graduating Seniors (2021-2027) & 3rd Year Organizers (2022-2028)",
      maxParticipants: 250,
      date: "MARCH / APRIL 2026",
      time: "07:30 PM - 10:30 PM",
      venue: "Grand Convention Center & Banquet Lawn",
      registrationStatus: "OPEN",
      iconName: "Award",
    },
    {
      id: "evt_006",
      name: "Binary Blitz: Rapid Tech Quiz & Trivia",
      tagline: "CS fundamentals, meme trivia, & easter eggs",
      description: "Lightning buzzer rounds testing OS scheduling, computer history, hacker trivia, and department folklore.",
      category: "Technical",
      rules: [
        "Teams of 2",
        "Negative marking in buzzer round",
      ],
      eligibility: "3rd & 4th Year CSE Students",
      maxParticipants: 50,
      date: "MARCH / APRIL 2026",
      time: "11:30 AM - 01:00 PM",
      venue: "Seminar Hall 2",
      registrationStatus: "OPEN",
      iconName: "Code2",
    },
    {
      id: "evt_007",
      name: "Polaroid Pavilion: Batch Vault Photobooth",
      tagline: "Instant memories with batch signature walls",
      description: "A continuous photo experience with farewell props, retro cameras, personal signature diaries, and instant print keepsakes.",
      category: "Fun",
      rules: ["Open throughout festival hours to all pass holders"],
      eligibility: "All Pass Holders",
      maxParticipants: 300,
      date: "MARCH / APRIL 2026",
      time: "10:00 AM - 07:00 PM",
      venue: "CSE Department Quadrangle",
      registrationStatus: "OPEN",
      iconName: "Sparkles",
    },
  ];

  for (const ev of events) {
    await prisma.event.upsert({
      where: { id: ev.id },
      update: ev,
      create: ev,
    });
  }
  console.log(`Seeded ${events.length} fest events into Event table.`);

  // 4. Seed Fest Settings
  await prisma.festSetting.upsert({
    where: { id: "default" },
    update: {},
    create: {
      id: "default",
      festName: "SAYONARA",
      subtitle: "CSE FAREWELL FEST",
      tagline: "A farewell experience built by CSE, for CSE. Celebrating 6 years: 2 years PUC & 4 years B.Tech.",
      department: "Computer Science & Engineering",
      eventDate: "COMING SOON (MARCH / APRIL 2027)",
      venue: "CSE BLOCK",
      registrationOpen: true,
      eligibleYears: ["3rd Year", "4th Year"],
      contactEmail: "rhariesh1@gmail.com",
      contactPhone: "+91 7842439105",
      heroNotice: "Official Registrations Open • 6-Year Integrated B.Tech • CSE BLOCK",
      bannerMessage: "CELEBRATING 2021-2027 BATCH (6 YEARS: 2 YRS PUC + 4 YRS B.TECH) • CSE BLOCK • MARCH / APRIL 2027",
    },
  });
  console.log("Seeded fest settings.");

  // Also write all 164 students into sayonara-db.json for offline fallback
  const dbJsonPath = path.join(__dirname, "..", "data", "sayonara-db.json");
  if (fs.existsSync(dbJsonPath)) {
    const raw = JSON.parse(fs.readFileSync(dbJsonPath, "utf-8"));
    const existing = raw.eligibleStudents || [];
    for (const s of STUDENTS) {
      if (!existing.some((e) => e.collegeId.toUpperCase() === s.collegeId.toUpperCase())) {
        existing.push({
          collegeId: s.collegeId,
          name: s.name,
          year: "3rd Year",
          department: "CSE",
          batch: "O22",
        });
      }
    }
    raw.eligibleStudents = existing;
    fs.writeFileSync(dbJsonPath, JSON.stringify(raw, null, 2), "utf-8");
    console.log(`Updated data/sayonara-db.json eligibleStudents roster (${raw.eligibleStudents.length} total students).`);
  }

  const eligibleCount = await prisma.eligibleStudent.count();
  const eventCount = await prisma.event.count();
  const userCount = await prisma.user.count();

  console.log("\n==============================================");
  console.log("NEON DATABASE SEEDING COMPLETED SUCCESSFULLY!");
  console.log(`- Eligible Students in Neon: ${eligibleCount}`);
  console.log(`- Fest Events in Neon:       ${eventCount}`);
  console.log(`- Users in Neon:             ${userCount}`);
  console.log("==============================================\n");

  await prisma.$disconnect();
}

seed().catch((err) => {
  console.error("Seeding failed:", err);
  process.exit(1);
});
