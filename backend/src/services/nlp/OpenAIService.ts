import OpenAI from 'openai';

// Initialize with a dummy key for development if not provided
const openai = new OpenAI({
  baseURL: 'https://models.inference.ai.azure.com',
  apiKey: process.env.OPENAI_API_KEY || 'sk-dummy-key-for-local-dev-only-not-for-prod',
});

const SYSTEM_PROMPT = `You are a compassionate, professional, and highly knowledgeable Maternal Care Assistant chatbot.
Your primary role is to answer questions related to pregnancy, monitor symptoms, and provide triage analysis.
CRITICAL RULES:
1. If the user mentions any severe symptoms (e.g., severe headache, heavy bleeding, decreased fetal movement, chest pain, leaking fluid), you MUST flag the input as URGENT.
2. In your response for severe symptoms, you MUST advise them to seek immediate medical attention or contact their healthcare provider.
3. Be reassuring but never diagnose. State clearly that you are an AI assistant and not a doctor.
4. Keep responses concise and easy to understand.`;

export class OpenAIService {
  /**
   * Analyzes an incoming message using GPT-4 to provide a response and determine urgency.
   */
  public static async processMessage(
    message: string,
    history: { role: 'user' | 'assistant', content: string }[] = []
  ): Promise<{ text: string; isUrgent: boolean }> {
    try {
      const messages: any[] = [
        { role: 'system', content: SYSTEM_PROMPT },
        ...history.map(msg => ({ role: msg.role, content: msg.content })),
        { role: 'user', content: message }
      ];

      // Note: We use an older model string like gpt-4 for general use, or gpt-3.5-turbo for speed.
      // If we don't have a real API key in dev, we return a mock response.
      if (!process.env.OPENAI_API_KEY) {
        return this.mockProcessMessage(message);
      }

      const response = await openai.chat.completions.create({
        model: 'gpt-4o',
        messages,
        temperature: 0.2, // Low temperature for consistent medical triage
        max_tokens: 250,
      });

      const replyText = response.choices[0].message?.content || "I'm sorry, I couldn't process that request.";

      // Determine urgency based on keywords or secondary LLM call
      // For simplicity in this iteration, we use simple keyword matching combined with the LLM's instructed output
      const urgentKeywords = ['immediate medical attention', 'emergency', 'urgent', 'healthcare provider immediately', '911'];
      const isUrgent = urgentKeywords.some(keyword => replyText.toLowerCase().includes(keyword));

      return { text: replyText, isUrgent };

    } catch (error) {
      console.error("OpenAI Service Error:", error);
      throw new Error("Failed to process message with AI.");
    }
  }

  private static mockProcessMessage(message: string): { text: string; isUrgent: boolean } {
    const textLower = message.toLowerCase();
    const isUrgent = textLower.includes('headache') || textLower.includes('bleeding') || textLower.includes('pain');

    if (isUrgent) {
      return {
        text: "I noticed you mentioned some concerning symptoms. Please contact your healthcare provider immediately or go to the nearest emergency room.",
        isUrgent: true
      };
    }

    return {
      text: "I've noted that in your health log. Make sure to stay hydrated and rest up. Do you have any other questions regarding your pregnancy?",
      isUrgent: false
    };
  }
}
