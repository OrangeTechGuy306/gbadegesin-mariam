'use server';

import connectDB from '@/lib/db';
import Testimonial from '@/models/testimonial';
import AuditLog from '@/models/audit_log';
import { getCurrentUser } from './auth';
import { revalidatePath } from 'next/cache';

export async function createTestimonialAction(prevState: any, formData: FormData) {
  const user = await getCurrentUser();
  if (!user || (user.role !== 'SUPER_ADMIN' && user.role !== 'ADMIN')) {
    return { error: 'Unauthorized operation' };
  }

  const name = formData.get('name')?.toString().trim();
  const role = formData.get('role')?.toString().trim();
  const company = formData.get('company')?.toString().trim();
  const text = formData.get('text')?.toString().trim();
  const rating = Number(formData.get('rating')) || 5;
  const avatar = formData.get('avatar')?.toString().trim() || '/images/avatar-placeholder.png';

  if (!name || !role || !company || !text) {
    return { error: 'Name, Role, Company, and Recommendation text are required' };
  }

  try {
    await connectDB();
    const newTestimonial = await Testimonial.create({
      name,
      role,
      company,
      text,
      rating,
      avatar,
    });

    // Write to Audit Logs
    await AuditLog.create({
      userId: user.id,
      userName: user.name,
      userEmail: user.email,
      action: 'CREATE_TESTIMONIAL',
      details: `Created testimonial from "${name}" (ID: ${newTestimonial._id})`,
      ip: '127.0.0.1',
    });

    revalidatePath('/');
    revalidatePath('/admin/testimonials');
    return { success: 'Testimonial added successfully!' };
  } catch (err: any) {
    return { error: err.message || 'An error occurred' };
  }
}

export async function updateTestimonialAction(prevState: any, formData: FormData) {
  const user = await getCurrentUser();
  if (!user || (user.role !== 'SUPER_ADMIN' && user.role !== 'ADMIN')) {
    return { error: 'Unauthorized operation' };
  }

  const id = formData.get('id')?.toString();
  const name = formData.get('name')?.toString().trim();
  const role = formData.get('role')?.toString().trim();
  const company = formData.get('company')?.toString().trim();
  const text = formData.get('text')?.toString().trim();
  const rating = Number(formData.get('rating')) || 5;
  const avatar = formData.get('avatar')?.toString().trim();

  if (!id || !name || !role || !company || !text) {
    return { error: 'ID, Name, Role, Company, and Recommendation text are required' };
  }

  try {
    await connectDB();
    const testimonial = await Testimonial.findById(id);
    if (!testimonial) {
      return { error: 'Testimonial not found' };
    }

    testimonial.name = name;
    testimonial.role = role;
    testimonial.company = company;
    testimonial.text = text;
    testimonial.rating = rating;
    if (avatar) testimonial.avatar = avatar;

    await testimonial.save();

    // Write to Audit Logs
    await AuditLog.create({
      userId: user.id,
      userName: user.name,
      userEmail: user.email,
      action: 'UPDATE_TESTIMONIAL',
      details: `Updated testimonial from "${name}" (ID: ${id})`,
      ip: '127.0.0.1',
    });

    revalidatePath('/');
    revalidatePath('/admin/testimonials');
    return { success: 'Testimonial updated successfully!' };
  } catch (err: any) {
    return { error: err.message || 'An error occurred' };
  }
}

export async function deleteTestimonialAction(id: string) {
  const user = await getCurrentUser();
  if (!user || (user.role !== 'SUPER_ADMIN' && user.role !== 'ADMIN')) {
    throw new Error('Unauthorized');
  }

  try {
    await connectDB();
    const testimonial = await Testimonial.findByIdAndDelete(id);
    if (!testimonial) {
      throw new Error('Testimonial not found');
    }

    // Write to Audit Logs
    await AuditLog.create({
      userId: user.id,
      userName: user.name,
      userEmail: user.email,
      action: 'DELETE_TESTIMONIAL',
      details: `Deleted testimonial from "${testimonial.name}" (ID: ${id})`,
      ip: '127.0.0.1',
    });

    revalidatePath('/');
    revalidatePath('/admin/testimonials');
    return { success: true };
  } catch (err: any) {
    return { error: err.message || 'An error occurred' };
  }
}
