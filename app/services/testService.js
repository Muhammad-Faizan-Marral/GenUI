export async function testService(text) {
  console.log("🔄 Trying Groq...");
  const res = await fetch("/api/chat", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ message: text, system: "you are ui designer" }),
  });
  if (!res.ok) throw new Error(`Groq Error: ${res.status}`);
  const data = await res.json();
  return data
}
