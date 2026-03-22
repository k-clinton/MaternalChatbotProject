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
4. Keep responses concise and easy to understand.
5. Dont use imojis except for warnings`;

export class OpenAIService {
  /**
   * Analyzes an incoming message using GPT-4 to provide a response and determine urgency.
   * @param message The user's message
   * @param history Conversation history
   * @param userContext Optional string containing user profile and recent vitals
   */
  public static async processMessage(
    message: string,
    history: { role: 'user' | 'assistant', content: string }[] = [],
    userContext: string = ''
  ): Promise<{ text: string; isUrgent: boolean; recommendedAction: string | null }> {
    try {
      const dynamicSystemPrompt = `You are a compassionate, professional, and highly knowledgeable Maternal Care Assistant chatbot.
Your primary role is to answer questions related to pregnancy, monitor symptoms, and provide triage analysis.

${userContext ? `CURRENT PATIENT DATA:\n${userContext}\n` : ''}

CRITICAL RULES:
1. If the user mentions any severe symptoms (e.g., severe headache, heavy bleeding, decreased fetal movement, chest pain, leaking fluid), you MUST set isUrgent to true.
2. If isUrgent is true, you MUST provide a specific recommendedAction (e.g., "Contact your doctor immediately", "Go to the ER").
3. Be reassuring but never diagnose. State clearly that you are an AI assistant and not a doctor.
4. Keep responses concise and easy to understand.
5. Reference the patient's specific health data if relevant.
6. YOU MUST RESPOND IN JSON FORMAT with the following keys: "reply", "isUrgent", "recommendedAction" (string or null).`;

      const messages: any[] = [
        { role: 'system', content: dynamicSystemPrompt },
        ...history.map(msg => ({ role: msg.role, content: msg.content })),
        { role: 'user', content: message }
      ];

      if (!process.env.OPENAI_API_KEY) {
        return this.mockProcessMessage(message);
      }

      const response = await openai.chat.completions.create({
        model: 'gpt-4o',
        messages,
        temperature: 0.2,
        max_tokens: 400,
        response_format: { type: 'json_object' }
      });

      const rawContent = response.choices[0].message?.content || "{}";
      const parsed = JSON.parse(rawContent);

      return {
        text: parsed.reply || "I'm sorry, I couldn't process that request.",
        isUrgent: !!parsed.isUrgent,
        recommendedAction: parsed.recommendedAction || null
      };

    } catch (error) {
      console.error("OpenAI Service Error:", error);
      throw new Error("Failed to process message with AI.");
    }
  }

  private static mockProcessMessage(message: string): { text: string; isUrgent: boolean; recommendedAction: string | null } {
    const textLower = message.toLowerCase();
    const isUrgent = textLower.includes('headache') || textLower.includes('bleeding') || textLower.includes('pain');

    if (isUrgent) {
      return {
        text: "I noticed you mentioned some concerning symptoms. Please contact your healthcare provider immediately or go to the nearest emergency room.",
        isUrgent: true,
        recommendedAction: "Contact your healthcare provider or go to the ER immediately."
      };
    }

    return {
      text: "I've noted that in your health log. Make sure to stay hydrated and rest up. Do you have any other questions regarding your pregnancy?",
      isUrgent: false,
      recommendedAction: null
    };
  }
}
