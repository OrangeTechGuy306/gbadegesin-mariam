import connectDB from '@/lib/db';
import User from '@/models/user';
import { AdminUsersManager } from '@/components/admin-users-manager';
import { getCurrentUser } from '@/server/actions/auth';
import { redirect } from 'next/navigation';

export const dynamic = 'force-dynamic';

export default async function UsersAdminPage() {
  const user = await getCurrentUser();
  
  // Super Admin only page
  if (!user || user.role !== 'SUPER_ADMIN') {
    redirect('/admin');
  }

  await connectDB();
  const users = await User.find({}).sort({ createdAt: -1 }).lean();

  const formattedUsers = users.map((u: any) => ({
    ...u,
    _id: u._id.toString(),
    createdAt: u.createdAt?.toString(),
    updatedAt: u.updatedAt?.toString(),
    loginHistory: u.loginHistory?.map((h: any) => ({
      ip: h.ip,
      userAgent: h.userAgent,
      timestamp: h.timestamp?.toISOString(),
    })) || [],
  }));

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-xl font-extrabold tracking-tight text-foreground sm:text-2xl">User Accounts</h1>
        <p className="text-xs text-muted-foreground">
          Manage system administrators, editor permissions, and view login activities.
        </p>
      </div>
      <AdminUsersManager initialUsers={formattedUsers} currentUserId={user.id} />
    </div>
  );
}
