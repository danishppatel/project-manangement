import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import prisma from '@/lib/prisma';

interface SignUpInput {
  name: string;
  email: string;
  password: string;
  role: 'ADMIN' | 'USER';
}

interface SignInInput {
  email: string;
  password: string;
}

export const authResolvers = {
  Mutation: {
    signUp: async (_: any, { input }: { input: SignUpInput }) => {
      const { name, email, password, role } = input;

      try {
        // Check if user exists
        const existingUser = await prisma.user.findUnique({
          where: { email }
        });

        if (existingUser) {
          throw new Error('User already exists with this email');
        }

        // Hash password
        const hashedPassword = await bcrypt.hash(password, 10);

        // Create user
        const user = await prisma.user.create({
          data: {
            name,
            email,
            password: hashedPassword,
            role
          }
        });

        // Generate token
        const token = jwt.sign(
          { userId: user.id, email: user.email, role: user.role },
          process.env.JWT_SECRET!,
          { expiresIn: '24h' }
        );

        return {
          token,
          user
        };
      } catch (error: any) {
        throw new Error(error.message || 'Error creating user');
      }
    },

    signIn: async (_: any, { input }: { input: SignInInput }) => {
      const { email, password } = input;

      try {
        // Find user
        const user = await prisma.user.findUnique({
          where: { email }
        });

        if (!user) {
          throw new Error('Invalid email or password');
        }

        // Check password
        const validPassword = await bcrypt.compare(password, user.password);
        if (!validPassword) {
          throw new Error('Invalid email or password');
        }

        // Generate token
        const token = jwt.sign(
          { userId: user.id, email: user.email, role: user.role },
          process.env.JWT_SECRET!,
          { expiresIn: '24h' }
        );

        return {
          token,
          user
        };
      } catch (error: any) {
        throw new Error(error.message || 'Error signing in');
      }
    }
  }
}; 