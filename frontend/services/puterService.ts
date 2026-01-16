import { ChatMessage } from "../types";

declare global {
  interface Window {
    puter?: any;
  }
}

const PERSONA_PROMPT = `
You are Bounce, a playful yet expert backend and system design mentor inside a gamified course.
Teach interactively, keep answers concise (3-6 sentences), prefer bullets for clarity,
and frequently relate concepts to real systems (API Gateway, Caching, Sharding, Queues, Docker).
Encourage with short next-step questions when helpful.
`;

const waitForPuter = () =>
  new Promise<any>((resolve, reject) => {
    const maxAttempts = 50;
    let attempts = 0;
    const timer = setInterval(() => {
      attempts += 1;
      if (window.puter?.ai?.chat) {
        clearInterval(timer);
        resolve(window.puter);
      }
      if (attempts >= maxAttempts) {
        clearInterval(timer);
        reject(new Error("Puter.ai failed to load"));
      }
    }, 100);
  });

export const sendMessageToPuter = async (
  history: ChatMessage[],
  newMessage: string
): Promise<string> => {
  try {
    const puter = await waitForPuter();

    const historyText = history
      .map((msg) => `${msg.role === "user" ? "User" : "Bounce"}: ${msg.text}`)
      .join("\n");

    const prompt = `${PERSONA_PROMPT}

Conversation so far:
${historyText}
User: ${newMessage}
Bounce:`;

    const response = await puter.ai.chat(prompt, {
      model: "gpt-4o-mini",
      temperature: 0.4,
    });

    if (typeof response === "string") return response;
    if (response?.text) return response.text;
    if (response?.message?.content) return response.message.content;
    return "I couldn't get a reply from Puter. Try again?";
  } catch (error) {
    console.error("Puter AI Error:", error);
    return "Puter AI is still loading or unreachable. Please try again in a moment.";
  }
};