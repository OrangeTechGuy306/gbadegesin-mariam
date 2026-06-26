'use server';

import connectDB from '@/lib/db';
import Skill from '@/models/skill';
import AuditLog from '@/models/audit_log';
import { getCurrentUser } from './auth';
import { revalidatePath } from 'next/cache';

export async function createSkillAction(prevState: any, formData: FormData) {
  const user = await getCurrentUser();
  if (!user || (user.role !== 'SUPER_ADMIN' && user.role !== 'ADMIN')) {
    return { error: 'Unauthorized operation' };
  }

  const name = formData.get('name')?.toString().trim();
  const proficiency = Number(formData.get('proficiency'));
  const category = formData.get('category')?.toString();
  const radarValue = Number(formData.get('radarValue')) || 0;
  const bubbleSize = Number(formData.get('bubbleSize')) || 0;

  if (!name || !category || isNaN(proficiency)) {
    return { error: 'Name, Category, and valid Proficiency are required' };
  }

  try {
    await connectDB();
    const newSkill = await Skill.create({
      name,
      proficiency,
      category,
      radarValue,
      bubbleSize,
    });

    // Audit log
    await AuditLog.create({
      userId: user.id,
      userName: user.name,
      userEmail: user.email,
      action: 'CREATE_SKILL',
      details: `Created skill "${name}" (ID: ${newSkill._id})`,
      ip: '127.0.0.1',
    });

    revalidatePath('/');
    revalidatePath('/admin/skills');
    return { success: 'Skill created successfully!' };
  } catch (err: any) {
    return { error: err.message || 'An error occurred' };
  }
}

export async function updateSkillAction(prevState: any, formData: FormData) {
  const user = await getCurrentUser();
  if (!user || (user.role !== 'SUPER_ADMIN' && user.role !== 'ADMIN')) {
    return { error: 'Unauthorized operation' };
  }

  const id = formData.get('id')?.toString();
  const name = formData.get('name')?.toString().trim();
  const proficiency = Number(formData.get('proficiency'));
  const category = formData.get('category')?.toString();
  const radarValue = Number(formData.get('radarValue')) || 0;
  const bubbleSize = Number(formData.get('bubbleSize')) || 0;

  if (!id || !name || !category || isNaN(proficiency)) {
    return { error: 'ID, Name, Category, and valid Proficiency are required' };
  }

  try {
    await connectDB();
    const skill = await Skill.findById(id);
    if (!skill) {
      return { error: 'Skill not found' };
    }

    skill.name = name;
    skill.proficiency = proficiency;
    skill.category = category;
    skill.radarValue = radarValue;
    skill.bubbleSize = bubbleSize;
    await skill.save();

    // Audit log
    await AuditLog.create({
      userId: user.id,
      userName: user.name,
      userEmail: user.email,
      action: 'UPDATE_SKILL',
      details: `Updated skill "${name}" (ID: ${id})`,
      ip: '127.0.0.1',
    });

    revalidatePath('/');
    revalidatePath('/admin/skills');
    return { success: 'Skill updated successfully!' };
  } catch (err: any) {
    return { error: err.message || 'An error occurred' };
  }
}

export async function deleteSkillAction(id: string) {
  const user = await getCurrentUser();
  if (!user || (user.role !== 'SUPER_ADMIN' && user.role !== 'ADMIN')) {
    throw new Error('Unauthorized');
  }

  try {
    await connectDB();
    const skill = await Skill.findByIdAndDelete(id);
    if (!skill) {
      throw new Error('Skill not found');
    }

    // Audit log
    await AuditLog.create({
      userId: user.id,
      userName: user.name,
      userEmail: user.email,
      action: 'DELETE_SKILL',
      details: `Deleted skill "${skill.name}" (ID: ${id})`,
      ip: '127.0.0.1',
    });

    revalidatePath('/');
    revalidatePath('/admin/skills');
    return { success: true };
  } catch (err: any) {
    return { error: err.message || 'An error occurred' };
  }
}
