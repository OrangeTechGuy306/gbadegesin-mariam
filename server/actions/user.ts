'use server';

import bcrypt from 'bcryptjs';
import connectDB from '@/lib/db';
import User from '@/models/user';
import AuditLog from '@/models/audit_log';
import { getCurrentUser } from './auth';
import { revalidatePath } from 'next/cache';

export async function createUserAction(prevState: any, formData: FormData) {
  const currentUser = await getCurrentUser();
  if (!currentUser || currentUser.role !== 'SUPER_ADMIN') {
    return { error: 'Unauthorized. Only Super Admins can manage users.' };
  }

  const name = formData.get('name')?.toString().trim();
  const email = formData.get('email')?.toString().trim().toLowerCase();
  const password = formData.get('password')?.toString();
  const role = formData.get('role')?.toString() || 'EDITOR';

  if (!name || !email || !password) {
    return { error: 'Name, email, and password are required' };
  }

  if (password.length < 6) {
    return { error: 'Password must be at least 6 characters long' };
  }

  try {
    await connectDB();
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return { error: 'A user with this email address already exists' };
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const newUser = await User.create({
      name,
      email,
      password: hashedPassword,
      role,
      isVerified: true,
    });

    await AuditLog.create({
      userId: currentUser.id,
      userName: currentUser.name,
      userEmail: currentUser.email,
      action: 'CREATE_USER',
      details: `Created new user account "${name}" (${email}) with role ${role} (ID: ${newUser._id})`,
      ip: '127.0.0.1',
    });

    revalidatePath('/admin/users');
    return { success: 'User account created successfully!' };
  } catch (err: any) {
    return { error: err.message || 'An error occurred' };
  }
}

export async function updateUserAction(prevState: any, formData: FormData) {
  const currentUser = await getCurrentUser();
  if (!currentUser || currentUser.role !== 'SUPER_ADMIN') {
    return { error: 'Unauthorized. Only Super Admins can manage users.' };
  }

  const id = formData.get('id')?.toString();
  const name = formData.get('name')?.toString().trim();
  const email = formData.get('email')?.toString().trim().toLowerCase();
  const role = formData.get('role')?.toString();
  const password = formData.get('password')?.toString();

  if (!id || !name || !email || !role) {
    return { error: 'ID, name, email, and role are required' };
  }

  try {
    await connectDB();
    const userToUpdate = await User.findById(id);
    if (!userToUpdate) {
      return { error: 'User not found' };
    }

    const emailCheck = await User.findOne({ email, _id: { $ne: id } });
    if (emailCheck) {
      return { error: 'Another user with this email already exists' };
    }

    userToUpdate.name = name;
    userToUpdate.email = email;
    userToUpdate.role = role;

    if (password && password.trim() !== '') {
      if (password.length < 6) {
        return { error: 'New password must be at least 6 characters long' };
      }
      userToUpdate.password = await bcrypt.hash(password, 10);
    }

    await userToUpdate.save();

    await AuditLog.create({
      userId: currentUser.id,
      userName: currentUser.name,
      userEmail: currentUser.email,
      action: 'UPDATE_USER',
      details: `Updated user account "${name}" (${email}), role set to ${role} (ID: ${id})`,
      ip: '127.0.0.1',
    });

    revalidatePath('/admin/users');
    return { success: 'User account updated successfully!' };
  } catch (err: any) {
    return { error: err.message || 'An error occurred' };
  }
}

export async function deleteUserAction(id: string) {
  const currentUser = await getCurrentUser();
  if (!currentUser || currentUser.role !== 'SUPER_ADMIN') {
    throw new Error('Unauthorized. Only Super Admins can manage users.');
  }

  if (currentUser.id === id) {
    return { error: 'You cannot delete your own account.' };
  }

  try {
    await connectDB();
    const userToDelete = await User.findByIdAndDelete(id);
    if (!userToDelete) {
      return { error: 'User not found' };
    }

    await AuditLog.create({
      userId: currentUser.id,
      userName: currentUser.name,
      userEmail: currentUser.email,
      action: 'DELETE_USER',
      details: `Deleted user account "${userToDelete.name}" (${userToDelete.email}) (ID: ${id})`,
      ip: '127.0.0.1',
    });

    revalidatePath('/admin/users');
    return { success: true };
  } catch (err: any) {
    return { error: err.message || 'An error occurred' };
  }
}
