const fs = require("fs");
const path = require("path");
const { PrismaClient } = require("@prisma/client");

const prisma = new PrismaClient();

const RAW_CSV = `1,O200724,Guna Venkata Sai Kumar
2,O210007,Male Pavani Sai
3,O210008,Desu Sreecharan
4,O210013,Pathan Irfana Khanam
5,O210014,Chiramaneni Rohith
6,O210025,Pathan Imrana Khanam
7,O210030,Tummala Keerthi
8,O210031,Bhima Ruchitha
9,O210036,Jaya Sri Vardhan Samgoju
10,O210053,Inti Yuva Sri
11,O210066,Pasupuleti Venkata Padma
12,O210081,Ankepalli Venkata Kalyani
13,O210087,Jonnadula Mounika
14,O210099,Chandolu Kalyani
15,O210104,Jonnalagadda Sandeep
16,O210115,Venkata Leeladhar Abburi
17,O210119,Sanikommu Vijaya Bhaskar Reddy
18,O210129,Ganjanaboyina Teja Sai Deepika
19,O210137,Golla Nandini
20,O210139,Damarla Seetha Ram Praveen
21,O210143,Padamati Raghuramaiah
22,O210173,Ranganapalem Koteswara Rao
23,O210191,Balla Harshitha
24,O210193,Makkena Aravind
25,O210195,Chegireddy Madhusudhan Reddy
26,O210213,Naidu Pavan
27,O210218,Shaik Younus
28,O210219,Kshatri Rishitha Bai
29,O210221,Chillapalli Thrushna Deepika
30,O210225,Dandu Eswara Lakshmi
31,O210241,Meenuga Arya
32,O210248,Mukkala Ashini
33,O210273,Uppalapati Adhiksha Reddy
34,O210282,Nuthakki Bhargavi
35,O210283,Gogineni Vijayalakshmi
36,O210292,Sivala Devi Sri Prsad
37,O210302,Kommasani Sravanthi
38,O210306,Naraboina Venkatadri
39,O210307,Bevara Manikanta
40,O210314,Vaddemgunta Dharani
41,O210318,Mallireddy Gunalakshmisruthi
42,O210329,Alahari Bhanu Prakash
43,O210339,Ainavilli Satish
44,O210353,Chunduri Karunya
45,O210377,Palli Anusha
46,O210396,Gunda Triveni
47,O210415,Maddu Vishnu Vardhan
48,O210427,Kamanuru Prasanthi
49,O210429,Yellapu Harsha
50,O210433,Muktapuram Pavanarupa
51,O210435,Peddinti Sravani
52,O210446,Asapanna Srihari
53,O210449,Kammari Tejeswar Achari
54,O210459,Ramireddy Harathi
55,O210462,Meduru Sunanda
56,O210473,Sruthi Udatha
57,O210533,Mannuru Harshith Reddy
58,O210604,K.Sruthi
59,O210609,Nimmakayala Jahnavi
60,O210647,Hanumanthu Satyanarayana
61,O210652,Kona Sri Naga Venkata Anand Sai
62,O210667,Madanu Kumar Joseph Mariya Nikhil
63,O210687,Kalavala Venkata Naga Susmitha
64,O210731,Chintha Bhavya Sahithi
65,O210773,Gumpena Sai Venkat
66,O210786,Bitra Dedeepya
67,O210791,Madicharla Naga Mohan
68,O210818,Pilli Srujana
69,O210828,K. Akhila
70,O210829,Velpuri Anand
71,O210835,Mannepalli Priyanka
72,O210842,Shaik Arifa
73,O210855,Shaik Khadeer
74,O210860,Shaik Ayesha Ayub
75,O210870,Yadala Vasavi
76,O210880,Mundru Harika
77,O210896,Kotha Manasa
78,O210900,Swarna Rajasekhar
79,O210910,Moturu Sreesanth
80,O210947,Komarabathina Yonathanu
81,O210963,Ramoji Thoshan Kumar
82,O210970,Memmerla Prajwalitha
83,O210999,Palthe Karthik Naik
84,O211022,Sriramula Bharathi
85,O211049,Basireddy Jaya Sankar Reddy
86,O211105,Edulamudi Vennela
87,S210656,Nellore Deepika Reddy
88,S210688,Gajula Praveena
89,S210768,Suddula Madhu Meghana
90,S211028,Ramavath Bhargavi Bai
91,O210037,Thota Sivanagendrasena
92,O210038,Kokkera Durga Prasad
93,O210045,Ravula Sukanya Lakshami
94,O210048,Balla Prathima
95,O210068,Pokali Deepthika Rani
96,O210075,Seelam Bhargav Rao
97,O210078,Balisetty Lohitha
98,O210095,Nerella Manaswi
99,O210122,Kunchala Jeeshitha
100,O210130,Pamisetty Sandeep Kumar
101,O210149,Vepada Nandini
102,O210187,Putluru Madhusudhanreddy
103,O210205,Rangala Mamatha
104,O210232,Kurella Ranjith Kumar
105,O210245,Kurakula Jaaji
106,O210249,Nidadavolu Nandini
107,O210285,Obenaboina Lavanya
108,O210295,M Chetan Sai Pavan Kumar
109,O210323,Karnam Hemanth Kumar
110,O210355,Devara Ashritha
111,O210364,Pidikiti Yaswanth
112,O210380,Gundlapalli Sivateja
113,O210410,Gollu Gangunaidu
114,O210464,Koratamaddi Yoga Nandini Reddy
115,O210468,Pamisetty Praveenkumar
116,O210484,Eerla Akshaya Deepika
117,O210488,Busam Vinaya
118,O210499,M P Poojitha
119,O210505,Devarajugattu Venkatamadhu
120,O210506,Kunduru Yaswanth Reddy
121,O210509,C.Sreekanth Reddy
122,O210524,Vangali Phani Kumar
123,O210535,Durgam Masthanbee
124,O210537,Gorre Pavani
125,O210540,Teddu Bhargavi
126,O210543,Guttireddy Sudarshan Reddy
127,O210544,Eemani Gayathri
128,O210551,Chakka Pavithra
129,O210557,Runku Chakra Varshini
130,O210569,Shaik Jakeer Hussain
131,O210573,Dasaradha Lovadevi
132,O210576,Narisetty Harshita
133,O210579,Guntaka Kavya
134,O210591,Kala Uday Sai Srikar
135,O210612,Potnuru Tejaswini
136,O210629,Bonu Chaitrika
137,O210650,Sura Udaykiran
138,O210682,Matta Pujitha Devi
139,O210707,Thikkavarapu Sai Pujitha
140,O210712,Koruprolu Jaya Veera Sravani
141,O210741,Shaik Veligandla Yasmin
142,O210754,Korla Ruchitha
143,O210777,Shaik Sayeed Ahmed
144,O210783,Rayapudi Kanthi Swarupa
145,O210794,Jonna Sasank
146,O210815,Vallepu Vijaya Lakshmi
147,O210836,Golla Santhosh Kumar
148,O210861,Eeda Gowtham
149,O210865,Chilaka Bharath
150,O210866,Korivi Rambabu
151,O210871,Shaik Parveen
152,O210873,Devarakonda Devendra
153,O210886,Garnepudi Rayal Vamsi
154,O210897,Salagala Priyanka
155,O210898,Bedampudi Lavanya
156,O210905,Nuthangi Chaitanya Karthik
157,O210908,Bandela Renuka
158,O210920,Valapatla Yaswanth
159,O210928,Billa Yashasri
160,O210935,Perabathina Susmitha
161,O210937,Alapati Jahnavi
162,O210951,Tatapudi Sunny Kiran
163,O210960,Veeravapula Raju
164,O210980,Gadidesi Praisy Paulin
165,O210989,Vadithe Anji Naik
166,O210991,Garikapati Bala Sravani
167,O211000,Palakeerthi Ankitha
168,O211004,Kethavath Poojitha
169,O211007,Pullareddy Sandeep
170,O211036,Lavadiya Kamakshi Bai
171,O211040,Mallireddy Prasanna
172,O211082,Marri Kiran Kumar
173,O211088,Sonthi Nageswara Rao
174,O211117,Seelam Nikhil
175,O211124,Guttula Viswa Vanitha
176,O211125,Vaka Jishnavi
177,O211129,Dokkari Divakar
178,O211136,Keerthi Chinthala
179,S210692,Medidinne Amruthavalli
180,S210754,Tummaluru Sivadeepika
181,O200258,J Venkata Saida Chary
182,O210033,Thippanaboina Ramya
183,O210035,Yarramsetty Sai Sireesha
184,O210044,Pothina Uma Gayathri
185,O210049,Gali Bhavana
186,O210050,Bandarupalli Ramya
187,O210052,Thatiparthi Janaki
188,O210065,Varikunta Lahari
189,O210072,Kondapalli Jhansilakshmi
190,O210091,Annem Sahithi Reddy
191,O210103,Gunji Malleswari
192,O210106,Swargam Yaswanth
193,O210111,Manikumari Yanamalamanda
194,O210112,Papolu Keerthana
195,O210118,Uppu Poorna Sai Bhavana
196,O210121,Uppala Ramadevi
197,O210138,Tavva Bhavya Sri
198,O210145,Kanumuri Chinmayee
199,O210147,Patcharu Naga Venkata Harini
200,O210148,Takelapati Jayanth
201,O210150,Nukala Bala Manikanta Reddy
202,O210158,Ganta Maadesh
203,O210178,Rudraraju Lakshmi Sai Moulika
204,O210190,Shaik Shajida
205,O210198,Chittiboina Vamsi Krishna
206,O210207,Mannam Ramya
207,O210212,Boddu Vinila
208,O210230,Alam Lakshmi Naga Srinivas
209,O210235,Kandlagunta Nikhil Kumar
210,O210250,Sk. Mayif
211,O210263,Kunchala Manoj Kumar
212,O210271,Sure Kalyani
213,O210293,Chaitanya Alubilli
214,O210299,Kalla Eswar
215,O210303,Beeram Gopichand
216,O210308,Nammi Meenakshi
217,O210309,Chitrala Karthik
218,O210326,Allu Koushik
219,O210331,Kolusu Sujatha
220,O210332,Jonnalagadda Yaswanth Krishna
221,O210342,Venni Usha Sri
222,O210343,Vishnu Gopinadh Reddy Kotha
223,O210352,Kandukuri Hari Eswar Sai Mani
224,O210366,Samireddi Jyothi
225,O210367,Dasari Maheswari
226,O210384,Jella Ramanjaneya Reddy
227,O210386,Nagisetty Chinmai Sai Chandana
228,O210405,Doki Poojitha
229,O210425,Senapathi Venkata Sai
230,O210426,Mohammad Hashmat Jaha
231,O210437,Potnuru Kavya Rupini
232,O210444,Koribilli Tejaswini
233,O210448,Naladimmi Vijay Kumar Reddy
234,O210476,Vanteru Jahnavi
235,O210493,Beemireddy Yasaswini
236,O210556,Gujjula Anjali
237,O210570,Gopathi Naga Priyanka
238,O210575,Kota Thanusri
239,O210583,Vanapalli Pavithra
240,O210587,Katta Ruthika
241,O210617,Ch V Ramanjaneya Reddy
242,O210626,Nakka Venkat
243,O210634,Allada Veera Jyothi Sri Maha Lakshmi
244,O210642,Kottapalli Manikanta Vasu
245,O210671,Goli Harshini
246,O210679,Nandyala Koundinya Sai
247,O210692,Nallapati Venkata Varun
248,O210720,Vennapusa Hemalatha
249,O210729,Muddabathina Ayyappa
250,O210757,Malireddy Thanoj Kumar
251,O210762,Rankireddy Naga Sri Nithin
252,O210782,Mandela Amrutha Varshini
253,O210788,Korrakoppula Lavanya
254,O210797,Patteda Sadguna
255,O210820,Boddu Thanushya Srilakshmi
256,O210824,Ramachandrapu Madan
257,O210827,Shaik Sabeena`;

