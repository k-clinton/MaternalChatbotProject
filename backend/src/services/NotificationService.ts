import { User } from '../models/User';
import winston from 'winston';

/**
 * Service to handle WhatsApp and Email notifications.
 * Currently uses mocks/logging as external API keys are not provided.
 */
export class NotificationService {
  private static logger = winston.createLogger({
    level: 'info',
    format: winston.format.combine(
      winston.format.timestamp(),
      winston.format.json()
    ),
    transports: [
      new winston.transports.Console({
        format: winston.format.combine(
          winston.format.colorize(),
          winston.format.simple()
        )
      })
    ]
  });

  /**
   * Sends a notification based on user preferences.
   */
  public static async sendUrgencyAlert(user: User, alertMessage: string) {
    this.logger.info(`Processing urgency alert for user: ${user.name} (${user.id})`);

    const promises = [];

    // WhatsApp Alert to Emergency Contact
    if (user.whatsappNotifications && user.whatsappNumber && user.emergencyContact) {
      promises.push(this.sendWhatsApp(
        user.whatsappNumber, 
        `URGENT ALERT for ${user.name}: ${alertMessage}. Emergency Contact: ${user.emergencyContact}`
      ));
    }

    // Email Alert
    if (user.emailNotifications) {
      promises.push(this.sendEmail(
        user.email,
        `Urgent Health Alert - Maternal Chatbot`,
        `Hello ${user.name},\n\nThe AI has detected an urgent situation based on your recent activity: ${alertMessage}\n\nOur system recommends taking immediate action as per the chatbot's instructions.`
      ));
    }

    await Promise.all(promises);
  }

  private static async sendWhatsApp(to: string, message: string) {
    // MOCK: In a real implementation, use Twilio API here
    this.logger.info(`[MOCK WHATSAPP] To: ${to} | Message: ${message}`);
    return Promise.resolve(true);
  }

  private static async sendEmail(to: string, subject: string, body: string) {
    // MOCK: In a real implementation, use Nodemailer/SendGrid here
    this.logger.info(`[MOCK EMAIL] To: ${to} | Subject: ${subject} | Body snippet: ${body.substring(0, 50)}...`);
    return Promise.resolve(true);
  }
}
