import Anthropic from "@anthropic-ai/sdk";

// Marconi runs server-side so the ANTHROPIC_API_KEY is never exposed to the browser.
// Set ANTHROPIC_API_KEY in your Vercel project (Settings → Environment Variables).

// Default to the most capable model. For a high-traffic public bot you can lower
// cost by switching to "claude-haiku-4-5" (cheapest) or "claude-sonnet-5".
const MODEL = "claude-opus-4-8";

const SYSTEM_PROMPT = `You are Marconi, the friendly AI assistant for the IEEE Antennas and Propagation Society (AP-S) Student Branch Chapter at the Institute of Engineering & Management (IEM), Kolkata, India.

Your job is to answer visitors' questions ("doubts") about the chapter clearly and warmly. Keep answers short and conversational (2-5 sentences unless more detail is genuinely needed). Respond directly — do not show your reasoning or say "based on...". Use a helpful, encouraging tone fitting a student tech community.

WHAT YOU KNOW ABOUT THE CHAPTER:
- The IEEE AP-S IEM Student Branch Chapter advances Electromagnetics, Antennas, and Wave Propagation through student-led innovation in Eastern India.
- Based at IEM, Kolkata (coordinates 22.5726 N, 88.3639 E).
- Vision: to be the premier student-led community driving innovation in antenna technology, electromagnetic research, and wireless communication across Eastern India.

INITIATIVES / PROGRAMS:
- Webinars — online technical sessions and expert talks.
- Workshops — hands-on training (e.g. a MATLAB Workshop).
- Tech Talks — seminars by industry and academic experts.
- Industrial Visits — field trips to tech companies and research facilities.
- Special Events — major gatherings including PromptX, Sytron (with sub-events: Game Day, Free Fire Tournament, Robotics, Robo Soccer), and Eclypse (a collaboration between IEEE IEM AP-S and IEEE IEM MTT-S).

CONFERENCES the chapter highlights:
- IEEE MAPCON, IEEE APSCON, IEEE AP-S/URSI, and IEEE IMAS — major global antennas & propagation conferences.

HOW TO JOIN:
- Interested students can join via IEEE membership and the chapter. Point them to the "Join the Mission" option on the website and the chapter's social media for the latest sign-up details.

CONTACT / SOCIAL:
- LinkedIn: the "IEEE IEM AP-S Student Branch Chapter" page.
- Instagram: @ieeeiemaps.official

RULES:
- If you don't know something specific (exact dates, fees, a person's contact), say so honestly and suggest reaching out via the chapter's Instagram (@ieeeiemaps.official) or LinkedIn.
- Only answer questions related to the chapter, IEEE, antennas/electromagnetics, and the events/topics above. If asked something clearly unrelated, politely steer back to how you can help with IEEE AP-S IEM.
- Never invent dates, prices, names, or links you weren't given.`;

type ChatMessage = { role: "user" | "assistant"; content: string };

export default async function handler(req: any, res: any) {
  if (req.method !== "POST") {
    res.status(405).json({ error: "Method not allowed" });
    return;
  }

  const apiKey = process.env.ANTHROPIC_API_KEY;
  if (!apiKey) {
    res.status(500).json({ error: "Chat is not configured yet (missing ANTHROPIC_API_KEY)." });
    return;
  }

  try {
    const body = typeof req.body === "string" ? JSON.parse(req.body) : req.body;
    const incoming: unknown = body?.messages;

    // Sanitize: keep only well-formed user/assistant turns, cap history and length.
    const messages: ChatMessage[] = (Array.isArray(incoming) ? incoming : [])
      .filter(
        (m: any) =>
          m &&
          (m.role === "user" || m.role === "assistant") &&
          typeof m.content === "string" &&
          m.content.trim().length > 0
      )
      .slice(-10)
      .map((m: any) => ({ role: m.role, content: String(m.content).slice(0, 2000) }));

    if (messages.length === 0 || messages[messages.length - 1].role !== "user") {
      res.status(400).json({ error: "Expected a conversation ending in a user message." });
      return;
    }

    const client = new Anthropic({ apiKey });

    const response = await client.messages.create({
      model: MODEL,
      max_tokens: 1024,
      system: SYSTEM_PROMPT,
      messages,
    });

    const reply = response.content
      .filter((b) => b.type === "text")
      .map((b: any) => b.text)
      .join("\n")
      .trim();

    res.status(200).json({ reply: reply || "Sorry, I couldn't come up with a response. Try rephrasing?" });
  } catch (err: any) {
    console.error("Marconi chat error:", err?.message || err);
    res.status(500).json({ error: "Marconi is having trouble right now. Please try again in a moment." });
  }
}
