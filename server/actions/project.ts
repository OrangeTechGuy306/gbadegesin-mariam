'use server';

import connectDB from '@/lib/db';
import Project from '@/models/project';
import AuditLog from '@/models/audit_log';
import { getCurrentUser } from './auth';
import { revalidatePath } from 'next/cache';

export async function createProjectAction(prevState: any, formData: FormData) {
  const user = await getCurrentUser();
  if (!user || (user.role !== 'SUPER_ADMIN' && user.role !== 'ADMIN' && user.role !== 'EDITOR')) {
    return { error: 'Unauthorized operation' };
  }

  const title = formData.get('title')?.toString().trim();
  const description = formData.get('description')?.toString().trim();
  const category = formData.get('category')?.toString();
  const coverImage = formData.get('coverImage')?.toString().trim() || 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?q=80&w=600';
  const technologiesRaw = formData.get('technologies')?.toString() || '';
  const problemStatement = formData.get('problemStatement')?.toString().trim();
  const methodology = formData.get('methodology')?.toString().trim();
  const dataset = formData.get('dataset')?.toString().trim();
  const results = formData.get('results')?.toString().trim();
  const businessImpact = formData.get('businessImpact')?.toString().trim();
  const liveUrl = formData.get('liveUrl')?.toString().trim();
  const githubUrl = formData.get('githubUrl')?.toString().trim();

  if (!title || !description || !category) {
    return { error: 'Title, Description, and Category are required' };
  }

  const technologies = technologiesRaw
    .split(',')
    .map((t) => t.trim())
    .filter((t) => t !== '');

  try {
    await connectDB();
    const newProject = await Project.create({
      title,
      description,
      category,
      coverImage,
      technologies,
      problemStatement,
      methodology,
      dataset,
      results,
      businessImpact,
      liveUrl,
      githubUrl,
    });

    // Write to Audit Logs
    await AuditLog.create({
      userId: user.id,
      userName: user.name,
      userEmail: user.email,
      action: 'CREATE_PROJECT',
      details: `Created project "${title}" (ID: ${newProject._id})`,
      ip: '127.0.0.1',
    });

    revalidatePath('/');
    revalidatePath('/admin/projects');
    return { success: 'Project created successfully!' };
  } catch (err: any) {
    return { error: err.message || 'An error occurred' };
  }
}

export async function updateProjectAction(prevState: any, formData: FormData) {
  const user = await getCurrentUser();
  if (!user || (user.role !== 'SUPER_ADMIN' && user.role !== 'ADMIN' && user.role !== 'EDITOR')) {
    return { error: 'Unauthorized operation' };
  }

  const id = formData.get('id')?.toString();
  const title = formData.get('title')?.toString().trim();
  const description = formData.get('description')?.toString().trim();
  const category = formData.get('category')?.toString();
  const coverImage = formData.get('coverImage')?.toString().trim();
  const technologiesRaw = formData.get('technologies')?.toString() || '';
  const problemStatement = formData.get('problemStatement')?.toString().trim();
  const methodology = formData.get('methodology')?.toString().trim();
  const dataset = formData.get('dataset')?.toString().trim();
  const results = formData.get('results')?.toString().trim();
  const businessImpact = formData.get('businessImpact')?.toString().trim();
  const liveUrl = formData.get('liveUrl')?.toString().trim();
  const githubUrl = formData.get('githubUrl')?.toString().trim();

  if (!id || !title || !description || !category) {
    return { error: 'ID, Title, Description, and Category are required' };
  }

  const technologies = technologiesRaw
    .split(',')
    .map((t) => t.trim())
    .filter((t) => t !== '');

  try {
    await connectDB();
    const project = await Project.findById(id);
    if (!project) {
      return { error: 'Project not found' };
    }

    project.title = title;
    project.description = description;
    project.category = category;
    if (coverImage) project.coverImage = coverImage;
    project.technologies = technologies;
    project.problemStatement = problemStatement;
    project.methodology = methodology;
    project.dataset = dataset;
    project.results = results;
    project.businessImpact = businessImpact;
    project.liveUrl = liveUrl;
    project.githubUrl = githubUrl;

    await project.save();

    // Write to Audit Logs
    await AuditLog.create({
      userId: user.id,
      userName: user.name,
      userEmail: user.email,
      action: 'UPDATE_PROJECT',
      details: `Updated project "${title}" (ID: ${id})`,
      ip: '127.0.0.1',
    });

    revalidatePath('/');
    revalidatePath('/admin/projects');
    return { success: 'Project updated successfully!' };
  } catch (err: any) {
    return { error: err.message || 'An error occurred' };
  }
}

export async function deleteProjectAction(id: string) {
  const user = await getCurrentUser();
  if (!user || (user.role !== 'SUPER_ADMIN' && user.role !== 'ADMIN' && user.role !== 'EDITOR')) {
    throw new Error('Unauthorized');
  }

  try {
    await connectDB();
    const project = await Project.findByIdAndDelete(id);
    if (!project) {
      throw new Error('Project not found');
    }

    // Write to Audit Logs
    await AuditLog.create({
      userId: user.id,
      userName: user.name,
      userEmail: user.email,
      action: 'DELETE_PROJECT',
      details: `Deleted project "${project.title}" (ID: ${id})`,
      ip: '127.0.0.1',
    });

    revalidatePath('/');
    revalidatePath('/admin/projects');
    return { success: true };
  } catch (err: any) {
    return { error: err.message || 'An error occurred' };
  }
}
