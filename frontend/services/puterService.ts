import { ChatMessage } from "../types";

declare global {
  interface Window {
    puter?: any;
  }
}

// Error type to distinguish errors from normal responses
export interface PuterResponse {
  text: string;
  isError: boolean;
}

const PERSONA_PROMPT = `
You are Bounce, a playful yet expert backend and system design mentor inside a gamified course.
Teach interactively, keep answers concise (3-6 sentences), prefer bullets for clarity,
and frequently relate concepts to real systems (API Gateway, Caching, Sharding, Queues, Docker).
Encourage with short next-step questions when helpful.
`;

const waitForPuter = () =>
  new Promise<any>((resolve, reject) => {
    // If puter is already available, resolve immediately
    if (window.puter?.ai?.chat) {
      resolve(window.puter);
      return;
    }

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
        reject(new Error("Puter AI SDK failed to load. Please check your internet connection and refresh the page."));
      }
    }, 100);
  });

export const sendMessageToPuter = async (
  history: ChatMessage[],
  newMessage: string
): Promise<PuterResponse> => {
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

    let responseText: string;
    if (typeof response === "string") {
      responseText = response;
    } else if (response?.text) {
      responseText = response.text;
    } else if (response?.message?.content) {
      responseText = response.message.content;
    } else {
      return {
        text: "Error: Received empty response from Puter AI. Please try again.",
        isError: true
      };
    }

    return { text: responseText, isError: false };
  } catch (error) {
    console.error("Puter AI Error:", error);
    
    const errorMessage = error instanceof Error ? error.message : "Unknown error";
    
    // Provide user-friendly error messages
    if (errorMessage.includes("failed to load")) {
      return {
        text: `⚠️ Cannot connect to Puter AI: ${errorMessage}`,
        isError: true
      };
    }
    
    if (errorMessage.includes("network") || errorMessage.includes("fetch")) {
      return {
        text: "⚠️ Network error: Unable to reach Puter AI servers. Please check your internet connection.",
        isError: true
      };
    }

    return {
      text: `⚠️ Puter AI Error: ${errorMessage}. Please try again in a moment.`,
      isError: true
    };
  }
};