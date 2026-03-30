import OpenAI from 'openai';

// Initialize with a dummy key for development if not provided
const openai = new OpenAI({
  baseURL: 'https://models.inference.ai.azure.com',
  apiKey: process.env.OPENAI_API_KEY || 'sk-dummy-key-for-local-dev-only-not-for-prod',
});

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
    userContext: string = '',
    language: string = 'English'
  ): Promise<{ text: string; isUrgent: boolean; recommendedAction: string | null }> {
    try {
      const dynamicSystemPrompt = `You are a compassionate, professional, and highly knowledgeable Maternal Care Assistant chatbot.
Your primary role is to answer questions related to pregnancy, monitor symptoms, and provide personalized triage analysis.
Current language: ${language}. PLEASE RESPOND IN ${language}.

${userContext ? `CURRENT PATIENT DATA:\n${userContext}\n` : ''}

CRITICAL TRIAGE RULES:
1. URGENT SYMPTOMS: If the user mentions any of the following, YOU MUST set "isUrgent" to true and "recommendedAction" to "Seek immediate medical attention":
   - Severe headache that won't go away
   - Vision changes (blurriness, flashing lights, spots)
   - Heavy vaginal bleeding
   - Decreased or no fetal movement (if in 3rd trimester)
   - Sudden swelling in face or hands
   - Severe abdominal pain
   - Fever over 100.4°F (38°C)
   - Leaking fluid (potential water breaking)

2. PERSPECTIVE: Always acknowledge the patient's specific health data (like their current week of pregnancy) if provided in the context.
3. ADVICE: Be reassuring but never provide a definitive diagnosis. State clearly that you are an AI assistant and not a medical professional.
4. CONCISION: Keep responses empathetic but concise and easy to understand.
5. JSON FORMAT: YOU MUST RESPOND IN JSON FORMAT with the following keys: "reply", "isUrgent", "recommendedAction" (string or null).`;

      const messages: OpenAI.Chat.ChatCompletionMessageParam[] = [
        { role: 'system', content: dynamicSystemPrompt },
        ...history.map(msg => ({ role: msg.role, content: msg.content } as OpenAI.Chat.ChatCompletionMessageParam)),
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
