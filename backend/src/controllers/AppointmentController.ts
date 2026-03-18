import { Request, Response } from 'express';
import dataSource from '../database/data-source';
import { Appointment } from '../models/Appointment';

export class AppointmentController {
  private static appointmentRepository = dataSource.getRepository(Appointment);

  public static async getAppointments(req: Request, res: Response) {
    try {
      const userId = req.headers['x-user-id'] as string || 'test-user-id';
      
      const appointments = await AppointmentController.appointmentRepository.find({
        where: { userId },
        order: { date: 'ASC' }
      });
      
      return res.status(200).json(appointments);
    } catch (error) {
      return res.status(500).json({ error: 'Failed to fetch appointments' });
    }
  }

  public static async scheduleAppointment(req: Request, res: Response) {
    try {
      const userId = req.headers['x-user-id'] as string || 'test-user-id';
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
      return res.status(500).json({ error: 'Failed to schedule appointment' });
    }
  }
}
