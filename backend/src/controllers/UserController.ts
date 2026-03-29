import { Request, Response } from 'express';
import dataSource from '../database/data-source';
import { User } from '../models/User';
import * as jwt from 'jsonwebtoken';
import { AuthRequest } from '../middleware/AuthMiddleware';

export class UserController {
  private static userRepository = dataSource.getRepository(User);

  public static async register(req: Request, res: Response) {
    try {
      const { name, email, password, weeksPregnant } = req.body;

      if (!name || !email || !password) {
        return res.status(400).json({ error: 'Name, email, and password are required' });
      }

      const existingUser = await UserController.userRepository.findOne({ where: { email } });
      if (existingUser) {
        return res.status(400).json({ error: 'User with this email already exists' });
      }

      const user = new User();
      user.name = name;
      user.email = email;
      user.password = password; // Will be hashed by @BeforeInsert hook
      user.weeksPregnant = weeksPregnant;

      await UserController.userRepository.save(user);

      const token = UserController.generateToken(user);

      return res.status(201).json({
        user: { 
          id: user.id, 
          name: user.name, 
          email: user.email, 
          weeksPregnant: user.weeksPregnant, 
          dueDate: user.dueDate,
          emergencyContact: user.emergencyContact,
          emailNotifications: user.emailNotifications,
          whatsappNotifications: user.whatsappNotifications,
          whatsappNumber: user.whatsappNumber,
          role: user.role
        },
        token
      });
    } catch (error) {
      console.error('UserController register error:', error);
      return res.status(500).json({ error: 'Failed to register user' });
    }
  }

  public static async login(req: Request, res: Response) {
    try {
      const { email, password } = req.body;

      if (!email || !password) {
        return res.status(400).json({ error: 'Email and password are required' });
      }

      const user = await UserController.userRepository.findOne({ 
        where: { email },
        select: ['id', 'name', 'email', 'password', 'role', 'weeksPregnant'] 
      });

      if (!user || !(await user.comparePassword(password))) {
        return res.status(401).json({ error: 'Invalid email or password' });
      }

      const token = UserController.generateToken(user);

      return res.status(200).json({
        user: { 
          id: user.id, 
          name: user.name, 
          email: user.email, 
          weeksPregnant: user.weeksPregnant, 
          dueDate: user.dueDate,
          emergencyContact: user.emergencyContact,
          emailNotifications: user.emailNotifications,
          whatsappNotifications: user.whatsappNotifications,
          whatsappNumber: user.whatsappNumber,
          role: user.role
        },
        token
      });
    } catch (error) {
      console.error('UserController login error:', error);
      return res.status(500).json({ error: 'Failed to login' });
    }
  }

  public static async getProfile(req: AuthRequest, res: Response) {
    try {
      const userId = req.user?.id;
      
      if (!userId) {
        return res.status(401).json({ error: 'User not authenticated' });
      }
      
      const user = await UserController.userRepository.findOne({ where: { id: userId } });
      
      if (!user) {
        return res.status(404).json({ error: 'User not found' });
      }
      
      return res.status(200).json(user);
    } catch (error) {
      console.error('UserController getProfile error:', error);
      return res.status(500).json({ error: 'Failed to fetch user profile' });
    }
  }

  public static async updateProfile(req: AuthRequest, res: Response) {
    try {
      const userId = req.user?.id;
      const updateData = req.body;
      
      if (!userId) {
        return res.status(401).json({ error: 'User not authenticated' });
      }

      // Prohibit specific fields from being updated here
      delete updateData.id;
      delete updateData.email;
      delete updateData.password;
      
      await UserController.userRepository.update({ id: userId }, updateData);
      
      const updatedUser = await UserController.userRepository.findOne({ where: { id: userId } });
      return res.status(200).json(updatedUser);
    } catch (error) {
      console.error('UserController updateProfile error:', error);
      return res.status(500).json({ error: 'Failed to update user profile' });
    }
  }

  private static generateToken(user: User): string {
    return jwt.sign(
      { id: user.id, role: user.role },
      process.env.JWT_SECRET || 'fallback-secret',
      { expiresIn: '7d' }
    );
  }
}
