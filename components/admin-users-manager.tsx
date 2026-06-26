'use client';

import * as React from 'react';
import { Plus, Edit2, Trash2, X, Shield, Mail, Calendar, Key, Clock, ShieldAlert } from 'lucide-react';
import { createUserAction, updateUserAction, deleteUserAction } from '@/server/actions/user';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';

const createUserFormSchema = z.object({
  id: z.string().optional(),
  name: z.string().min(2, 'Name must be at least 2 characters'),
  email: z.string().email('Please enter a valid email address'),
  password: z.string().min(6, 'Password must be at least 6 characters').optional().or(z.literal('')),
  role: z.enum(['SUPER_ADMIN', 'ADMIN', 'EDITOR']),
});

type UserFormValues = z.infer<typeof createUserFormSchema>;

interface AdminUsersManagerProps {
  initialUsers: any[];
  currentUserId: string;
}

export function AdminUsersManager({ initialUsers, currentUserId }: AdminUsersManagerProps) {
  const [users, setUsers] = React.useState(initialUsers);
  const [isModalOpen, setIsModalOpen] = React.useState(false);
  const [activeUser, setActiveUser] = React.useState<any | null>(null);
  const [error, setError] = React.useState<string | null>(null);
  const [success, setSuccess] = React.useState<string | null>(null);
  const [selectedUserHistory, setSelectedUserHistory] = React.useState<any | null>(null);

  const {
    register,
    handleSubmit,
    setValue,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<UserFormValues>({
    resolver: zodResolver(createUserFormSchema),
  });

  const openAddModal = () => {
    setActiveUser(null);
    reset({
      id: '',
      name: '',
      email: '',
      password: '',
      role: 'EDITOR',
    });
    setError(null);
    setSuccess(null);
    setIsModalOpen(true);
  };

  const openEditModal = (user: any) => {
    setActiveUser(user);
    reset({
      id: user._id,
      name: user.name,
      email: user.email,
      password: '',
      role: user.role || 'EDITOR',
    });
    setError(null);
    setSuccess(null);
    setIsModalOpen(true);
  };

  const onSubmit = async (values: UserFormValues) => {
    setError(null);
    setSuccess(null);

    // If creating, password is required
    if (!values.id && (!values.password || values.password.trim() === '')) {
      setError('Password is required for new accounts.');
      return;
    }

    const fd = new FormData();
    Object.entries(values).forEach(([k, v]) => {
      if (v !== undefined) fd.append(k, v.toString());
    });

    const result = values.id
      ? await updateUserAction(null, fd)
      : await createUserAction(null, fd);

    if (result.error) {
      setError(result.error);
    } else {
      setSuccess(result.success || 'Operation completed successfully!');
      setTimeout(() => {
        setIsModalOpen(false);
        window.location.reload();
      }, 800);
    }
  };

  const handleDelete = async (id: string, name: string) => {
    if (id === currentUserId) {
      alert('You cannot delete your own account.');
      return;
    }

    if (confirm(`Are you sure you want to delete the user account for "${name}"? This operation is permanent.`)) {
      const res = await deleteUserAction(id);
      if (res.error) {
        alert(res.error);
      } else {
        setUsers((prev) => prev.filter((u) => u._id !== id));
      }
    }
  };

  const getRoleBadge = (role: string) => {
    switch (role) {
      case 'SUPER_ADMIN':
        return (
          <span className="inline-flex items-center space-x-1 text-[10px] font-extrabold px-2 py-0.5 rounded-full bg-rose-500/10 text-rose-500 border border-rose-500/20">
            <Shield className="w-3 h-3" />
            <span>Super Admin</span>
          </span>
        );
      case 'ADMIN':
        return (
          <span className="inline-flex items-center space-x-1 text-[10px] font-extrabold px-2 py-0.5 rounded-full bg-sky-500/10 text-sky-500 border border-sky-500/20">
            <Shield className="w-3 h-3" />
            <span>Admin</span>
          </span>
        );
      default:
        return (
          <span className="inline-flex items-center space-x-1 text-[10px] font-extrabold px-2 py-0.5 rounded-full bg-amber-500/10 text-amber-500 border border-amber-500/20">
            <Shield className="w-3 h-3" />
            <span>Editor</span>
          </span>
        );
    }
  };

  return (
    <div className="space-y-6">
      {/* Header Add Button */}
      <div className="flex justify-between items-center">
        <p className="text-xs text-muted-foreground">
          Below are the authorized system administrators. Super Admins can add or revoke accounts.
        </p>
        <button
          onClick={openAddModal}
          className="inline-flex items-center space-x-1.5 px-4 py-2 text-xs font-bold rounded-lg bg-primary text-primary-foreground hover:opacity-90 shadow-md transition-all whitespace-nowrap"
        >
          <Plus className="w-4 h-4" />
          <span>Add User Account</span>
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Users Table */}
        <div className="lg:col-span-2 bg-card border border-border/40 rounded-2xl overflow-hidden shadow-sm">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="bg-secondary/40 border-b border-border/30 text-muted-foreground font-semibold">
                <th className="p-4">User</th>
                <th className="p-4">Role</th>
                <th className="p-4">History</th>
                <th className="p-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border/20">
              {users.map((u) => (
                <tr
                  key={u._id}
                  className={`hover:bg-secondary/15 transition-colors cursor-pointer ${
                    selectedUserHistory?._id === u._id ? 'bg-secondary/10' : ''
                  }`}
                  onClick={() => setSelectedUserHistory(u)}
                >
                  <td className="p-4 space-y-1">
                    <div className="font-bold text-foreground flex items-center space-x-1.5">
                      <span>{u.name}</span>
                      {u._id === currentUserId && (
                        <span className="text-[9px] font-bold px-1.5 py-0.2 rounded bg-primary/20 text-primary">
                          You
                        </span>
                      )}
                    </div>
                    <div className="text-[10px] text-muted-foreground flex items-center">
                      <Mail className="w-3 h-3 mr-1 text-muted-foreground/60" />
                      <span>{u.email}</span>
                    </div>
                  </td>
                  <td className="p-4">{getRoleBadge(u.role)}</td>
                  <td className="p-4">
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        setSelectedUserHistory(u);
                      }}
                      className="inline-flex items-center space-x-1 text-[10px] text-primary hover:underline font-bold"
                    >
                      <Clock className="w-3 h-3" />
                      <span>{u.loginHistory?.length || 0} Logins</span>
                    </button>
                  </td>
                  <td className="p-4 text-right space-x-2" onClick={(e) => e.stopPropagation()}>
                    <button
                      onClick={() => openEditModal(u)}
                      className="p-1.5 rounded hover:bg-secondary text-primary transition-colors inline-flex border border-border/20 bg-secondary/20"
                    >
                      <Edit2 className="w-3.5 h-3.5" />
                    </button>
                    <button
                      disabled={u._id === currentUserId}
                      onClick={() => handleDelete(u._id, u.name)}
                      className={`p-1.5 rounded transition-colors inline-flex border border-border/20 ${
                        u._id === currentUserId
                          ? 'opacity-40 cursor-not-allowed text-muted-foreground bg-secondary/10'
                          : 'hover:bg-secondary text-destructive bg-destructive/10'
                      }`}
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* User Login History Sidebar */}
        <div className="bg-card border border-border/40 p-5 rounded-2xl shadow-sm space-y-4 flex flex-col justify-between">
          <div>
            <h3 className="text-xs font-bold text-foreground flex items-center space-x-1.5 border-b border-border/40 pb-3">
              <Clock className="w-4 h-4 text-primary" />
              <span>Login History Details</span>
            </h3>

            {selectedUserHistory ? (
              <div className="mt-4 space-y-4">
                <div>
                  <h4 className="font-bold text-xs text-foreground">{selectedUserHistory.name}</h4>
                  <p className="text-[10px] text-muted-foreground">{selectedUserHistory.email}</p>
                </div>

                <div className="space-y-2 max-h-[300px] overflow-y-auto pr-1">
                  {selectedUserHistory.loginHistory && selectedUserHistory.loginHistory.length > 0 ? (
                    selectedUserHistory.loginHistory.slice().reverse().map((h: any, idx: number) => (
                      <div key={idx} className="p-2.5 rounded-xl bg-secondary/20 border border-border/20 space-y-1">
                        <div className="flex items-center justify-between text-[9px] text-muted-foreground font-mono">
                          <span>IP: {h.ip}</span>
                          <span>{new Date(h.timestamp).toLocaleDateString()}</span>
                        </div>
                        <p className="text-[9px] text-foreground truncate" title={h.userAgent}>
                          {h.userAgent}
                        </p>
                      </div>
                    ))
                  ) : (
                    <p className="text-[10px] text-muted-foreground italic py-4">No login history recorded yet.</p>
                  )}
                </div>
              </div>
            ) : (
              <p className="text-[10px] text-muted-foreground italic py-8 text-center">
                Select a user from the table to view their login history.
              </p>
            )}
          </div>

          <div className="p-3 bg-secondary/15 border border-border/20 rounded-xl flex items-start space-x-2.5">
            <ShieldAlert className="w-4 h-4 text-amber-500 mt-0.5 flex-shrink-0" />
            <p className="text-[9px] leading-relaxed text-muted-foreground">
              Only Super Admins possess access to User Accounts. Logins are audited and recorded in Security Audit Logs.
            </p>
          </div>
        </div>
      </div>

      {/* Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-card w-full max-w-md rounded-3xl overflow-y-auto border border-border shadow-2xl flex flex-col p-6 space-y-6">
            <div className="flex justify-between items-center border-b border-border/40 pb-4">
              <h3 className="text-sm font-bold text-foreground">
                {activeUser ? 'Edit User Account' : 'Add User Account'}
              </h3>
              <button
                onClick={() => setIsModalOpen(false)}
                className="p-1.5 rounded-full hover:bg-secondary text-muted-foreground"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {error && <div className="p-3 rounded-lg bg-destructive/10 text-destructive text-xs font-semibold">{error}</div>}
            {success && <div className="p-3 rounded-lg bg-emerald-500/10 text-emerald-500 text-xs font-semibold">{success}</div>}

            <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
              <input type="hidden" {...register('id')} />

              <div className="space-y-1">
                <label className="text-[10px] font-bold uppercase tracking-wider text-foreground">Full Name</label>
                <input
                  type="text"
                  {...register('name')}
                  placeholder="e.g. John Doe"
                  className="w-full px-3 py-2.5 border border-border/60 rounded-xl bg-secondary/15 text-xs focus:outline-none focus:ring-1 focus:ring-primary"
                />
                {errors.name && <p className="text-[10px] text-red-500">{errors.name.message}</p>}
              </div>

              <div className="space-y-1">
                <label className="text-[10px] font-bold uppercase tracking-wider text-foreground">Email Address</label>
                <input
                  type="email"
                  {...register('email')}
                  placeholder="e.g. admin@mariamgbadegesin.com"
                  className="w-full px-3 py-2.5 border border-border/60 rounded-xl bg-secondary/15 text-xs focus:outline-none focus:ring-1 focus:ring-primary"
                />
                {errors.email && <p className="text-[10px] text-red-500">{errors.email.message}</p>}
              </div>

              <div className="space-y-1">
                <label className="text-[10px] font-bold uppercase tracking-wider text-foreground">Role</label>
                <select
                  {...register('role')}
                  className="w-full px-3 py-2.5 border border-border/60 rounded-xl bg-secondary/15 text-xs focus:outline-none focus:ring-1 focus:ring-primary"
                >
                  <option value="EDITOR">Editor (Can view dashboard, write blogs/projects)</option>
                  <option value="ADMIN">Admin (All operations except User Management/Audit logs)</option>
                  <option value="SUPER_ADMIN">Super Admin (Full system permissions)</option>
                </select>
                {errors.role && <p className="text-[10px] text-red-500">{errors.role.message}</p>}
              </div>

              <div className="space-y-1">
                <div className="flex justify-between items-center">
                  <label className="text-[10px] font-bold uppercase tracking-wider text-foreground">Password</label>
                  {activeUser && (
                    <span className="text-[9px] text-muted-foreground italic">Leave blank to keep unchanged</span>
                  )}
                </div>
                <input
                  type="password"
                  {...register('password')}
                  placeholder={activeUser ? '••••••••' : 'Password (min 6 characters)'}
                  className="w-full px-3 py-2.5 border border-border/60 rounded-xl bg-secondary/15 text-xs focus:outline-none focus:ring-1 focus:ring-primary"
                />
                {errors.password && <p className="text-[10px] text-red-500">{errors.password.message}</p>}
              </div>

              <button
                disabled={isSubmitting}
                type="submit"
                className="w-full py-3 rounded-xl bg-primary text-primary-foreground font-bold text-xs hover:opacity-90 transition-opacity flex items-center justify-center space-x-1 shadow-md"
              >
                <span>Save User Account</span>
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
