import connectDB from '@/lib/db';
import Message from '@/models/message';
import { AdminMessagesManager } from '@/components/admin-messages-manager';
import { getCurrentUser } from '@/server/actions/auth';
import { redirect } from 'next/navigation';

export const dynamic = 'force-dynamic';

export default async function MessagesAdminPage() {
  const user = await getCurrentUser();
  if (!user || (user.role !== 'SUPER_ADMIN' && user.role !== 'ADMIN' && user.role !== 'EDITOR')) {
    redirect('/login?clear=1');
  }

  await connectDB();
  const messages = await Message.find({}).sort({ createdAt: -1 }).lean();

  const formattedMessages = messages.map((m: any) => ({
    ...m,
    _id: m._id.toString(),
    createdAt: m.createdAt?.toString(),
    updatedAt: m.updatedAt?.toString(),
  }));

  return (
    <div className="space-y-6 h-full">
      <div>
        <h1 className="text-xl font-extrabold tracking-tight text-foreground sm:text-2xl">Messages Inbox</h1>
        <p className="text-xs text-muted-foreground">
          View and manage direct inquiries sent from your portfolio website's contact form.
        </p>
      </div>
      <AdminMessagesManager initialMessages={formattedMessages} />
    </div>
  );
}
