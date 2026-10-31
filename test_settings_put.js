const http = require("http");

async function testPut() {
  const adminLogin = await fetch("http://localhost:3000/api/auth/login", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ identifier: "CSE-ADMIN", password: "Admin@Sayonara2026" }),
  });
  const cookie = adminLogin.headers.get("set-cookie");

  const putRes = await fetch("http://localhost:3000/api/settings", {
    method: "PUT",
    headers: { "Content-Type": "application/json", Cookie: cookie },
    body: JSON.stringify({
      venue: "TURING AUDITORIUM & TECH CAMPUS LAWNS",
      tagline: "The definitive celebration for CSE Batch of 2026.",
    }),
  });
  const putData = await putRes.json();
  console.log("Settings PUT response:", putRes.status, putData);

  const getRes = await fetch("http://localhost:3000/api/settings");
  const getData = await getRes.json();
  console.log("Updated settings retrieved:", getData.settings.venue, "| Tagline:", getData.settings.tagline);
}

testPut().catch(console.error);
