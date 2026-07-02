'use client';

import * as React from 'react';
import { Plus, Trash2, X, FileText, Edit3 } from 'lucide-react';
import { createBlogAction, deleteBlogAction, updateBlogAction } from '@/server/actions/blog';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';

const blogFormSchema = z.object({
  title: z.string().min(5, 'Title must be at least 5 characters'),
  summary: z.string().min(10, 'Summary must be at least 10 characters'),
  content: z.string().min(20, 'Content must be at least 20 characters'),
  category: z.string().min(2, 'Category must be at least 2 characters'),
  coverImage: z.string().url('Please enter a valid cover image URL').optional().or(z.literal('')),
});

type BlogFormValues = z.infer<typeof blogFormSchema>;

interface AdminBlogsManagerProps {
  initialBlogs: any[];
}

export function AdminBlogsManager({ initialBlogs }: AdminBlogsManagerProps) {
  const [blogs, setBlogs] = React.useState(initialBlogs);
  const [isModalOpen, setIsModalOpen] = React.useState(false);
  const [editingBlog, setEditingBlog] = React.useState<any | null>(null);
  const [error, setError] = React.useState<string | null>(null);
  const [success, setSuccess] = React.useState<string | null>(null);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<BlogFormValues>({
    resolver: zodResolver(blogFormSchema),
  });

  const openAddModal = () => {
    setEditingBlog(null);
    reset({
      title: '',
      summary: '',
      content: '',
      category: 'SQL Performance',
      coverImage: '',
    });
    setError(null);
    setSuccess(null);
    setIsModalOpen(true);
  };

  const openEditModal = (blog: any) => {
    setEditingBlog(blog);
    reset({
      title: blog.title,
      summary: blog.summary,
      content: blog.content,
      category: blog.category,
      coverImage: blog.coverImage || '',
    });
    setError(null);
    setSuccess(null);
    setIsModalOpen(true);
  };

  const onSubmit = async (values: BlogFormValues) => {
    setError(null);
    setSuccess(null);
    const fd = new FormData();
    Object.entries(values).forEach(([k, v]) => {
      if (v !== undefined) fd.append(k, v);
    });

    let result;
    if (editingBlog) {
      fd.append('id', editingBlog._id);
      result = await updateBlogAction(null, fd);
    } else {
      result = await createBlogAction(null, fd);
    }

    if (result.error) {
      setError(result.error);
    } else {
      setSuccess(result.success || (editingBlog ? 'Blog post updated successfully!' : 'Blog published successfully!'));
      setTimeout(() => {
        setIsModalOpen(false);
        window.location.reload();
      }, 800);
    }
  };

  const handleDelete = async (id: string) => {
    if (confirm('Are you sure you want to delete this article?')) {
      const res = await deleteBlogAction(id);
      if (res.error) {
        alert(res.error);
      } else {
        setBlogs((prev) => prev.filter((b) => b._id !== id));
      }
    }
  };

  return (
    <div className="space-y-6">
      {/* Trigger Add Button */}
      <div className="flex justify-end">
        <button
          onClick={openAddModal}
          className="inline-flex items-center space-x-1.5 px-4 py-2 text-xs font-semibold rounded-lg bg-primary text-primary-foreground hover:opacity-90 shadow-md transition-all"
        >
          <Plus className="w-4 h-4" />
          <span>Write New Article</span>
        </button>
      </div>

      {/* Blogs List */}
      <div className="bg-card border border-border/40 rounded-2xl overflow-hidden shadow-sm">
        <table className="w-full text-left text-xs border-collapse">
          <thead>
            <tr className="bg-secondary/40 border-b border-border/30 text-muted-foreground font-semibold">
              <th className="p-4">Cover</th>
              <th className="p-4">Title</th>
              <th className="p-4">Category</th>
              <th className="p-4">Status</th>
              <th className="p-4 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border/20">
            {blogs.map((b) => (
              <tr key={b._id} className="hover:bg-secondary/15 transition-colors">
                <td className="p-4">
                  <div className="w-12 h-8 rounded bg-muted overflow-hidden">
                    <img src={b.coverImage} alt={b.title} className="object-cover w-full h-full" />
                  </div>
                </td>
                <td className="p-4 font-bold text-foreground truncate max-w-[200px]">{b.title}</td>
                <td className="p-4"><span className="px-2 py-0.5 rounded bg-primary/10 text-primary font-bold text-[10px]">{b.category}</span></td>
                <td className="p-4 text-muted-foreground font-semibold uppercase text-[10px]">{b.status}</td>
                <td className="p-4 text-right space-x-1.5">
                  <button
                    onClick={() => openEditModal(b)}
                    className="p-1.5 rounded hover:bg-secondary text-primary transition-colors inline-flex"
                    aria-label="Edit blog post"
                  >
                    <Edit3 className="w-3.5 h-3.5" />
                  </button>
                  <button
                    onClick={() => handleDelete(b._id)}
                    className="p-1.5 rounded hover:bg-secondary text-destructive transition-colors inline-flex"
                    aria-label="Delete blog post"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Write Blog Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-card w-full max-w-2xl max-h-[85vh] rounded-3xl overflow-y-auto border border-border shadow-2xl flex flex-col p-6 sm:p-8 space-y-6">
            <div className="flex justify-between items-center border-b border-border/40 pb-4">
              <h3 className="text-sm font-bold text-foreground">
                {editingBlog ? 'Edit Blog Article' : 'Write Blog Article'}
              </h3>
              <button onClick={() => setIsModalOpen(false)} className="p-1.5 rounded-full hover:bg-secondary text-muted-foreground">
                <X className="w-4 h-4" />
              </button>
            </div>

            {error && <div className="p-3 rounded-lg bg-destructive/10 text-destructive text-xs font-semibold">{error}</div>}
            {success && <div className="p-3 rounded-lg bg-emerald-500/10 text-emerald-500 text-xs font-semibold">{success}</div>}

            <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="text-[10px] font-bold uppercase tracking-wider text-foreground">Article Title</label>
                  <input
                    type="text"
                    {...register('title')}
                    className="w-full px-3 py-2.5 border border-border/60 rounded-xl bg-secondary/15 text-xs focus:outline-none focus:ring-1 focus:ring-primary"
                  />
                  {errors.title && <p className="text-[10px] text-red-500">{errors.title.message}</p>}
                </div>

                <div className="space-y-1">
                  <label className="text-[10px] font-bold uppercase tracking-wider text-foreground">Category</label>
                  <input
                    type="text"
                    {...register('category')}
                    className="w-full px-3 py-2.5 border border-border/60 rounded-xl bg-secondary/15 text-xs focus:outline-none focus:ring-1 focus:ring-primary"
                  />
                  {errors.category && <p className="text-[10px] text-red-500">{errors.category.message}</p>}
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="text-[10px] font-bold uppercase tracking-wider text-foreground">Cover Image URL</label>
                  <input
                    type="text"
                    {...register('coverImage')}
                    className="w-full px-3 py-2.5 border border-border/60 rounded-xl bg-secondary/15 text-xs focus:outline-none focus:ring-1 focus:ring-primary"
                  />
                  {errors.coverImage && <p className="text-[10px] text-red-500">{errors.coverImage.message}</p>}
                </div>

                <div className="space-y-1">
                  <label className="text-[10px] font-bold uppercase tracking-wider text-foreground">Brief Summary</label>
                  <input
                    type="text"
                    {...register('summary')}
                    className="w-full px-3 py-2.5 border border-border/60 rounded-xl bg-secondary/15 text-xs focus:outline-none focus:ring-1 focus:ring-primary"
                  />
                  {errors.summary && <p className="text-[10px] text-red-500">{errors.summary.message}</p>}
                </div>
              </div>

              <div className="space-y-1">
                <label className="text-[10px] font-bold uppercase tracking-wider text-foreground">Article Content (Markdown/HTML supported)</label>
                <textarea
                  rows={8}
                  {...register('content')}
                  className="w-full px-3 py-2.5 border border-border/60 rounded-xl bg-secondary/15 text-xs focus:outline-none focus:ring-1 focus:ring-primary"
                />
                {errors.content && <p className="text-[10px] text-red-500">{errors.content.message}</p>}
              </div>

              <button
                disabled={isSubmitting}
                type="submit"
                className="w-full py-3 rounded-xl bg-primary text-primary-foreground font-semibold text-xs hover:opacity-90 transition-opacity flex items-center justify-center space-x-1 shadow-md"
              >
                <FileText className="w-4 h-4" />
                <span>
                  {isSubmitting
                    ? editingBlog
                      ? 'Saving Changes...'
                      : 'Publishing...'
                    : editingBlog
                    ? 'Save Changes'
                    : 'Publish Article'}
                </span>
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
