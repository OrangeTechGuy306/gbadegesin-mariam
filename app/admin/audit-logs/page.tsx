import * as React from 'react';
import connectDB from '@/lib/db';
import AuditLog from '@/models/audit_log';
import { getCurrentUser } from '@/server/actions/auth';
import { redirect } from 'next/navigation';
import { ShieldAlert, Terminal, Clock, ShieldCheck } from 'lucide-react';

async function getLogs() {
  try {
    await connectDB();
    const list = await AuditLog.find({}).sort({ createdAt: -1 }).limit(50);
    return JSON.parse(JSON.stringify(list));
  } catch (err) {
    console.error('Failed to query audit logs:', err);
    return [];
  }
}

export default async function AuditLogsPage() {
  const user = await getCurrentUser();

  // Route security layer: Restrict this route strictly to SUPER_ADMIN users
  if (!user || user.role !== 'SUPER_ADMIN') {
    return (
      <div className="min-h-[50vh] flex flex-col items-center justify-center text-center space-y-4">
        <div className="p-4 rounded-full bg-destructive/10 text-destructive">
          <ShieldAlert className="w-10 h-10" />
        </div>
        <h2 className="text-lg font-bold text-foreground">Access Denied</h2>
        <p className="text-xs text-muted-foreground max-w-sm">
          You do not have the required permissions to view the security audit trail. This resource is reserved for Super Administrator roles only.
        </p>
      </div>
    );
  }

  const logs = await getLogs();

  return (
    <div className="space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-xl font-bold tracking-tight text-foreground flex items-center space-x-2">
          <ShieldCheck className="w-6 h-6 text-primary" />
          <span>Security Audit Trail</span>
        </h1>
        <p className="text-xs text-muted-foreground mt-1">
          Review system modifications, user logins, and database alterations. Track IPs and operation payloads.
        </p>
      </div>

      {/* Log list table */}
      <div className="bg-card border border-border/40 rounded-2xl overflow-hidden shadow-sm">
        <table className="w-full text-left text-xs border-collapse">
          <thead>
            <tr className="bg-secondary/40 border-b border-border/30 text-muted-foreground font-semibold">
              <th className="p-4">Timestamp</th>
              <th className="p-4">User</th>
              <th className="p-4">Operation</th>
              <th className="p-4">Description</th>
              <th className="p-4">IP Address</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border/20 font-mono text-[11px]">
            {logs.length === 0 ? (
              <tr>
                <td colSpan={5} className="p-8 text-center text-muted-foreground italic">
                  No system log trails recorded yet.
                </td>
              </tr>
            ) : (
              logs.map((log: any) => (
                <tr key={log._id} className="hover:bg-secondary/15 transition-colors">
                  <td className="p-4 text-muted-foreground whitespace-nowrap">
                    <span className="flex items-center">
                      <Clock className="w-3.5 h-3.5 mr-1 text-primary" />
                      {new Date(log.createdAt).toLocaleString()}
                    </span>
                  </td>
                  <td className="p-4">
                    <div className="font-bold text-foreground">{log.userName}</div>
                    <div className="text-[10px] text-muted-foreground">{log.userEmail}</div>
                  </td>
                  <td className="p-4">
                    <span className={`px-2 py-0.5 rounded text-[9px] font-bold ${
                      log.action.includes('CREATE') ? 'bg-emerald-500/10 text-emerald-600' :
                      log.action.includes('DELETE') ? 'bg-red-500/10 text-red-600' :
                      'bg-blue-500/10 text-blue-600'
                    }`}>
                      {log.action}
                    </span>
                  </td>
                  <td className="p-4 text-foreground max-w-sm truncate">{log.details}</td>
                  <td className="p-4 text-muted-foreground font-semibold">{log.ip || '127.0.0.1'}</td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
