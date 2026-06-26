import connectDB from '@/lib/db';
import Experience from '@/models/experience';
import Certification from '@/models/certification';
import { AdminProfileManager } from '@/components/admin-profile-manager';
import { getCurrentUser } from '@/server/actions/auth';
import { redirect } from 'next/navigation';

export const dynamic = 'force-dynamic';

export default async function ProfileAdminPage() {
  const user = await getCurrentUser();
  if (!user || (user.role !== 'SUPER_ADMIN' && user.role !== 'ADMIN')) {
    redirect('/login');
  }

  await connectDB();
  const experiences = await Experience.find({}).sort({ startDate: -1 }).lean();
  const certifications = await Certification.find({}).sort({ issueDate: -1 }).lean();

  const formattedExperiences = experiences.map((exp: any) => ({
    ...exp,
    _id: exp._id.toString(),
    createdAt: exp.createdAt?.toString(),
    updatedAt: exp.updatedAt?.toString(),
  }));
  const formattedCertifications = certifications.map((cert: any) => ({
    ...cert,
    _id: cert._id.toString(),
    createdAt: cert.createdAt?.toString(),
    updatedAt: cert.updatedAt?.toString(),
  }));

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-xl font-extrabold tracking-tight text-foreground sm:text-2xl">Profile Timeline</h1>
        <p className="text-xs text-muted-foreground">
          Manage your work experience, education, key achievements, and professional certifications.
        </p>
      </div>
      <AdminProfileManager
        initialExperiences={formattedExperiences}
        initialCertifications={formattedCertifications}
      />
    </div>
  );
}
