'use server';

import connectDB from '@/lib/db';
import Message from '@/models/message';
import AuditLog from '@/models/audit_log';
import { getCurrentUser } from './auth';
import { revalidatePath } from 'next/cache';

export async function submitMessageAction(prevState: any, formData: FormData) {
  const name = formData.get('name')?.toString().trim();
  const email = formData.get('email')?.toString().trim();
  const subject = formData.get('subject')?.toString().trim();
  const message = formData.get('message')?.toString().trim();

  if (!name || !email || !message) {
    return { error: 'Name, email, and message are required fields.' };
  }

  try {
    await connectDB();
    await Message.create({
      name,
      email,
      subject: subject || 'No Subject',
      message,
      read: false,
    });

    revalidatePath('/admin/messages');
    return { success: 'Message sent successfully!' };
  } catch (err: any) {
    return { error: err.message || 'An error occurred while sending the message.' };
  }
}

export async function markMessageReadAction(id: string, read: boolean) {
  const user = await getCurrentUser();
  if (!user || (user.role !== 'SUPER_ADMIN' && user.role !== 'ADMIN' && user.role !== 'EDITOR')) {
    return { error: 'Unauthorized operation' };
  }

  try {
    await connectDB();
    const msg = await Message.findById(id);
    if (!msg) {
      return { error: 'Message not found' };
    }

    msg.read = read;
    await msg.save();

    await AuditLog.create({
      userId: user.id,
      userName: user.name,
      userEmail: user.email,
      action: 'UPDATE_MESSAGE_STATUS',
      details: `Marked message from "${msg.name}" as ${read ? 'read' : 'unread'} (ID: ${id})`,
      ip: '127.0.0.1',
    });

    revalidatePath('/admin/messages');
    return { success: 'Message status updated successfully!' };
  } catch (err: any) {
    return { error: err.message || 'An error occurred' };
  }
}

export async function deleteMessageAction(id: string) {
  const user = await getCurrentUser();
  if (!user || (user.role !== 'SUPER_ADMIN' && user.role !== 'ADMIN' && user.role !== 'EDITOR')) {
    return { error: 'Unauthorized operation' };
  }

  try {
    await connectDB();
    const msg = await Message.findByIdAndDelete(id);
    if (!msg) {
      return { error: 'Message not found' };
    }

    await AuditLog.create({
      userId: user.id,
      userName: user.name,
      userEmail: user.email,
      action: 'DELETE_MESSAGE',
      details: `Deleted contact message from "${msg.name}" (${msg.email}) (ID: ${id})`,
      ip: '127.0.0.1',
    });

    revalidatePath('/admin/messages');
    return { success: 'Message deleted successfully!' };
  } catch (err: any) {
    return { error: err.message || 'An error occurred' };
  }
}
