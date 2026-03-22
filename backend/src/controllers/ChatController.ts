import { Response } from 'express';
import { OpenAIService } from '../services/nlp/OpenAIService';
import { AuthRequest } from '../middleware/AuthMiddleware';
import dataSource from '../database/data-source';
import { User } from '../models/User';
import { VitalsLog } from '../models/VitalsLog';

export class ChatController {
  
  /**
   * Handle incoming chat messages from the user
   * POST /api/chat/message
   */
  public static async sendMessage(req: AuthRequest, res: Response) {
    try {
      const { message, history } = req.body;
      const userId = req.user?.id;

      if (!userId) {
        return res.status(401).json({ error: 'Unauthorized' });
      }

      if (!message) {
        return res.status(400).json({ error: 'Message content is required.' });
      }

      // Retrieve patient context from the database
      let userContext = '';
      try {
        const userRepo = dataSource.getRepository(User);
        const vitalsRepo = dataSource.getRepository(VitalsLog);

        const user = await userRepo.findOneBy({ id: userId });
        const latestVitals = await vitalsRepo.findOne({
          where: { userId },
          order: { loggedAt: 'DESC' }
        });

        if (user) {
          userContext = `Patient Name: ${user.name}\nWeeks Pregnant: ${user.weeksPregnant || 'Unknown'}`;
          if (user.dueDate) userContext += `\nDue Date: ${user.dueDate}`;
        }

        if (latestVitals) {
          userContext += `\n\nLatest Vitals (Logged at ${latestVitals.loggedAt}):`;
          if (latestVitals.bloodPressure) userContext += `\n- Blood Pressure: ${latestVitals.bloodPressure}`;
          if (latestVitals.weight) userContext += `\n- Weight: ${latestVitals.weight} lbs`;
          if (latestVitals.fetalMovement !== null) userContext += `\n- Fetal Movement: ${latestVitals.fetalMovement} kicks in 2h`;
        }
      } catch (dbError) {
        console.error('Error fetching user context for chat:', dbError);
        // Continue without context if DB fetch fails
      }
      
      const response = await OpenAIService.processMessage(message, history || [], userContext);

      // Return the assistant's reply and any urgency flags
      return res.status(200).json({
        reply: response.text,
        isUrgent: response.isUrgent,
        recommendedAction: response.recommendedAction,
        timestamp: new Date().toISOString()
      });

    } catch (error) {
      console.error('ChatController Error:', error);
      return res.status(500).json({ error: 'An error occurred while processing the chat message.' });
    }
  }
}
