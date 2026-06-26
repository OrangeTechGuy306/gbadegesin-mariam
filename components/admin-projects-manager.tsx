'use client';

import * as React from 'react';
import { Plus, Edit2, Trash2, X, PlusCircle, ExternalLink } from 'lucide-react';
import { createProjectAction, updateProjectAction, deleteProjectAction } from '@/server/actions/project';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';

const projectFormSchema = z.object({
  id: z.string().optional(),
  title: z.string().min(3, 'Title must be at least 3 characters'),
  description: z.string().min(10, 'Description must be at least 10 characters'),
  category: z.enum(['Power BI', 'Tableau', 'SQL', 'Python', 'Excel', 'Machine Learning']),
  technologies: z.string().min(1, 'Please enter at least one technology (comma separated)'),
  coverImage: z.string().url('Please enter a valid cover image URL').optional().or(z.literal('')),
  problemStatement: z.string().optional(),
  methodology: z.string().optional(),
  dataset: z.string().optional(),
  results: z.string().optional(),
  businessImpact: z.string().optional(),
  liveUrl: z.string().optional(),
  githubUrl: z.string().optional(),
});

type ProjectFormValues = z.infer<typeof projectFormSchema>;

interface AdminProjectsManagerProps {
  initialProjects: any[];
}

export function AdminProjectsManager({ initialProjects }: AdminProjectsManagerProps) {
  const [projects, setProjects] = React.useState(initialProjects);
  const [isModalOpen, setIsModalOpen] = React.useState(false);
  const [activeProject, setActiveProject] = React.useState<any | null>(null);
  const [error, setError] = React.useState<string | null>(null);
  const [success, setSuccess] = React.useState<string | null>(null);

  const {
    register,
    handleSubmit,
    setValue,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<ProjectFormValues>({
    resolver: zodResolver(projectFormSchema),
  });

  const openAddModal = () => {
    setActiveProject(null);
    reset({
      id: '',
      title: '',
      description: '',
      category: 'Power BI',
      technologies: '',
      coverImage: '',
      problemStatement: '',
      methodology: '',
      dataset: '',
      results: '',
      businessImpact: '',
      liveUrl: '',
      githubUrl: '',
    });
    setError(null);
    setSuccess(null);
    setIsModalOpen(true);
  };

  const openEditModal = (project: any) => {
    setActiveProject(project);
    reset({
      id: project._id,
      title: project.title,
      description: project.description,
      category: project.category,
      technologies: project.technologies.join(', '),
      coverImage: project.coverImage,
      problemStatement: project.problemStatement || '',
      methodology: project.methodology || '',
      dataset: project.dataset || '',
      results: project.results || '',
      businessImpact: project.businessImpact || '',
      liveUrl: project.liveUrl || '',
      githubUrl: project.githubUrl || '',
    });
    setError(null);
    setSuccess(null);
    setIsModalOpen(true);
  };

  const onSubmit = async (values: ProjectFormValues) => {
    setError(null);
    setSuccess(null);
    const fd = new FormData();
    Object.entries(values).forEach(([k, v]) => {
      if (v !== undefined) fd.append(k, v);
    });

    const result = values.id
      ? await updateProjectAction(null, fd)
      : await createProjectAction(null, fd);

    if (result.error) {
      setError(result.error);
    } else {
      setSuccess(result.success || 'Operation completed successfully!');
      // Reload projects list simulation (usually revalidated by next cache path reload)
      setTimeout(() => {
        setIsModalOpen(false);
        window.location.reload();
      }, 800);
    }
  };

  const handleDelete = async (id: string) => {
    if (confirm('Are you sure you want to delete this project?')) {
      const res = await deleteProjectAction(id);
      if (res.error) {
        alert(res.error);
      } else {
        setProjects((prev) => prev.filter((p) => p._id !== id));
      }
    }
  };

  return (
    <div className="space-y-6">
      {/* 1. Add Trigger Button */}
      <div className="flex justify-end">
        <button
          onClick={openAddModal}
          className="inline-flex items-center space-x-1.5 px-4 py-2 text-xs font-semibold rounded-lg bg-primary text-primary-foreground hover:opacity-90 shadow-md transition-all"
        >
          <Plus className="w-4 h-4" />
          <span>Add New Project</span>
        </button>
      </div>

      {/* 2. Projects Table */}
      <div className="bg-card border border-border/40 rounded-2xl overflow-hidden shadow-sm">
        <table className="w-full text-left text-xs border-collapse">
          <thead>
            <tr className="bg-secondary/40 border-b border-border/30 text-muted-foreground font-semibold">
              <th className="p-4">Cover</th>
              <th className="p-4">Title</th>
              <th className="p-4">Category</th>
              <th className="p-4">Technologies</th>
              <th className="p-4 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border/20">
            {projects.map((project) => (
              <tr key={project._id} className="hover:bg-secondary/15 transition-colors">
                <td className="p-4">
                  <div className="w-12 h-8 rounded bg-muted overflow-hidden">
                    <img src={project.coverImage} alt={project.title} className="object-cover w-full h-full" />
                  </div>
                </td>
                <td className="p-4 font-bold text-foreground truncate max-w-[180px]">{project.title}</td>
                <td className="p-4"><span className="px-2 py-0.5 rounded bg-primary/10 text-primary font-bold text-[10px]">{project.category}</span></td>
                <td className="p-4 text-muted-foreground truncate max-w-[180px]">{project.technologies.join(', ')}</td>
                <td className="p-4 text-right space-x-2">
                  <button
                    onClick={() => openEditModal(project)}
                    className="p-1.5 rounded hover:bg-secondary text-primary transition-colors inline-flex"
                    aria-label="Edit project"
                  >
                    <Edit2 className="w-3.5 h-3.5" />
                  </button>
                  <button
                    onClick={() => handleDelete(project._id)}
                    className="p-1.5 rounded hover:bg-secondary text-destructive transition-colors inline-flex"
                    aria-label="Delete project"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* 3. CRUD Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-card w-full max-w-2xl max-h-[85vh] rounded-3xl overflow-y-auto border border-border shadow-2xl flex flex-col p-6 sm:p-8 space-y-6">
            <div className="flex justify-between items-center border-b border-border/40 pb-4">
              <h3 className="text-sm font-bold text-foreground">{activeProject ? 'Edit Project' : 'Add New Project'}</h3>
              <button onClick={() => setIsModalOpen(false)} className="p-1.5 rounded-full hover:bg-secondary text-muted-foreground">
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Error / Success Banners */}
            {error && <div className="p-3 rounded-lg bg-destructive/10 text-destructive text-xs font-semibold">{error}</div>}
            {success && <div className="p-3 rounded-lg bg-emerald-500/10 text-emerald-500 text-xs font-semibold">{success}</div>}

            {/* Form */}
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="text-[10px] font-bold uppercase tracking-wider text-foreground">Project Title</label>
                  <input
                    type="text"
                    {...register('title')}
                    className="w-full px-3 py-2 border border-border/60 rounded-xl bg-secondary/15 text-xs focus:outline-none focus:ring-1 focus:ring-primary"
                  />
                  {errors.title && <p className="text-[10px] text-red-500">{errors.title.message}</p>}
                </div>

                <div className="space-y-1">
                  <label className="text-[10px] font-bold uppercase tracking-wider text-foreground">Category</label>
                  <select
                    {...register('category')}
                    className="w-full px-3 py-2 border border-border/60 rounded-xl bg-secondary/15 text-xs focus:outline-none focus:ring-1 focus:ring-primary"
                  >
                    <option value="Power BI">Power BI</option>
                    <option value="Tableau">Tableau</option>
                    <option value="SQL">SQL</option>
                    <option value="Python">Python</option>
                    <option value="Excel">Excel</option>
                    <option value="Machine Learning">Machine Learning</option>
                  </select>
                </div>
              </div>

              <div className="space-y-1">
                <label className="text-[10px] font-bold uppercase tracking-wider text-foreground">Short Description</label>
                <textarea
                  rows={2}
                  {...register('description')}
                  className="w-full px-3 py-2 border border-border/60 rounded-xl bg-secondary/15 text-xs focus:outline-none focus:ring-1 focus:ring-primary"
                />
                {errors.description && <p className="text-[10px] text-red-500">{errors.description.message}</p>}
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="text-[10px] font-bold uppercase tracking-wider text-foreground">Technologies (comma separated)</label>
                  <input
                    type="text"
                    {...register('technologies')}
                    placeholder="SQL, BigQuery, dbt"
                    className="w-full px-3 py-2 border border-border/60 rounded-xl bg-secondary/15 text-xs focus:outline-none focus:ring-1 focus:ring-primary"
                  />
                  {errors.technologies && <p className="text-[10px] text-red-500">{errors.technologies.message}</p>}
                </div>

                <div className="space-y-1">
                  <label className="text-[10px] font-bold uppercase tracking-wider text-foreground">Cover Image URL</label>
                  <input
                    type="text"
                    {...register('coverImage')}
                    placeholder="https://images.unsplash.com/photo-..."
                    className="w-full px-3 py-2 border border-border/60 rounded-xl bg-secondary/15 text-xs focus:outline-none focus:ring-1 focus:ring-primary"
                  />
                  {errors.coverImage && <p className="text-[10px] text-red-500">{errors.coverImage.message}</p>}
                </div>
              </div>

              {/* Case Study Details */}
              <div className="border-t border-border/40 pt-4 space-y-4">
                <h4 className="text-xs font-bold text-foreground uppercase tracking-wide">Case Study Parameters (Optional)</h4>

                <div className="space-y-1">
                  <label className="text-[10px] font-bold uppercase tracking-wider text-foreground">Problem Statement</label>
                  <textarea
                    rows={2}
                    {...register('problemStatement')}
                    className="w-full px-3 py-2 border border-border/60 rounded-xl bg-secondary/15 text-xs focus:outline-none focus:ring-1 focus:ring-primary"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-[10px] font-bold uppercase tracking-wider text-foreground">Methodology</label>
                  <textarea
                    rows={2}
                    {...register('methodology')}
                    className="w-full px-3 py-2 border border-border/60 rounded-xl bg-secondary/15 text-xs focus:outline-none focus:ring-1 focus:ring-primary"
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <div className="space-y-1">
                    <label className="text-[10px] font-bold uppercase tracking-wider text-foreground">Dataset</label>
                    <input
                      type="text"
                      {...register('dataset')}
                      className="w-full px-3 py-2 border border-border/60 rounded-xl bg-secondary/15 text-xs focus:outline-none focus:ring-1 focus:ring-primary"
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="text-[10px] font-bold uppercase tracking-wider text-foreground">Results</label>
                    <input
                      type="text"
                      {...register('results')}
                      className="w-full px-3 py-2 border border-border/60 rounded-xl bg-secondary/15 text-xs focus:outline-none focus:ring-1 focus:ring-primary"
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="text-[10px] font-bold uppercase tracking-wider text-foreground">Business Impact</label>
                    <input
                      type="text"
                      {...register('businessImpact')}
                      className="w-full px-3 py-2 border border-border/60 rounded-xl bg-secondary/15 text-xs focus:outline-none focus:ring-1 focus:ring-primary"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-1">
                    <label className="text-[10px] font-bold uppercase tracking-wider text-foreground">Live Demo URL</label>
                    <input
                      type="text"
                      {...register('liveUrl')}
                      className="w-full px-3 py-2 border border-border/60 rounded-xl bg-secondary/15 text-xs focus:outline-none focus:ring-1 focus:ring-primary"
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="text-[10px] font-bold uppercase tracking-wider text-foreground">GitHub Repo URL</label>
                    <input
                      type="text"
                      {...register('githubUrl')}
                      className="w-full px-3 py-2 border border-border/60 rounded-xl bg-secondary/15 text-xs focus:outline-none focus:ring-1 focus:ring-primary"
                    />
                  </div>
                </div>
              </div>

              <button
                disabled={isSubmitting}
                type="submit"
                className="w-full py-3 rounded-xl bg-primary text-primary-foreground font-semibold text-xs hover:opacity-90 transition-opacity flex items-center justify-center space-x-1 shadow-md"
              >
                {isSubmitting ? <span>Saving Changes...</span> : <span>Save Project</span>}
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
