'use server';

import connectDB from '@/lib/db';
import Certification from '@/models/certification';
import AuditLog from '@/models/audit_log';
import { getCurrentUser } from './auth';
import { revalidatePath } from 'next/cache';

export async function createCertificationAction(prevState: any, formData: FormData) {
  const user = await getCurrentUser();
  if (!user || (user.role !== 'SUPER_ADMIN' && user.role !== 'ADMIN')) {
    return { error: 'Unauthorized operation' };
  }

  const name = formData.get('name')?.toString().trim();
  const organization = formData.get('organization')?.toString().trim();
  const issueDate = formData.get('issueDate')?.toString().trim();
  const expirationDate = formData.get('expirationDate')?.toString().trim() || 'No Expiration';
  const credentialId = formData.get('credentialId')?.toString().trim();
  const verificationUrl = formData.get('verificationUrl')?.toString().trim();
  const image = formData.get('image')?.toString().trim() || '/images/cert-placeholder.png';

  if (!name || !organization || !issueDate) {
    return { error: 'Certification Name, Issuing Organization, and Issue Date are required' };
  }

  try {
    await connectDB();
    const newCert = await Certification.create({
      name,
      organization,
      issueDate,
      expirationDate,
      credentialId,
      verificationUrl,
      image,
    });

    await AuditLog.create({
      userId: user.id,
      userName: user.name,
      userEmail: user.email,
      action: 'CREATE_CERTIFICATION',
      details: `Created certification record "${name}" from ${organization} (ID: ${newCert._id})`,
      ip: '127.0.0.1',
    });

    revalidatePath('/');
    revalidatePath('/admin/profile');
    return { success: 'Certification added successfully!' };
  } catch (err: any) {
    return { error: err.message || 'An error occurred' };
  }
}

export async function updateCertificationAction(prevState: any, formData: FormData) {
  const user = await getCurrentUser();
  if (!user || (user.role !== 'SUPER_ADMIN' && user.role !== 'ADMIN')) {
    return { error: 'Unauthorized operation' };
  }

  const id = formData.get('id')?.toString();
  const name = formData.get('name')?.toString().trim();
  const organization = formData.get('organization')?.toString().trim();
  const issueDate = formData.get('issueDate')?.toString().trim();
  const expirationDate = formData.get('expirationDate')?.toString().trim() || 'No Expiration';
  const credentialId = formData.get('credentialId')?.toString().trim();
  const verificationUrl = formData.get('verificationUrl')?.toString().trim();
  const image = formData.get('image')?.toString().trim();

  if (!id || !name || !organization || !issueDate) {
    return { error: 'ID, Certification Name, Issuing Organization, and Issue Date are required' };
  }

  try {
    await connectDB();
    const cert = await Certification.findById(id);
    if (!cert) {
      return { error: 'Certification record not found' };
    }

    cert.name = name;
    cert.organization = organization;
    cert.issueDate = issueDate;
    cert.expirationDate = expirationDate;
    cert.credentialId = credentialId;
    cert.verificationUrl = verificationUrl;
    if (image) cert.image = image;

    await cert.save();

    await AuditLog.create({
      userId: user.id,
      userName: user.name,
      userEmail: user.email,
      action: 'UPDATE_CERTIFICATION',
      details: `Updated certification record "${name}" (ID: ${id})`,
      ip: '127.0.0.1',
    });

    revalidatePath('/');
    revalidatePath('/admin/profile');
    return { success: 'Certification updated successfully!' };
  } catch (err: any) {
    return { error: err.message || 'An error occurred' };
  }
}

export async function deleteCertificationAction(id: string) {
  const user = await getCurrentUser();
  if (!user || (user.role !== 'SUPER_ADMIN' && user.role !== 'ADMIN')) {
    throw new Error('Unauthorized');
  }

  try {
    await connectDB();
    const cert = await Certification.findByIdAndDelete(id);
    if (!cert) {
      throw new Error('Certification record not found');
    }

    await AuditLog.create({
      userId: user.id,
      userName: user.name,
      userEmail: user.email,
      action: 'DELETE_CERTIFICATION',
      details: `Deleted certification record "${cert.name}" (ID: ${id})`,
      ip: '127.0.0.1',
    });

    revalidatePath('/');
    revalidatePath('/admin/profile');
    return { success: true };
  } catch (err: any) {
    return { error: err.message || 'An error occurred' };
  }
}
