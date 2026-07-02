'use server';

import connectDB from '@/lib/db';
import Blog from '@/models/blog';
import AuditLog from '@/models/audit_log';
import { getCurrentUser } from './auth';
import { revalidatePath } from 'next/cache';
import mongoose from 'mongoose';

export async function createBlogAction(prevState: any, formData: FormData) {
  const user = await getCurrentUser();
  if (!user || (user.role !== 'SUPER_ADMIN' && user.role !== 'ADMIN' && user.role !== 'EDITOR')) {
    return { error: 'Unauthorized operation' };
  }

  const title = formData.get('title')?.toString().trim();
  const summary = formData.get('summary')?.toString().trim();
  const content = formData.get('content')?.toString().trim();
  const category = formData.get('category')?.toString() || 'General';
  const coverImage = formData.get('coverImage')?.toString().trim() || 'https://images.unsplash.com/photo-1544383835-bda2bc66a55d?q=80&w=400';

  if (!title || !summary || !content) {
    return { error: 'Title, Summary, and Content are required' };
  }

  // Generate simple URL-friendly slug
  const slug = title
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)+/g, '');

  try {
    await connectDB();
    const newBlog = await Blog.create({
      title,
      slug,
      summary,
      content,
      category,
      coverImage,
      status: 'published',
      publishedAt: new Date(),
    });

    // Write to Audit Logs
    await AuditLog.create({
      userId: user.id,
      userName: user.name,
      userEmail: user.email,
      action: 'CREATE_BLOG',
      details: `Created blog article "${title}" (ID: ${newBlog._id})`,
      ip: '127.0.0.1',
    });

    revalidatePath('/');
    revalidatePath('/admin/blogs');
    return { success: 'Blog post published successfully!' };
  } catch (err: any) {
    return { error: err.message || 'An error occurred' };
  }
}

export async function deleteBlogAction(id: string) {
  const user = await getCurrentUser();
  if (!user || (user.role !== 'SUPER_ADMIN' && user.role !== 'ADMIN' && user.role !== 'EDITOR')) {
    throw new Error('Unauthorized');
  }

  try {
    await connectDB();
    const blog = await Blog.findByIdAndDelete(id);
    if (!blog) {
      throw new Error('Blog post not found');
    }

    // Write to Audit Logs
    await AuditLog.create({
      userId: user.id,
      userName: user.name,
      userEmail: user.email,
      action: 'DELETE_BLOG',
      details: `Deleted blog article "${blog.title}" (ID: ${id})`,
      ip: '127.0.0.1',
    });

    revalidatePath('/');
    revalidatePath('/admin/blogs');
    return { success: true };
  } catch (err: any) {
    return { error: err.message || 'An error occurred' };
  }
}

export async function incrementBlogViewsAction(id: string) {
  if (!mongoose.Types.ObjectId.isValid(id)) {
    return { success: true };
  }
  try {
    await connectDB();
    await Blog.findByIdAndUpdate(id, { $inc: { views: 1 } });
    revalidatePath('/');
    revalidatePath(`/blog/${id}`);
    return { success: true };
  } catch (err: any) {
    return { error: err.message || 'An error occurred' };
  }
}

export async function likeBlogAction(id: string) {
  if (!mongoose.Types.ObjectId.isValid(id)) {
    return { success: true, likes: id === '1' ? 183 : 99 };
  }
  try {
    await connectDB();
    const blog = await Blog.findByIdAndUpdate(id, { $inc: { likes: 1 } }, { new: true });
    revalidatePath('/');
    revalidatePath(`/blog/${id}`);
    return { success: true, likes: blog?.likes || 0 };
  } catch (err: any) {
    return { error: err.message || 'An error occurred' };
  }
}

export async function addCommentAction(prevState: any, formData: FormData) {
  const blogId = formData.get('blogId')?.toString();
  const name = formData.get('name')?.toString().trim();
  const text = formData.get('text')?.toString().trim();

  if (!blogId || !name || !text) {
    return { error: 'Blog ID, Name, and Comment text are required' };
  }

  if (name.length < 2) {
    return { error: 'Name must be at least 2 characters long' };
  }

  if (text.length < 3) {
    return { error: 'Comment must be at least 3 characters long' };
  }

  if (!mongoose.Types.ObjectId.isValid(blogId)) {
    if (blogId === '1' || blogId === '2') {
      return { success: 'Comment posted successfully (Mock Mode)!' };
    }
    return { error: 'Blog post not found' };
  }

  try {
    await connectDB();
    const blog = await Blog.findById(blogId);
    if (!blog) {
      return { error: 'Blog post not found' };
    }

    blog.comments.push({
      name,
      text,
      createdAt: new Date(),
    });

    await blog.save();

    revalidatePath('/');
    revalidatePath(`/blog/${blogId}`);
    return { success: 'Comment added successfully!' };
  } catch (err: any) {
    return { error: err.message || 'An error occurred' };
  }
}

export async function updateBlogAction(prevState: any, formData: FormData) {
  const user = await getCurrentUser();
  if (!user || (user.role !== 'SUPER_ADMIN' && user.role !== 'ADMIN' && user.role !== 'EDITOR')) {
    return { error: 'Unauthorized operation' };
  }

  const id = formData.get('id')?.toString();
  const title = formData.get('title')?.toString().trim();
  const summary = formData.get('summary')?.toString().trim();
  const content = formData.get('content')?.toString().trim();
  const category = formData.get('category')?.toString() || 'General';
  const coverImage = formData.get('coverImage')?.toString().trim();

  if (!id || !title || !summary || !content) {
    return { error: 'ID, Title, Summary, and Content are required' };
  }

  const slug = title
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)+/g, '');

  try {
    await connectDB();
    const blog = await Blog.findById(id);
    if (!blog) {
      return { error: 'Blog post not found' };
    }

    blog.title = title;
    blog.slug = slug;
    blog.summary = summary;
    blog.content = content;
    blog.category = category;
    if (coverImage) blog.coverImage = coverImage;

    await blog.save();

    // Write to Audit Logs
    await AuditLog.create({
      userId: user.id,
      userName: user.name,
      userEmail: user.email,
      action: 'UPDATE_BLOG',
      details: `Updated blog article "${title}" (ID: ${id})`,
      ip: '127.0.0.1',
    });

    revalidatePath('/');
    revalidatePath('/admin/blogs');
    revalidatePath(`/blog/${id}`);
    return { success: 'Blog post updated successfully!' };
  } catch (err: any) {
    return { error: err.message || 'An error occurred' };
  }
}

