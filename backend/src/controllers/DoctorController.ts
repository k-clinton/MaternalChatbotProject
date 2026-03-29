import { Request, Response } from 'express';
import dataSource from '../database/data-source';
import { Doctor } from '../models/Doctor';

export class DoctorController {
  static async getDoctors(req: Request, res: Response) {
    try {
      const doctorRepo = dataSource.getRepository(Doctor);
      let doctors = await doctorRepo.find({ where: { isAvailable: true } });

      // Seed if empty
      if (doctors.length === 0) {
        const seedDoctors = [
          {
            name: "Dr. Sarah Mitchell",
            specialty: "Obstetrician & Gynecologist",
            hospital: "City Women's Hospital",
            experience: 12,
            rating: 4.9,
            imageUrl: "https://images.unsplash.com/photo-1559839734-2b71ea197ec2?auto=format&fit=crop&q=80&w=200&h=200"
          },
          {
            name: "Dr. James Wilson",
            specialty: "Maternal-Fetal Medicine",
            hospital: "Central Medical Center",
            experience: 15,
            rating: 4.8,
            imageUrl: "https://images.unsplash.com/photo-1612349317150-e413f6a5b16d?auto=format&fit=crop&q=80&w=200&h=200"
          },
          {
            name: "Dr. Elena Rodriguez",
            specialty: "Prenatal Health Specialist",
            hospital: "Hope Maternity Clinic",
            experience: 8,
            rating: 4.7,
            imageUrl: "https://images.unsplash.com/photo-1594824476967-48c8b964273f?auto=format&fit=crop&q=80&w=200&h=200"
          }
        ];
        await doctorRepo.save(seedDoctors);
        doctors = await doctorRepo.find({ where: { isAvailable: true } });
      }

      return res.json(doctors);
    } catch (error) {
      console.error('Error fetching doctors:', error);
      return res.status(500).json({ message: 'Internal server error' });
    }
  }

  static async getDoctorById(req: Request, res: Response) {
    try {
      const { id } = req.params;
      const doctorRepo = dataSource.getRepository(Doctor);
      const doctor = await doctorRepo.findOne({ where: { id } });

      if (!doctor) {
        return res.status(404).json({ message: 'Doctor not found' });
      }

      return res.json(doctor);
    } catch (error) {
      console.error('Error fetching doctor:', error);
      return res.status(500).json({ message: 'Internal server error' });
    }
  }
}
