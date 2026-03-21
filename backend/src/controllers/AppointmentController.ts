import { Response } from 'express';
import dataSource from '../database/data-source';
import { Appointment } from '../models/Appointment';
import { AuthRequest } from '../middleware/AuthMiddleware';

export class AppointmentController {
  private static appointmentRepository = dataSource.getRepository(Appointment);

  public static async getAppointments(req: AuthRequest, res: Response) {
    try {
      const userId = req.user?.id;
      if (!userId) return res.status(401).json({ error: 'Unauthorized' });
      
      const appointments = await AppointmentController.appointmentRepository.find({
        where: { userId },
        order: { date: 'ASC' }
      });
      
      return res.status(200).json(appointments);
    } catch (error) {
      console.error('AppointmentController getAppointments error:', error);
      return res.status(500).json({ error: 'Failed to fetch appointments' });
    }
  }

  public static async scheduleAppointment(req: AuthRequest, res: Response) {
    try {
      const userId = req.user?.id;
      if (!userId) return res.status(401).json({ error: 'Unauthorized' });

      const { title, doctor, date, notes } = req.body;

      const appointment = AppointmentController.appointmentRepository.create({
        userId,
        title,
        doctor,
        date: new Date(date),
        notes
      });

      await AppointmentController.appointmentRepository.save(appointment);
      
      return res.status(201).json(appointment);
    } catch (error) {
      console.error('AppointmentController scheduleAppointment error:', error);
      return res.status(500).json({ error: 'Failed to schedule appointment' });
    }
  }
}