async function seedE4Seniors() {
  console.log("Parsing E4 Seniors list...");
  const lines = RAW_CSV.trim().split("\n");
  const seniors = [];

  for (const line of lines) {
    const parts = line.split(",");
    if (parts.length >= 3) {
      const sNo = parts[0].trim();
      const collegeId = parts[1].trim().toUpperCase();
      const name = parts.slice(2).join(",").trim().toUpperCase();
      seniors.push({
        sNo: parseInt(sNo, 10),
        collegeId,
        name,
        year: "4th Year",
        department: "CSE",
        batch: "O21",
      });
    }
  }

  console.log(`Parsed ${seniors.length} E4 Seniors.`);

  // 1. Update data/sayonara-db.json
  const dbJsonPath = path.join(__dirname, "..", "data", "sayonara-db.json");
  const rawDb = JSON.parse(fs.readFileSync(dbJsonPath, "utf-8"));

  if (!rawDb.eligibleStudents) {
    rawDb.eligibleStudents = [];
  }

  let addedToJson = 0;
  for (const s of seniors) {
    const existingIndex = rawDb.eligibleStudents.findIndex(
      (e) => e.collegeId.toUpperCase() === s.collegeId
    );
    if (existingIndex >= 0) {
      rawDb.eligibleStudents[existingIndex] = {
        collegeId: s.collegeId,
        name: s.name,
        year: "4th Year",
        department: "CSE",
        batch: "O21",
      };
    } else {
      rawDb.eligibleStudents.push({
        collegeId: s.collegeId,
        name: s.name,
        year: "4th Year",
        department: "CSE",
        batch: "O21",
      });
      addedToJson++;
    }
  }

  fs.writeFileSync(dbJsonPath, JSON.stringify(rawDb, null, 2), "utf-8");
  console.log(
    `Updated sayonara-db.json: Total eligible students now = ${rawDb.eligibleStudents.length} (Added ${addedToJson} new E4 seniors).`
  );

  // 2. Push to Neon PostgreSQL
  console.log("Pushing E4 Seniors into Neon PostgreSQL EligibleStudent table...");
  let neonCount = 0;
  for (const s of seniors) {
    try {
      await prisma.eligibleStudent.upsert({
        where: { collegeId: s.collegeId },
        update: {
          name: s.name,
          year: "4th Year",
          department: "CSE",
          batch: "O21",
        },
        create: {
          collegeId: s.collegeId,
          name: s.name,
          year: "4th Year",
          department: "CSE",
          batch: "O21",
          isRegistered: false,
        },
      });
      neonCount++;
    } catch (err) {
      console.error(`Failed to upsert ${s.collegeId} to Neon:`, err.message);
    }
  }

  console.log(`Successfully synced ${neonCount} E4 seniors into Neon PostgreSQL!`);

  const totalNeonEligible = await prisma.eligibleStudent.count();
  console.log(`\n======================================================`);
  console.log(`ALL SENIORS & JUNIORS REGISTERED IN DATABASE:`);
  console.log(`- Total Eligible in JSON DB: ${rawDb.eligibleStudents.length}`);
  console.log(`- Total Eligible in Neon DB: ${totalNeonEligible}`);
  console.log(`======================================================\n`);
}

seedE4Seniors()
  .catch((e) => {
    console.error("Error seeding seniors:", e);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
