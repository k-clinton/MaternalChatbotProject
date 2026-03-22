import { Response } from 'express';
import dataSource from '../database/data-source';
import { Medication } from '../models/Medication';
import { AuthRequest } from '../middleware/AuthMiddleware';

export class MedicationController {
  private static medicationRepository = dataSource.getRepository(Medication);

  public static async getMedications(req: AuthRequest, res: Response) {
    try {
      const userId = req.user?.id;
      if (!userId) return res.status(401).json({ error: 'Unauthorized' });

      const medications = await MedicationController.medicationRepository.find({
        where: { userId, isActive: true },
        order: { createdAt: 'DESC' }
      });

      return res.status(200).json(medications);
    } catch (error) {
      console.error('MedicationController getMedications error:', error);
      return res.status(500).json({ error: 'Failed to fetch medications' });
    }
  }

  public static async addMedication(req: AuthRequest, res: Response) {
    try {
      const userId = req.user?.id;
      if (!userId) return res.status(401).json({ error: 'Unauthorized' });

      const { name, dosage, frequency } = req.body;
      if (!name) return res.status(400).json({ error: 'Medication name is required' });

      const medication = MedicationController.medicationRepository.create({
        userId,
        name,
        dosage,
        frequency
      });

      await MedicationController.medicationRepository.save(medication);
      return res.status(201).json(medication);
    } catch (error) {
      console.error('MedicationController addMedication error:', error);
      return res.status(500).json({ error: 'Failed to add medication' });
    }
  }

  public static async markAsTaken(req: AuthRequest, res: Response) {
    try {
      const { id } = req.params;
      const userId = req.user?.id;
      if (!userId) return res.status(401).json({ error: 'Unauthorized' });

      const medication = await MedicationController.medicationRepository.findOneBy({ id, userId });
      if (!medication) return res.status(404).json({ error: 'Medication not found' });

      medication.lastTakenAt = new Date();
      await MedicationController.medicationRepository.save(medication);

      return res.status(200).json(medication);
    } catch (error) {
      console.error('MedicationController markAsTaken error:', error);
      return res.status(500).json({ error: 'Failed to update medication status' });
    }
  }

  public static async deleteMedication(req: AuthRequest, res: Response) {
    try {
      const { id } = req.params;
      const userId = req.user?.id;
      if (!userId) return res.status(401).json({ error: 'Unauthorized' });

      const medication = await MedicationController.medicationRepository.findOneBy({ id, userId });
      if (!medication) return res.status(404).json({ error: 'Medication not found' });

      medication.isActive = false; // Soft delete
      await MedicationController.medicationRepository.save(medication);

      return res.status(200).json({ message: 'Medication removed' });
    } catch (error) {
      console.error('MedicationController deleteMedication error:', error);
      return res.status(500).json({ error: 'Failed to delete medication' });
    }
  }
}
