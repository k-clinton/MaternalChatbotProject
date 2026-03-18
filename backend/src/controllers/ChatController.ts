import { Request, Response } from 'express';
import { OpenAIService } from '../services/nlp/OpenAIService';

export class ChatController {
  
  /**
   * Handle incoming chat messages from the user
   * POST /api/chat/message
   */
  public static async sendMessage(req: Request, res: Response) {
    try {
      const { message, history } = req.body;

      if (!message) {
        return res.status(400).json({ error: 'Message content is required.' });
      }

      // In a real application, we would retrieve patient context from the database here
      // const userId = req.user.id;
      // const patientProfile = await ProfileService.getProfile(userId);
      
      const response = await OpenAIService.processMessage(message, history || []);

      // Return the assistant's reply and any urgency flags
      return res.status(200).json({
        reply: response.text,
        isUrgent: response.isUrgent,
        timestamp: new Date().toISOString()
      });

    } catch (error) {
      console.error('ChatController Error:', error);
      return res.status(500).json({ error: 'An error occurred while processing the chat message.' });
    }
  }
}
