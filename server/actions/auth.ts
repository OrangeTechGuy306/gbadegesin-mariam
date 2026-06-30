'use server';

import bcrypt from 'bcryptjs';
import connectDB from '@/lib/db';
import User from '@/models/user';
import { createSession, deleteSession, decrypt } from '@/lib/session';
import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';
import { revalidatePath } from 'next/cache';

export async function loginAction(prevState: any, formData: FormData) {
  const email = formData.get('email')?.toString().trim();
  const password = formData.get('password')?.toString();

  if (!email || !password) {
    return { error: 'Please enter both email and password' };
  }

  try {
    await connectDB();

    const user = await User.findOne({ email });
    if (!user) {
      return { error: 'Invalid email or password' };
    }

    const passwordsMatch = await bcrypt.compare(password, user.password);
    if (!passwordsMatch) {
      return { error: 'Invalid email or password' };
    }

    // Add entry to user login history
    const userAgent = (await import('next/headers')).headers().then(h => h.get('user-agent') || 'Unknown');
    user.loginHistory.push({
      ip: '127.0.0.1',
      userAgent: await userAgent,
    });
    await user.save();

    // Create session in cookies
    await createSession(user._id.toString(), user.role);

    // Dynamic redirect inside Server Action
  } catch (err: any) {
    console.error('Login action error:', err);
    return { error: err.message || 'An unexpected error occurred' };
  }

  // Redirect after success (ensure it is called outside try-catch to allow Next.js routing exceptions to propagate)
  redirect('/admin');
}

export async function logoutAction() {
  await deleteSession();
  redirect('/login');
}

export async function getCurrentUser() {
  try {
    const cookieStore = await cookies();
    const sessionCookie = cookieStore.get('session')?.value;
    if (!sessionCookie) return null;

    const session = await decrypt(sessionCookie);
    if (!session?.userId) return null;

    const conn = await connectDB();
    if (!conn) return null;
    const user = await User.findById(session.userId).select('-password');
    if (!user) return null;

    return {
      id: user._id.toString(),
      name: user.name,
      email: user.email,
      role: user.role,
      isVerified: user.isVerified,
      loginHistory: user.loginHistory.map((h: any) => ({
        ip: h.ip,
        userAgent: h.userAgent,
        timestamp: h.timestamp.toISOString(),
      })),
    };
  } catch (err: any) {
    if (err && (err.digest === 'DYNAMIC_SERVER_USAGE' || err.message?.includes('Dynamic server usage'))) {
      throw err;
    }
    console.error('Failed to get current user:', err);
    return null;
  }
}

export async function forgotPasswordAction(prevState: any, formData: FormData) {
  const email = formData.get('email')?.toString().trim();
  if (!email) {
    return { error: 'Please provide an email address' };
  }
  
  try {
    await connectDB();
    const user = await User.findOne({ email });
    if (!user) {
      // Don't leak whether user exists or not for security
      return { success: 'If the email matches an account, we have sent instructions.' };
    }
    // Return mock success message
    return { success: 'Instructions have been sent to your email.' };
  } catch (err: any) {
    return { error: err.message || 'An error occurred' };
  }
}

export async function resetPasswordAction(prevState: any, formData: FormData) {
  const password = formData.get('password')?.toString();
  const confirmPassword = formData.get('confirmPassword')?.toString();

  if (!password || !confirmPassword) {
    return { error: 'Please fill in both password fields' };
  }

  if (password !== confirmPassword) {
    return { error: 'Passwords do not match' };
  }

  try {
    // In a real application, we would verify a reset token
    // For this portfolio prototype, we update the main Super Admin account
    await connectDB();
    const superAdmin = await User.findOne({ role: 'SUPER_ADMIN' });
    if (!superAdmin) {
      return { error: 'No account found' };
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    superAdmin.password = hashedPassword;
    await superAdmin.save();

    return { success: 'Password has been reset successfully.' };
  } catch (err: any) {
    return { error: err.message || 'An error occurred' };
  }
}
