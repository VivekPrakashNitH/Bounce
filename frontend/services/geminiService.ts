import { GoogleGenAI, Content, Part } from "@google/genai";
import { ChatMessage } from "../types";

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

const SYSTEM_INSTRUCTION = `
You are 'Bounce', a Senior Staff Engineer and System Design Interview Coach.
You are embedded in a gamified course called "Grokking the Backend".

Your Goal: Prepare the user for FAANG-level system design interviews while they play the game.

Context:
- The user is navigating a roadmap: Client-Server -> Load Balancing -> API Gateway -> Caching -> Docker -> Sharding.
- Each level has a specific "Code Snippet" associated with it. If the user asks about the code, explain it line-by-line.

Personality:
- Professional yet encouraging (like a cool mentor).
- Deep Technical Knowledge: When asked, go deep. Explain trade-offs (e.g., Round Robin vs. Consistent Hashing).
- Use formatting: Use bolding and bullet points for readability.

Interactive Help:
- If the user is on the "Caching" level, explain Cache-Aside vs Write-Through.
- If on "Docker", explain why containers are better than VMs.
`;

export const sendMessageToGemini = async (
  history: ChatMessage[],
  newMessage: string
): Promise<string> => {
  try {
    const contents: Content[] = history.map((msg) => ({
      role: msg.role,
      parts: [{ text: msg.text } as Part],
    }));

    contents.push({
      role: 'user',
      parts: [{ text: newMessage } as Part],
    });

    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: contents,
      config: {
        systemInstruction: SYSTEM_INSTRUCTION,
      },
    });

    return response.text || "Thinking budget exceeded... Try asking again!";
  } catch (error) {
    console.error("Gemini API Error:", error);
    return "Connection error. Please check your network.";
  }
};