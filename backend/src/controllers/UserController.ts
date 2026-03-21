import { Request, Response } from 'express';
import dataSource from '../database/data-source';
import { User } from '../models/User';

export class UserController {
  private static userRepository = dataSource.getRepository(User);

  public static async getProfile(req: Request, res: Response) {
    try {
      // Hardcoded for demo/dev purposes since we don't have auth middleware yet
      const userId = req.headers['x-user-id'] as string || 'test-user-id';
      
      let user = await UserController.userRepository.findOne({ where: { id: userId } });
      
      if (!user) {
        // Create a mock user if it doesn't exist to make the prototype work smoothly
        user = new User();
        user.id = userId;
        user.name = 'Jane Doe';
        user.email = 'jane@example.com';
        user.weeksPregnant = 24;
        await UserController.userRepository.save(user);
      }
      
      return res.status(200).json(user);
    } catch (error) {
      console.error('UserController getProfile error:', error);
      return res.status(500).json({ error: 'Failed to fetch user profile' });
    }
  }

  public static async updateProfile(req: Request, res: Response) {
    try {
      const userId = req.headers['x-user-id'] as string || 'test-user-id';
      const updateData = req.body;
      
      await UserController.userRepository.update({ id: userId }, updateData);
      
      const updatedUser = await UserController.userRepository.findOne({ where: { id: userId } });
      return res.status(200).json(updatedUser);
    } catch (error) {
      return res.status(500).json({ error: 'Failed to update user profile' });
    }
  }
}
