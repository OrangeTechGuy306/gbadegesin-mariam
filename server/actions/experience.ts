'use server';

import connectDB from '@/lib/db';
import Experience from '@/models/experience';
import AuditLog from '@/models/audit_log';
import { getCurrentUser } from './auth';
import { revalidatePath } from 'next/cache';

export async function createExperienceAction(prevState: any, formData: FormData) {
  const user = await getCurrentUser();
  if (!user || (user.role !== 'SUPER_ADMIN' && user.role !== 'ADMIN')) {
    return { error: 'Unauthorized operation' };
  }

  const title = formData.get('title')?.toString().trim();
  const company = formData.get('company')?.toString().trim();
  const location = formData.get('location')?.toString().trim();
  const description = formData.get('description')?.toString().trim();
  const startDate = formData.get('startDate')?.toString().trim();
  const endDate = formData.get('endDate')?.toString().trim() || 'Present';
  const type = formData.get('type')?.toString() || 'work';
  const highlightsRaw = formData.get('highlights')?.toString() || '';

  if (!title || !company || !startDate) {
    return { error: 'Title, Company, and Start Date are required' };
  }

  const highlights = highlightsRaw
    .split('\n')
    .map((h) => h.trim())
    .filter((h) => h !== '');

  try {
    await connectDB();
    const newExp = await Experience.create({
      title,
      company,
      location,
      description,
      startDate,
      endDate,
      type,
      highlights,
    });

    await AuditLog.create({
      userId: user.id,
      userName: user.name,
      userEmail: user.email,
      action: 'CREATE_EXPERIENCE',
      details: `Created career timeline item "${title}" at ${company} (ID: ${newExp._id})`,
      ip: '127.0.0.1',
    });

    revalidatePath('/');
    revalidatePath('/admin/profile');
    return { success: 'Timeline item added successfully!' };
  } catch (err: any) {
    return { error: err.message || 'An error occurred' };
  }
}

export async function updateExperienceAction(prevState: any, formData: FormData) {
  const user = await getCurrentUser();
  if (!user || (user.role !== 'SUPER_ADMIN' && user.role !== 'ADMIN')) {
    return { error: 'Unauthorized operation' };
  }

  const id = formData.get('id')?.toString();
  const title = formData.get('title')?.toString().trim();
  const company = formData.get('company')?.toString().trim();
  const location = formData.get('location')?.toString().trim();
  const description = formData.get('description')?.toString().trim();
  const startDate = formData.get('startDate')?.toString().trim();
  const endDate = formData.get('endDate')?.toString().trim() || 'Present';
  const type = formData.get('type')?.toString() || 'work';
  const highlightsRaw = formData.get('highlights')?.toString() || '';

  if (!id || !title || !company || !startDate) {
    return { error: 'ID, Title, Company, and Start Date are required' };
  }

  const highlights = highlightsRaw
    .split('\n')
    .map((h) => h.trim())
    .filter((h) => h !== '');

  try {
    await connectDB();
    const exp = await Experience.findById(id);
    if (!exp) {
      return { error: 'Timeline item not found' };
    }

    exp.title = title;
    exp.company = company;
    exp.location = location;
    exp.description = description;
    exp.startDate = startDate;
    exp.endDate = endDate;
    exp.type = type;
    exp.highlights = highlights;

    await exp.save();

    await AuditLog.create({
      userId: user.id,
      userName: user.name,
      userEmail: user.email,
      action: 'UPDATE_EXPERIENCE',
      details: `Updated career timeline item "${title}" at ${company} (ID: ${id})`,
      ip: '127.0.0.1',
    });

    revalidatePath('/');
    revalidatePath('/admin/profile');
    return { success: 'Timeline item updated successfully!' };
  } catch (err: any) {
    return { error: err.message || 'An error occurred' };
  }
}

export async function deleteExperienceAction(id: string) {
  const user = await getCurrentUser();
  if (!user || (user.role !== 'SUPER_ADMIN' && user.role !== 'ADMIN')) {
    throw new Error('Unauthorized');
  }

  try {
    await connectDB();
    const exp = await Experience.findByIdAndDelete(id);
    if (!exp) {
      throw new Error('Timeline item not found');
    }

    await AuditLog.create({
      userId: user.id,
      userName: user.name,
      userEmail: user.email,
      action: 'DELETE_EXPERIENCE',
      details: `Deleted career timeline item "${exp.title}" (ID: ${id})`,
      ip: '127.0.0.1',
    });

    revalidatePath('/');
    revalidatePath('/admin/profile');
    return { success: true };
  } catch (err: any) {
    return { error: err.message || 'An error occurred' };
  }
}
