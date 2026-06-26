'use client';

import * as React from 'react';
import { Plus, Edit2, Trash2, X } from 'lucide-react';
import { createSkillAction, updateSkillAction, deleteSkillAction } from '@/server/actions/skill';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';

const skillFormSchema = z.object({
  id: z.string().optional(),
  name: z.string().min(2, 'Name must be at least 2 characters'),
  proficiency: z.number().min(0).max(100, 'Proficiency must be between 0 and 100'),
  category: z.enum([
    'SQL', 'Python', 'Excel', 'Power BI', 'Tableau', 'R',
    'Statistics', 'Machine Learning', 'Data Cleaning',
    'Data Visualization', 'ETL', 'Business Intelligence'
  ]),
  radarValue: z.number().min(0).max(10, 'Radar value must be between 0 and 10'),
  bubbleSize: z.number().min(0).max(100, 'Bubble size must be between 0 and 100'),
});

type SkillFormValues = z.infer<typeof skillFormSchema>;

interface AdminSkillsManagerProps {
  initialSkills: any[];
}

export function AdminSkillsManager({ initialSkills }: AdminSkillsManagerProps) {
  const [skills, setSkills] = React.useState(initialSkills);
  const [isModalOpen, setIsModalOpen] = React.useState(false);
  const [activeSkill, setActiveSkill] = React.useState<any | null>(null);
  const [error, setError] = React.useState<string | null>(null);
  const [success, setSuccess] = React.useState<string | null>(null);

  const {
    register,
    handleSubmit,
    setValue,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<SkillFormValues>({
    resolver: zodResolver(skillFormSchema),
  });

  const openAddModal = () => {
    setActiveSkill(null);
    reset({
      id: '',
      name: '',
      proficiency: 80,
      category: 'SQL',
      radarValue: 8,
      bubbleSize: 80,
    });
    setError(null);
    setSuccess(null);
    setIsModalOpen(true);
  };

  const openEditModal = (skill: any) => {
    setActiveSkill(skill);
    reset({
      id: skill._id,
      name: skill.name,
      proficiency: skill.proficiency,
      category: skill.category,
      radarValue: skill.radarValue || 0,
      bubbleSize: skill.bubbleSize || 0,
    });
    setError(null);
    setSuccess(null);
    setIsModalOpen(true);
  };

  const onSubmit = async (values: SkillFormValues) => {
    setError(null);
    setSuccess(null);
    const fd = new FormData();
    Object.entries(values).forEach(([k, v]) => {
      if (v !== undefined) fd.append(k, v.toString());
    });

    const result = values.id
      ? await updateSkillAction(null, fd)
      : await createSkillAction(null, fd);

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

  const handleDelete = async (id: string) => {
    if (confirm('Are you sure you want to delete this skill?')) {
      const res = await deleteSkillAction(id);
      if (res.error) {
        alert(res.error);
      } else {
        setSkills((prev) => prev.filter((s) => s._id !== id));
      }
    }
  };

  return (
    <div className="space-y-6">
      {/* Add Button */}
      <div className="flex justify-end">
        <button
          onClick={openAddModal}
          className="inline-flex items-center space-x-1.5 px-4 py-2 text-xs font-semibold rounded-lg bg-primary text-primary-foreground hover:opacity-90 shadow-md transition-all"
        >
          <Plus className="w-4 h-4" />
          <span>Add New Skill</span>
        </button>
      </div>

      {/* Table */}
      <div className="bg-card border border-border/40 rounded-2xl overflow-hidden shadow-sm">
        <table className="w-full text-left text-xs border-collapse">
          <thead>
            <tr className="bg-secondary/40 border-b border-border/30 text-muted-foreground font-semibold">
              <th className="p-4">Name</th>
              <th className="p-4">Category</th>
              <th className="p-4">Proficiency</th>
              <th className="p-4">Radar / Bubble Scale</th>
              <th className="p-4 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border/20">
            {skills.map((skill) => (
              <tr key={skill._id} className="hover:bg-secondary/15 transition-colors">
                <td className="p-4 font-bold text-foreground">{skill.name}</td>
                <td className="p-4"><span className="px-2 py-0.5 rounded bg-primary/10 text-primary font-bold text-[10px]">{skill.category}</span></td>
                <td className="p-4 font-semibold text-primary">{skill.proficiency}%</td>
                <td className="p-4 text-muted-foreground">R: {skill.radarValue || 0} / B: {skill.bubbleSize || 0}</td>
                <td className="p-4 text-right space-x-2">
                  <button
                    onClick={() => openEditModal(skill)}
                    className="p-1.5 rounded hover:bg-secondary text-primary transition-colors inline-flex"
                  >
                    <Edit2 className="w-3.5 h-3.5" />
                  </button>
                  <button
                    onClick={() => handleDelete(skill._id)}
                    className="p-1.5 rounded hover:bg-secondary text-destructive transition-colors inline-flex"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-card w-full max-w-md rounded-3xl overflow-y-auto border border-border shadow-2xl flex flex-col p-6 space-y-6">
            <div className="flex justify-between items-center border-b border-border/40 pb-4">
              <h3 className="text-sm font-bold text-foreground">{activeSkill ? 'Edit Skill' : 'Add New Skill'}</h3>
              <button onClick={() => setIsModalOpen(false)} className="p-1.5 rounded-full hover:bg-secondary text-muted-foreground">
                <X className="w-4 h-4" />
              </button>
            </div>

            {error && <div className="p-3 rounded-lg bg-destructive/10 text-destructive text-xs font-semibold">{error}</div>}
            {success && <div className="p-3 rounded-lg bg-emerald-500/10 text-emerald-500 text-xs font-semibold">{success}</div>}

            <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
              <div className="space-y-1">
                <label className="text-[10px] font-bold uppercase tracking-wider text-foreground">Skill Name</label>
                <input
                  type="text"
                  {...register('name')}
                  placeholder="e.g. BigQuery Cohort Analytics"
                  className="w-full px-3 py-2.5 border border-border/60 rounded-xl bg-secondary/15 text-xs focus:outline-none focus:ring-1 focus:ring-primary"
                />
                {errors.name && <p className="text-[10px] text-red-500">{errors.name.message}</p>}
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="text-[10px] font-bold uppercase tracking-wider text-foreground">Category</label>
                  <select
                    {...register('category')}
                    className="w-full px-3 py-2.5 border border-border/60 rounded-xl bg-secondary/15 text-xs focus:outline-none focus:ring-1 focus:ring-primary"
                  >
                    <option value="SQL">SQL</option>
                    <option value="Python">Python</option>
                    <option value="Excel">Excel</option>
                    <option value="Power BI">Power BI</option>
                    <option value="Tableau">Tableau</option>
                    <option value="R">R</option>
                    <option value="Statistics">Statistics</option>
                    <option value="Machine Learning">Machine Learning</option>
                    <option value="Data Cleaning">Data Cleaning</option>
                    <option value="Data Visualization">Data Visualization</option>
                    <option value="ETL">ETL</option>
                    <option value="Business Intelligence">Business Intelligence</option>
                  </select>
                </div>

                <div className="space-y-1">
                  <label className="text-[10px] font-bold uppercase tracking-wider text-foreground">Proficiency (%)</label>
                  <input
                    type="number"
                    {...register('proficiency', { valueAsNumber: true })}
                    className="w-full px-3 py-2.5 border border-border/60 rounded-xl bg-secondary/15 text-xs focus:outline-none focus:ring-1 focus:ring-primary"
                  />
                  {errors.proficiency && <p className="text-[10px] text-red-500">{errors.proficiency.message}</p>}
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="text-[10px] font-bold uppercase tracking-wider text-foreground">Radar Scale (1-10)</label>
                  <input
                    type="number"
                    {...register('radarValue', { valueAsNumber: true })}
                    className="w-full px-3 py-2.5 border border-border/60 rounded-xl bg-secondary/15 text-xs focus:outline-none focus:ring-1 focus:ring-primary"
                  />
                  {errors.radarValue && <p className="text-[10px] text-red-500">{errors.radarValue.message}</p>}
                </div>

                <div className="space-y-1">
                  <label className="text-[10px] font-bold uppercase tracking-wider text-foreground">Bubble Scale (1-100)</label>
                  <input
                    type="number"
                    {...register('bubbleSize', { valueAsNumber: true })}
                    className="w-full px-3 py-2.5 border border-border/60 rounded-xl bg-secondary/15 text-xs focus:outline-none focus:ring-1 focus:ring-primary"
                  />
                  {errors.bubbleSize && <p className="text-[10px] text-red-500">{errors.bubbleSize.message}</p>}
                </div>
              </div>

              <button
                disabled={isSubmitting}
                type="submit"
                className="w-full py-3 rounded-xl bg-primary text-primary-foreground font-semibold text-xs hover:opacity-90 transition-opacity flex items-center justify-center space-x-1 shadow-md"
              >
                {isSubmitting ? <span>Saving Changes...</span> : <span>Save Skill</span>}
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
