// services/editService.js

export async function processAiEdit(sectionCode, elementId, userPrompt) {
  const systemPrompt = `
    You are a precise JSX editor. 
    You will receive a complete JSX section code.
    Your task: Find the element with data-gen-id="${elementId}" and modify it based on this request: "${userPrompt}".
    
    CRITICAL RULES:
    1. ONLY change the target element.
    2. Keep all other code, structures, and data-gen-ids EXACTLY the same.
    3. If the user asks for style changes, use Tailwind classes.
    4. Return ONLY the updated JSX code, no explanations.
  `;

  const response = await fetch("/api/grok", { // Tumhara OpenRouter API route
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      model: "openrouter/elephant-alpha",
      messages: [
        { role: "system", content: systemPrompt },
        { role: "user", content: sectionCode }
      ],
    }),
  });

  const data = await response.json();
  const updatedCode = data.content?.[0]?.text || data.content || "";
  
  // Clean markdown if AI sends it
  return updatedCode.replace(/```[a-zA-Z]*\n/g, "").replace(/```/g, "").trim();
}